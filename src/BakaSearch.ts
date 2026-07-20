import type { DocId, TokenId, BakaSearchOptions, SearchOptions, SearchResult } from "./types.js";
import { InvertedIndex } from "./indexer.js";
import { Tokenizer, expandQueryTokens, idToToken } from "./tokenizer.js";
import { search, searchWeighted } from "./bm25.js";
import type { WeightedToken } from "./bm25.js";
import { BridgeTable } from "./BridgeTable.js";
import { VOCAB } from "./vocab.js";

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

  /**
   * @param options - 可选配置，指定索引字段和 BM25 参数
   */
  constructor(options?: BakaSearchOptions) {
    this._fields = options?.fields;
    this._bm25Params = {
      k1: options?.bm25?.k1 ?? 1.2,
      b: options?.bm25?.b ?? 0.7,
      d: options?.bm25?.d ?? 0.5,
    };
  }

  /**
   * @param doc - 具有唯一 id 的文档，可包含多个字段
   */
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

    const tokens: number[] = [];
    const fieldsData: Record<string, string> = {};

    // 决定要索引的字段：优先采用配置的 _fields，否则自动筛选除 id 外所有值为 string 的字段（优化掉 filter 避免临时数组分配喵）
    if (this._fields) {
      for (let i = 0; i < this._fields.length; i++) {
        const field = this._fields[i];
        if (field === undefined) continue;
        const value = doc[field];
        if (typeof value === "string") {
          fieldsData[field] = value;
          const fieldTokens = Tokenizer.encode(" " + value);
          for (let j = 0; j < fieldTokens.length; j++) {
            const t = fieldTokens[j];
            if (t !== undefined) tokens.push(t);
          }
        }
      }
    } else {
      const keys = Object.keys(doc);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === undefined || key === "id") continue;
        const value = doc[key];
        if (typeof value === "string") {
          fieldsData[key] = value;
          const fieldTokens = Tokenizer.encode(" " + value);
          for (let j = 0; j < fieldTokens.length; j++) {
            const t = fieldTokens[j];
            if (t !== undefined) tokens.push(t);
          }
        }
      }
    }

    this._index.addDocument(internalId, tokens, fieldsData);
  }

  /**
   * @param docs - 文档对象数组
   */
  addAll(docs: ({ id: DocId } & Record<string, string>)[]): void {
    for (const doc of docs) {
      this.add(doc);
    }
  }

  /**
   * @param id - 外部 DocId
   */
  remove(id: DocId): void {
    const internalId = this._idMapping.get(id);
    if (internalId !== undefined) {
      this._index.removeDocument(internalId);
      this._idMapping.delete(id);
      this._reverseIdMapping.delete(internalId);
    }
  }

  /**
   * @param query - 查询文本
   * @param options - 可选搜索设置（如 topK）
   * @returns 排序后的 SearchResult 数组
   */
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
      const result: SearchResult = {
        id: originalId,
        score: res.score,
      };
      if (docEntry) {
        Object.assign(result, docEntry.fields);
      }
      return result;
    });
  }

  /**
   * @param query - 查询文本
   * @param options - 可选搜索设置（如 topK）
   * @returns 排序后的 SearchResult 数组
   */
  async searchWithBridge(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    // 首次调用加载，后续已加载时同步返回，消除 await 微任务开销喵
    if (!BridgeTable.isLoaded) {
      await BridgeTable.load();
    }

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
      const result: SearchResult = {
        id: originalId,
        score: res.score,
      };
      if (docEntry) {
        Object.assign(result, docEntry.fields);
      }
      return result;
    });
  }

  /**
   * @param tokens - metaspace 展开后的 query token 数组
   * @returns WeightedToken 数组，原 token weight=1.0，桥扩展 token weight=sim/100
   */
  private _expandWithBridge(tokens: TokenId[]): WeightedToken[] {
    const best = new Map<TokenId, number>();
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t !== undefined) best.set(t, 1.0);
    }

    // 对每个输入 token 及其 metaspace 变体分别查桥接表喵
    const origSet = new Set(tokens);
    const querySet = new Set(origSet);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t === undefined) continue;
      const token = idToToken.get(t);
      if (token === undefined) continue;
      let altId: number | undefined;
      if (token.startsWith("\u2581")) {
        const withoutPrefix = token.slice(1);
        if (withoutPrefix.length > 0) altId = VOCAB[withoutPrefix];
      } else {
        const withPrefix = "\u2581" + token;
        altId = VOCAB[withPrefix];
      }
      if (altId !== undefined && !querySet.has(altId)) {
        querySet.add(altId);
      }
    }

    for (const qid of querySet) {
      BridgeTable.lookupForEach(qid, (id, sim) => {
        const weight = sim / 100;
        const existing = best.get(id) ?? 0;
        if (weight > existing) best.set(id, weight);
      });
    }

    // 对桥扩展 token 也做 metaspace 展开（解决 ▁X ↔ X 不匹配）
    const metaspaceExtras: TokenId[] = [];
    for (const id of best.keys()) {
      if (!origSet.has(id)) metaspaceExtras.push(id);
    }
    for (let i = 0; i < metaspaceExtras.length; i++) {
      const id = metaspaceExtras[i];
      if (id === undefined) continue;
      const token = idToToken.get(id);
      if (token === undefined) continue;
      const currentWeight = best.get(id);
      if (currentWeight === undefined) continue;
      if (token.startsWith("\u2581")) {
        const withoutPrefix = token.slice(1);
        if (withoutPrefix.length > 0) {
          const altId = VOCAB[withoutPrefix];
          if (altId !== undefined && !best.has(altId)) {
            best.set(altId, currentWeight);
          }
        }
      } else {
        const withPrefix = "\u2581" + token;
        const altId = VOCAB[withPrefix];
        if (altId !== undefined && !best.has(altId)) {
          best.set(altId, currentWeight);
        }
      }
    }

    const result: WeightedToken[] = [];
    for (const [token, weight] of best) {
      result.push({ token, weight });
    }
    return result;
  }

  /**
   * @returns 包含文档总数和词条总数的统计数据
   */
  get stats(): { documentCount: number; termCount: number } {
    return {
      documentCount: this._index.totalDocs,
      termCount: this._index.termCount,
    };
  }
}
