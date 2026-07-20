import type { DocId, TokenId } from "./types.js";

/** 文档在倒排索引中的保存实体 */
export interface DocEntry {
  id: DocId;
  length: number;
  fields: Record<string, string>;
}

export class InvertedIndex {
  // term -> docId -> termFreq 的内部倒排映射
  private _terms = new Map<TokenId, Map<number, number>>();
  // docId -> DocEntry 的文档元数据详情映射
  private _docs = new Map<number, DocEntry>();
  // docId -> Set<TokenId> 的反向辅助映射，用于在 O(Tokens) 复杂度内高效删除文档
  private _docToTokens = new Map<number, Set<TokenId>>();
  // 索引内所有文档的累加 Token 总数
  private _totalLength = 0;

  // 极致性能优化：扁平的文档长度数组与 Map 词频统计复用缓冲区喵
  private _docLengths: number[] = [];
  private _termFreqBuf = new Map<TokenId, number>();

  /**
   * @param docId - 内部 docId（自增 number）
   * @param tokens - 该文档提取的 tokens
   * @param fields - 文档的原始 fields 数据
   */
  addDocument(docId: number, tokens: TokenId[], fields: Record<string, string>): void {
    // 如果已经存在该文档，需要先清理旧的词项记录
    if (this._docs.has(docId)) {
      this.removeDocument(docId);
    }

    // 统计当前文档内每个 token 出现的频次，复用 Map 缓存降低 GC 压力喵
    this._termFreqBuf.clear();
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === undefined) continue;
      this._termFreqBuf.set(token, (this._termFreqBuf.get(token) ?? 0) + 1);
    }

    // 更新全局的倒排索引表
    for (const [token, freq] of this._termFreqBuf.entries()) {
      let postings = this._terms.get(token);
      if (!postings) {
        postings = new Map<number, number>();
        this._terms.set(token, postings);
      }
      postings.set(docId, freq);
    }

    // 保存该文档所拥有的 Token 集合用于后续高效删除（复用已去重的键集合喵）
    this._docToTokens.set(docId, new Set(this._termFreqBuf.keys()));

    // 快速记录扁平文档长度喵
    this._docLengths[docId] = tokens.length;

    // 保存文档元数据
    this._docs.set(docId, {
      id: docId,
      length: tokens.length,
      fields,
    });
    this._totalLength += tokens.length;
  }

  /**
   * @param docId - 内部 docId（自增 number）
   */
  removeDocument(docId: number): void {
    const entry = this._docs.get(docId);
    if (!entry) return;

    // 根据记录 of Token 集合精确清理，避免遍历所有词项
    const tokenSet = this._docToTokens.get(docId);
    if (tokenSet) {
      for (const token of tokenSet) {
        const postings = this._terms.get(token);
        if (postings) {
          postings.delete(docId);
          // 如果该 Token 没有其他文档引用，则从映射中彻底移除
          if (postings.size === 0) {
            this._terms.delete(token);
          }
        }
      }
      this._docToTokens.delete(docId);
    }

    this._docLengths[docId] = 0; // 重置该文档长度喵
    this._totalLength -= entry.length;
    this._docs.delete(docId);
  }

  /**
   * @param termId - TokenId
   * @returns Map<docId, termFreq> 或 null
   */
  getPostings(termId: TokenId): Map<number, number> | null {
    return this._terms.get(termId) ?? null;
  }

  /**
   * @param termId - TokenId
   * @returns 引用了该词项的文档总数
   */
  getDocFreq(termId: TokenId): number {
    return this._terms.get(termId)?.size ?? 0;
  }

  /**
   * @param docId - 内部 docId
   * @returns 对应的 DocEntry 或 null
   */
  getDocEntry(docId: number): DocEntry | null {
    return this._docs.get(docId) ?? null;
  }

  /**
   * 获取指定内部 ID 的文档长度，O(1) 扁平数组查询喵
   * @param docId - 内部 docId
   * @returns 文档 Token 长度
   */
  getDocLength(docId: number): number {
    return this._docLengths[docId] ?? 0;
  }

  /** @returns 总文档数 */
  get totalDocs(): number {
    return this._docs.size;
  }

  /** @returns 平均文档 Token 长度 */
  get avgDocLength(): number {
    if (this.totalDocs === 0) return 0;
    return this._totalLength / this.totalDocs;
  }

  /** @returns 词典中的词项（Token）总数 */
  get termCount(): number {
    return this._terms.size;
  }
}
