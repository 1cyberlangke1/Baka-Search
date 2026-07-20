import type { TokenId, SearchResult, BM25Params } from "./types.js";
import type { InvertedIndex } from "./indexer.js";

/**
 * @param termFreq - 词项在当前文档中的词频 (tf)
 * @param totalDocs - 索引中的文档总数 (N)
 * @param docFreq - 包含该词项的文档总数 (n)
 * @param docLength - 当前文档的总 Token 长度 (dl)
 * @param avgDocLength - 所有文档的平均 Token 长度 (avdl)
 * @param params - BM25 算法参数配置 (k1, b, d)
 * @returns 该词项在当前文档中的 BM25+ 相关性得分
 */
export function termScore(
  termFreq: number,
  totalDocs: number,
  docFreq: number,
  docLength: number,
  avgDocLength: number,
  params: BM25Params,
): number {
  // 调节参数
  const k1 = params.k1 ?? 1.2;
  const b = params.b ?? 0.7;
  const d = params.d ?? 0.5;

  const idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5)); // 衡量一个词有多么稀有, 出现的少就越重要
  const score =
    (idf * (termFreq * (k1 + 1))) / (termFreq + k1 * (1 - b + (b * docLength) / avgDocLength)); // BM25 算法

  // doc 太长的时候分母 -> inf, score 会太少, 如果当前词很重要可以补一点分
  return score + d * idf;
}

/**
 * @param termFreq - 词项在当前文档中的词频 (tf)
 * @param totalDocs - 索引中的文档总数 (N)
 * @param docFreq - 包含该词项的文档总数 (n)
 * @param docLength - 当前文档的总 Token 长度 (dl)
 * @param avgDocLength - 所有文档的平均 Token 长度 (avdl)
 * @param params - BM25 算法参数配置 (k1, b, d)
 * @param weight - 查询词权重 (0-1)
 * @returns 加权后的 BM25+ 相关性得分
 */
export function termScoreWeighted(
  termFreq: number,
  totalDocs: number,
  docFreq: number,
  docLength: number,
  avgDocLength: number,
  params: BM25Params,
  weight: number,
): number {
  return termScore(termFreq, totalDocs, docFreq, docLength, avgDocLength, params) * weight;
}

/** 带权重的查询词项，weight 范围 0–1。原 token weight=1.0，桥扩展 token weight=sim/100 */
export interface WeightedToken {
  token: TokenId;
  weight: number;
}

/**
 * @param index - InvertedIndex 倒排索引实例
 * @param queryTokens - 带权重的查询词项数组
 * @param options - 配置，包含 topK
 * @param params - BM25 算法参数
 * @returns 排序后的 SearchResult[] 数组
 */
export function searchWeighted(
  index: InvertedIndex,
  queryTokens: WeightedToken[],
  options: { topK: number },
  params: Required<BM25Params>,
): SearchResult[] {
  const scores = new Map<number, number>();

  const totalDocs = index.totalDocs;
  const avgDocLength = index.avgDocLength;

  for (const { token, weight } of queryTokens) {
    const postings = index.getPostings(token);
    if (!postings) continue;

    const docFreq = index.getDocFreq(token);

    for (const [docId, freq] of postings.entries()) {
      const docEntry = index.getDocEntry(docId);
      if (!docEntry) continue;

      const score = termScoreWeighted(freq, totalDocs, docFreq, docEntry.length, avgDocLength, params, weight);

      scores.set(docId, (scores.get(docId) ?? 0) + score);
    }
  }

  const results: SearchResult[] = Array.from(scores.entries()).map(([docId, score]) => {
    return {
      id: docId,
      score,
    };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, options.topK);
}

/**
 * @param index - InvertedIndex 倒排索引实例
 * @param queryTokens - 查询词项数组
 * @param options - 配置，包含 topK
 * @param params - BM25 算法参数
 * @returns 排序后的 SearchResult[] 数组
 */
export function search(
  index: InvertedIndex,
  queryTokens: TokenId[],
  options: { topK: number },
  params: Required<BM25Params>,
): SearchResult[] {
  const scores = new Map<number, number>();

  const totalDocs = index.totalDocs;
  const avgDocLength = index.avgDocLength;

  for (const token of queryTokens) {
    const postings = index.getPostings(token);
    if (!postings) continue;

    const docFreq = index.getDocFreq(token);

    for (const [docId, freq] of postings.entries()) {
      const docEntry = index.getDocEntry(docId);
      if (!docEntry) continue;

      const score = termScore(freq, totalDocs, docFreq, docEntry.length, avgDocLength, params);

      scores.set(docId, (scores.get(docId) ?? 0) + score);
    }
  }

  const results: SearchResult[] = Array.from(scores.entries()).map(([docId, score]) => {
    return {
      id: docId,
      score,
    };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, options.topK);
}
