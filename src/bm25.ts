import type { TokenId, SearchResult, BM25Params } from "./types.js";
import type { InvertedIndex } from "./indexer.js";

// 输入：词频，总文档数，文档频次，文档长度，平均文档长度，参数 Params
// 输出：BM25 评分
// 预期行为：目前为 Dummy 临时实现，仅做基本的 termFreq 换算
export function termScore(
  termFreq: number,
  _totalDocs: number,
  _docFreq: number,
  _docLength: number,
  _avgDocLength: number,
  _params: BM25Params,
): number {
  return termFreq;
}

// 输入：InvertedIndex 索引，查询分词 TokenId 数组，搜索配置 topK，BM25 调节参数
// 输出：匹配的文档打分排序结果数组
// 预期行为：Dummy 实现。搜寻所有 query 词项的 postings，累计词频频次作为得分，按降序排列并截取 topK
export function search(
  index: InvertedIndex,
  queryTokens: TokenId[],
  options: { topK: number },
  _params: Required<BM25Params>,
): SearchResult[] {
  const scores = new Map<number, number>();

  for (const token of queryTokens) {
    const postings = index.getPostings(token);
    if (postings) {
      for (const [docId, freq] of postings.entries()) {
        scores.set(docId, (scores.get(docId) ?? 0) + freq);
      }
    }
  }

  const results: SearchResult[] = Array.from(scores.entries()).map(([docId, score]) => {
    return {
      id: docId,
      score,
    };
  });

  // 按得分降序排列
  results.sort((a, b) => b.score - a.score);

  // 截取前 topK 篇文档
  return results.slice(0, options.topK);
}
