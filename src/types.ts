export type DocId = string | number;

export type TokenId = number;

export interface BM25Params {
  /**
   * 词频饱和度参数 (Term Frequency Saturation)
   * 控制文档词频 (tf) 对得分影响的上限。默认值为 1.2。
   * k1 越大，词频增加对得分的增长越持续；k1 越小，词频得分越快饱和。
   */
  k1?: number;
  /**
   * 文档长度惩罚系数 (Document Length Normalization)
   * 控制文档长度对得分的惩罚力度。默认值为 0.7。
   * b=1 表示对长度进行完全惩罚，b=0 表示忽略文档长度不予惩罚。
   */
  b?: number;
  /**
   * BM25+ 的保底偏移量常数 (Delta Parameter)
   * 保证即使文档无限长，只要它包含检索词，就至少能拿到 idf * d 的保底分数。默认值为 0.5。
   */
  d?: number;
}

export interface BakaSearchOptions {
  fields?: string[];
  bm25?: BM25Params;
}

export interface SearchOptions {
  topK?: number;
}

export interface SearchResult {
  id: DocId;
  score: number;
  [field: string]: unknown;
}

export interface TokenizerData {
  vocab: Record<string, number>;
  merges: [string, string][];
}
