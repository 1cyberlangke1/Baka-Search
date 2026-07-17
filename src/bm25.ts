import type { TokenId, SearchResult, BM25Params } from "./types.js";
import type { InvertedIndex } from "./indexer.js";

// 输入：
//   - termFreq: 词项在当前文档中的词频 (tf)
//   - totalDocs: 索引中的文档总数 (N)
//   - docFreq: 包含该词项的文档总数 (n)
//   - docLength: 当前文档的总 Token 长度 (dl)
//   - avgDocLength: 所有文档的平均 Token 长度 (avdl)
//   - params: BM25 算法参数配置 (包含 k1, b, d 参数)
// 输出：
//   - 返回该词项在当前文档中的 BM25+ 相关性得分 (number)
// 预期行为：
//   - 计算并返回包含保底偏移量 d (delta) 的 BM25+ 词项得分喵！
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

// 输入：
//   - index: InvertedIndex 倒排索引实例
//   - queryTokens: 检索 query 分词后的 TokenId 数组
//   - options: 包含限制返回前 K 个结果 of topK (number) 配置
//   - params: 已填满默认值的 BM25 算法参数配置 (Required<BM25Params>)
// 输出：
//   - 经过打分、降序排序并截取后的 SearchResult[] 数组
// 预期行为：
//   - 循环检索 query 中各 token 对应的 postings，累加 termScore，排序并返回 topK
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
