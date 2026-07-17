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
  // ==========================================
  // 主人请在这里实现你的 BM25+ 评分公式喵！₍^ ✧ 𖥦 ✧ ^₎⟆
  // ==========================================
  //
  // 【算法参数详细注解喵】：
  // 1. params.k1 (默认 1.2): 词频饱和度参数 (Term Frequency Saturation)。
  //    - 控制文档词频 (tf) 对得分影响的上限。
  //    - k1 越大，词频增加对得分的增长越持续；k1 越小，词频得分越快达到饱和（即出现1次 and 出现10次得分差不多）。
  // 
  // 2. params.b (默认 0.7): 文档长度惩罚系数 (Document Length Normalization)。
  //    - 惩罚长文档。因为长文档包含的词更多，单纯靠词频高可能只是因为文章长。
  //    - b=1 表示对文档长度进行完全惩罚（词频会除以文档相对长度比例）；
  //    - b=0 表示不惩罚（完全忽略文档长度差异对词频的影响）。
  // 
  // 3. params.d (默认 0.5): BM25+ 的 delta 调节常数。
  //    - 经典 BM25 中，超长文档的分式分值会逼近 0。
  //    - d 用作保底常数，确保只要文档包含该检索词，就至少能拿到 idf * d 的基础分数，不会被长度惩罚项给完全抹杀。
  //
  // 【公式参考喵】：
  // idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5))
  // score = idf * (d + (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avdl))))
  
  // 避开 tsc 的 noUnusedParameters 检查，主人实现公式时直接删掉或保留本行即可喵
  void (termFreq + totalDocs + docFreq + docLength + avgDocLength + (params.k1 ?? 0));
  
  throw new Error("Formula not implemented. Please implement the BM25+ scoring formula here!");
}

// 输入：
//   - index: InvertedIndex 倒排索引实例
//   - queryTokens: 检索 query 分词后的 TokenId 数组
//   - options: 包含限制返回前 K 个结果的 topK (number) 配置
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
  // docId -> 累计得分的映射
  const scores = new Map<number, number>();

  const totalDocs = index.totalDocs;
  const avgDocLength = index.avgDocLength;

  // 1. 遍历检索 query 中的每一个 Token
  for (const token of queryTokens) {
    const postings = index.getPostings(token);
    if (!postings) continue;

    // 含有该 Token 的文档总数 (n)
    const docFreq = index.getDocFreq(token);

    // 2. 遍历该 Token 的 Posting List，累计每篇文档的得分
    for (const [docId, freq] of postings.entries()) {
      const docEntry = index.getDocEntry(docId);
      if (!docEntry) continue;

      // 调用主人的打分函数计算该 Token 对当前文档相关性得分
      const score = termScore(
        freq,          // 当前词频 (tf)
        totalDocs,     // 总文档数 (N)
        docFreq,       // 文档频次 (n)
        docEntry.length, // 当前文档长度 (dl)
        avgDocLength,  // 平均文档长度 (avdl)
        params,        // 算法配置参数
      );

      scores.set(docId, (scores.get(docId) ?? 0) + score);
    }
  }

  // 3. 将 Map 转换为结果数组
  const results: SearchResult[] = Array.from(scores.entries()).map(([docId, score]) => {
    return {
      id: docId,
      score,
    };
  });

  // 4. 按得分降序排列，并截取前 topK 个结果返回
  return results.sort((a, b) => b.score - a.score).slice(0, options.topK);
}
