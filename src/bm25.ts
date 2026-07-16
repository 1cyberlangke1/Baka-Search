import type { TokenId, SearchResult, BM25Params } from "./types.js";
import type { InvertedIndex } from "./indexer.js";

export function termScore(
  _termFreq: number,
  _totalDocs: number,
  _docFreq: number,
  _docLength: number,
  _avgDocLength: number,
  _params: BM25Params,
): number {
  throw new Error("not implemented");
}

export function search(
  _index: InvertedIndex,
  _queryTokens: TokenId[],
  _options: { topK: number },
  _params: Required<BM25Params>,
): SearchResult[] {
  throw new Error("not implemented");
}
