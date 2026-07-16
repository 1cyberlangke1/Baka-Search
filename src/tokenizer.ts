import type { TokenId, TokenizerData } from "./types.js";

export class Tokenizer {
  constructor(_data: TokenizerData) {
    throw new Error("not implemented");
  }

  encode(_text: string): TokenId[] {
    throw new Error("not implemented");
  }

  get vocabSize(): number {
    throw new Error("not implemented");
  }

  get unkId(): TokenId {
    throw new Error("not implemented");
  }
}
