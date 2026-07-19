import type { DocId, TokenId, BakaSearchOptions, SearchOptions, SearchResult } from "./types.js";
import { InvertedIndex } from "./indexer.js";
import { Tokenizer, expandQueryTokens } from "./tokenizer.js";
import { search, searchWeighted } from "./bm25.js";
import type { WeightedToken } from "./bm25.js";
import { BridgeTable } from "./BridgeTable.js";

export class BakaSearch {
  // 内部维护的倒排索引实例
  private _index = new InvertedIndex();
  // 要被分词索引的字段白名单，若未指定则自动检测
  private _fields: string[] | undefined;
  // BM25 打分的相关参数 (k1, b, d)
  private _bm25Params: { k1: number; b: number; d: number };

  // 自增内部 ID 生成器
  private _nextInternalId = 1;
  // 外部 ID 到内部 ID 的映射 Map
  private _idMapping = new Map<DocId, number>();
  // 内部 ID 到外部 ID 的反向映射 Map，用于搜索结果转换
  private _reverseIdMapping = new Map<number, DocId>();

  // 输入：可选配置 options，可以指定索引字段 fields 和 BM25 参数
  // 输出：BakaSearch 实例
  // 预期行为：保存相关参数，Tokenizer 采用全局静态调用，无需在此实例化
  constructor(options?: BakaSearchOptions) {
    this._fields = options?.fields;
    this._bm25Params = {
      k1: options?.bm25?.k1 ?? 1.2,
      b: options?.bm25?.b ?? 0.7,
      d: options?.bm25?.d ?? 0.5,
    };
  }

  // 输入：具有唯一 id 的文档，且可以包含多个字段
  // 输出：无
  // 预期行为：转换 ID 映射，过滤并提取 string 字段进行分词，累加 tokens 后存入 InvertedIndex
  add(doc: { id: DocId } & Record<string, string>): void {
    if ((doc.id as unknown) === undefined || (doc.id as unknown) === null) {
      throw new Error("Document must have a valid 'id' field");
    }

    // 如果该外部 ID 已存在，则执行覆盖逻辑（即先删除旧的记录）
    if (this._idMapping.has(doc.id)) {
      this.remove(doc.id);
    }

    const internalId = this._nextInternalId++;
    this._idMapping.set(doc.id, internalId);
    this._reverseIdMapping.set(internalId, doc.id);

    // 决定要索引的字段：优先采用配置的 _fields，否则自动筛选除 id 外所有值为 string 的字段
    const fieldsToProcess =
      this._fields ?? Object.keys(doc).filter((k) => k !== "id" && typeof doc[k] === "string");

    const tokens: number[] = [];
    const fieldsData: Record<string, string> = {};

    for (const field of fieldsToProcess) {
      const value = doc[field];
      if (typeof value === "string") {
        fieldsData[field] = value;
        // 索引时前补空格使首词带 ▁ 前缀，与查询 token 一致
        const fieldTokens = Tokenizer.encode(" " + value);
        tokens.push(...fieldTokens);
      }
    }

    this._index.addDocument(internalId, tokens, fieldsData);
  }

  // 输入：文档对象数组
  // 输出：无
  // 预期行为：循环添加各个文档
  addAll(docs: ({ id: DocId } & Record<string, string>)[]): void {
    for (const doc of docs) {
      this.add(doc);
    }
  }

  // 输入：外部 DocId
  // 输出：无
  // 预期行为：查找映射关系，然后将文档从 InvertedIndex 中删除，最后清理映射表
  remove(id: DocId): void {
    const internalId = this._idMapping.get(id);
    if (internalId !== undefined) {
      this._index.removeDocument(internalId);
      this._idMapping.delete(id);
      this._reverseIdMapping.delete(internalId);
    }
  }

  // 输入：查询 string 文本，可选搜索设置（如 topK）
  // 输出：SearchResult 数组
  // 预期行为：将 query 分词，调用 bm25.search 完成排序，把结果 ID 转换回外部 ID，混入原始字段并返回
  search(query: string, options?: SearchOptions): SearchResult[] {
    const queryTokens = Tokenizer.encode(query);
    const expandedTokens = expandQueryTokens(queryTokens);
    const searchOptions = {
      topK: options?.topK ?? 10,
    };

    const rawResults = search(this._index, expandedTokens, searchOptions, this._bm25Params);

    return rawResults.map((res) => {
      const internalId = res.id as number;
      const originalId = this._reverseIdMapping.get(internalId);
      if (originalId === undefined) {
        throw new Error(
          `Internal inconsistency: original ID not found for internal ID ${internalId}`,
        );
      }

      const docEntry = this._index.getDocEntry(internalId);
      const fields = docEntry ? docEntry.fields : {};

      return {
        ...res,
        id: originalId,
        ...fields,
      };
    });
  }

  // 输入：查询 string 文本，可选搜索设置（如 topK）
  // 输出：Promise<SearchResult[]>
  // 预期行为：在 search 的基础上，首次调用时自动加载桥接扩展表，
  //           对每个 query token 查桥接表扩展同义/跨语言 token，
  //           扩展 token 按 sim 值给 BM25 贡献加权
  async searchWithBridge(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    await BridgeTable.load();

    const queryTokens = Tokenizer.encode(query);
    const metaspaceTokens = expandQueryTokens(queryTokens);
    const expandedTokens = this._expandWithBridge(metaspaceTokens);
    const searchOptions = {
      topK: options?.topK ?? 10,
    };

    const rawResults = searchWeighted(this._index, expandedTokens, searchOptions, this._bm25Params);

    return rawResults.map((res) => {
      const internalId = res.id as number;
      const originalId = this._reverseIdMapping.get(internalId);
      if (originalId === undefined) {
        throw new Error(
          `Internal inconsistency: original ID not found for internal ID ${internalId}`,
        );
      }

      const docEntry = this._index.getDocEntry(internalId);
      const fields = docEntry ? docEntry.fields : {};

      return {
        ...res,
        id: originalId,
        ...fields,
      };
    });
  }

  // 输入：metaspace 展开后的 query token 数组
  // 输出：WeightedToken 数组，原 token weight=1.0，桥扩展 token weight=sim/100
  // 预期行为：对每个 token 查桥接表，将扩展出的 target token 加入查询集并赋予降权系数
  private _expandWithBridge(tokens: TokenId[]): WeightedToken[] {
    const best = new Map<TokenId, number>();
    for (const t of tokens) {
      best.set(t, 1.0);
    }
    for (const t of tokens) {
      for (const bridge of BridgeTable.lookup(t)) {
        const weight = bridge.sim / 100;
        const existing = best.get(bridge.id) ?? 0;
        if (weight > existing) best.set(bridge.id, weight);
      }
    }
    const result: WeightedToken[] = [];
    for (const [token, weight] of best) {
      result.push({ token, weight });
    }
    return result;
  }

  // 输入：无
  // 输出：包含文档总数和词条总数的统计数据
  get stats(): { documentCount: number; termCount: number } {
    return {
      documentCount: this._index.totalDocs,
      termCount: this._index.termCount,
    };
  }
}
