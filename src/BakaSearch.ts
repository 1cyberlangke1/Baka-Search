import type { DocId, BakaSearchOptions, SearchOptions, SearchResult } from "./types.js";

export class BakaSearch {
  constructor(_options?: BakaSearchOptions) {
    throw new Error("not implemented");
  }

  add(_doc: { id: DocId } & Record<string, string>): void {
    throw new Error("not implemented");
  }

  addAll(_docs: ({ id: DocId } & Record<string, string>)[]): void {
    throw new Error("not implemented");
  }

  remove(_id: DocId): void {
    throw new Error("not implemented");
  }

  search(_query: string, _options?: SearchOptions): SearchResult[] {
    throw new Error("not implemented");
  }

  get stats(): { documentCount: number; termCount: number } {
    throw new Error("not implemented");
  }
}
