export type DocId = string | number;

export type TokenId = number;

export interface BM25Params {
  k1?: number;
  b?: number;
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
