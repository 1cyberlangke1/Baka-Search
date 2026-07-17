import type { DocId, BakaSearchOptions, SearchOptions, SearchResult } from "./types.js";
import { InvertedIndex } from "./indexer.js";
import { Tokenizer } from "./tokenizer.js";
import { search } from "./bm25.js";
import { GEMMA_VOCAB, GEMMA_MERGES } from "./gemma_vocab.js";

export class BakaSearch {
  // 内部维护的倒排索引实例
  private _index = new InvertedIndex();
  // 内部 BPE 分词器实例
  private _tokenizer: Tokenizer;
  // 要被分词索引的字段白名单，若未指定则自动检测
  private _fields: string[] | undefined;
  // BM25 打分的相关参数 (k1, b)
  private _bm25Params: { k1: number; b: number };

  // 自增内部 ID 生成器
  private _nextInternalId = 1;
  // 外部 ID 到内部 ID 的映射 Map
  private _idMapping = new Map<DocId, number>();
  // 内部 ID 到外部 ID 的反向映射 Map，用于搜索结果转换
  private _reverseIdMapping = new Map<number, DocId>();

  // 输入：可选配置 options，可以指定索引字段 fields 和 BM25 参数
  // 输出：BakaSearch 实例
  // 预期行为：实例化 Tokenizer，保存相关参数
  constructor(options?: BakaSearchOptions) {
    this._tokenizer = new Tokenizer({
      vocab: GEMMA_VOCAB,
      merges: GEMMA_MERGES,
    });
    this._fields = options?.fields;
    this._bm25Params = {
      k1: options?.bm25?.k1 ?? 1.5,
      b: options?.bm25?.b ?? 0.75,
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
        const fieldTokens = this._tokenizer.encode(value);
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
    const queryTokens = this._tokenizer.encode(query);
    const searchOptions = {
      topK: options?.topK ?? 10,
    };

    // 调用 bm25 纯函数执行打分搜索
    const rawResults = search(this._index, queryTokens, searchOptions, this._bm25Params);

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

  // 输入：无
  // 输出：包含文档总数和词条总数的统计数据
  get stats(): { documentCount: number; termCount: number } {
    return {
      documentCount: this._index.totalDocs,
      termCount: this._index.termCount,
    };
  }
}
