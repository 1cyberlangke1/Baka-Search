import type { DocId, TokenId } from "./types.js";

export interface DocEntry {
  id: DocId;
  length: number;
  fields: Record<string, string>;
}

export class InvertedIndex {
  addDocument(_docId: number, _tokens: TokenId[], _fields: Record<string, string>): void {
    throw new Error("not implemented");
  }

  removeDocument(_docId: number): void {
    throw new Error("not implemented");
  }

  getPostings(_termId: TokenId): Map<number, number> | null {
    throw new Error("not implemented");
  }

  getDocFreq(_termId: TokenId): number {
    throw new Error("not implemented");
  }

  getDocEntry(_docId: number): DocEntry | null {
    throw new Error("not implemented");
  }

  get totalDocs(): number {
    throw new Error("not implemented");
  }

  get avgDocLength(): number {
    throw new Error("not implemented");
  }
}
