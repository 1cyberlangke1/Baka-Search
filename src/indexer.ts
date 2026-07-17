import type { DocId, TokenId } from "./types.js";

// 文档在倒排索引中的保存实体
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

  // 输入：内部 docId（自增 number），该文档提取的 tokens，文档的原始 fields 数据
  // 输出：无
  // 预期行为：计算词频，更新 _terms 倒排表，记录元数据，累加文档长度
  addDocument(docId: number, tokens: TokenId[], fields: Record<string, string>): void {
    // 如果已经存在该文档，需要先清理旧的词项记录
    if (this._docs.has(docId)) {
      this.removeDocument(docId);
    }

    // 统计当前文档内每个 token 出现的频次
    const termFreqs = new Map<TokenId, number>();
    for (const token of tokens) {
      termFreqs.set(token, (termFreqs.get(token) ?? 0) + 1);
    }

    // 更新全局的倒排索引表
    for (const [token, freq] of termFreqs.entries()) {
      let postings = this._terms.get(token);
      if (!postings) {
        postings = new Map<number, number>();
        this._terms.set(token, postings);
      }
      postings.set(docId, freq);
    }

    // 保存该文档所拥有的 Token 集合用于后续高效删除
    this._docToTokens.set(docId, new Set(tokens));

    // 保存文档元数据
    this._docs.set(docId, {
      id: docId,
      length: tokens.length,
      fields,
    });
    this._totalLength += tokens.length;
  }

  // 输入：内部 docId（自增 number）
  // 输出：无
  // 预期行为：从倒排表 _terms 中清理对应的 docId 频次记录，清除文档元数据，减少总长度
  removeDocument(docId: number): void {
    const entry = this._docs.get(docId);
    if (!entry) return;

    // 根据记录的 Token 集合精确清理，避免遍历所有词项
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

    this._totalLength -= entry.length;
    this._docs.delete(docId);
  }

  // 输入：TokenId
  // 输出：Map<docId, termFreq> 或 null
  // 预期行为：返回包含该 termId 的所有文档及其频次的 Posting List
  getPostings(termId: TokenId): Map<number, number> | null {
    return this._terms.get(termId) ?? null;
  }

  // 输入：TokenId
  // 输出：引用了该词项的文档总数
  // 预期行为：查询 postings 映射的 size，不存在返回 0
  getDocFreq(termId: TokenId): number {
    return this._terms.get(termId)?.size ?? 0;
  }

  // 输入：内部 docId
  // 输出：对应的 DocEntry 或 null
  // 预期行为：获取保存的文档详情
  getDocEntry(docId: number): DocEntry | null {
    return this._docs.get(docId) ?? null;
  }

  // 输入：无
  // 输出：总文档数
  get totalDocs(): number {
    return this._docs.size;
  }

  // 输入：无
  // 输出：平均文档 Token 长度
  get avgDocLength(): number {
    if (this.totalDocs === 0) return 0;
    return this._totalLength / this.totalDocs;
  }

  // 输入：无
  // 输出：词典中的词项（Token）总数
  get termCount(): number {
    return this._terms.size;
  }
}
