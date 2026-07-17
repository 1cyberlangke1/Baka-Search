import type { TokenId, TokenizerData } from "./types.js";

export class Tokenizer {
  private _vocab: Record<string, number>;

  // 输入：TokenizerData (由 vocab 和 merges 组成)
  // 输出：Tokenizer 实例
  // 预期行为：保存词表，用于编码
  constructor(data: TokenizerData) {
    this._vocab = data.vocab;
  }

  // 输入：要编码的字符串
  // 输出：TokenId 数组
  // 预期行为：Dummy 实现。优先在词表中查找单词，如果查不到则按单字符查表，实在查不到则使用 unkId
  encode(text: string): TokenId[] {
    if (!text) return [];
    const tokens: TokenId[] = [];
    const words = text.split(/\s+/);

    for (const word of words) {
      if (!word) continue;

      const directId = this._vocab[word];
      if (directId !== undefined) {
        tokens.push(directId);
      } else {
        for (const char of word) {
          const charId = this._vocab[char];
          tokens.push(charId !== undefined ? charId : this.unkId);
        }
      }
    }

    return tokens;
  }

  // 获取词表大小
  get vocabSize(): number {
    return Object.keys(this._vocab).length;
  }

  // 获取 <unk> 的 TokenId
  get unkId(): TokenId {
    return this._vocab["<unk>"] ?? 3;
  }
}
