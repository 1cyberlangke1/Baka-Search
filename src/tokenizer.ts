import type { TokenId } from "./types.js";
import { GEMMA_VOCAB, GEMMA_MERGES, GEMMA_UNK_ID } from "./gemma_vocab.js";

export class Tokenizer {
  // 字符到 TokenId 的映射词表
  private static _vocab: Record<string, number> = GEMMA_VOCAB;
  // 相邻字符合并的优先级 Map (left,right -> rank)
  private static _mergeRanks = new Map<string, number>();

  // 静态初始化：将 merges 数组预构建为 O(1) 查询的 _mergeRanks 优先级 Map喵
  static {
    for (let i = 0; i < GEMMA_MERGES.length; i++) {
      const merge = GEMMA_MERGES[i];
      if (merge) {
        const [left, right] = merge;
        Tokenizer._mergeRanks.set(`${left},${right}`, i);
      }
    }
  }

  // 私有构造函数，阻止被 new 实例化喵
  private constructor() {}

  // 输入：预切分好的单个子词片 (例如 " hello" 或 "world")
  // 输出：BPE 合并后的子单元字符串数组
  // 预期行为：抛出未实现错误，由主人亲自编写最核心的 BPE 双向合并循环算法喵！
  private static _mergeWord(word: string): string[] {
    // ==========================================
    // 主人请在这里实现你的 BPE 合并循环算法喵！₍^ ✧ 𖥦 ✧ ^₎⟆
    // ==========================================
    //
    // 【算法提示】：
    // 1. 输入 `word` 是一个子词字符串。
    //    你可以先用 `let parts = Array.from(word)` 将它转换成字符数组。
    //    如果 parts 长度 <= 1，不需要进行任何合并，直接返回 parts 即可。
    //
    // 2. 进入 `while (true)` 循环，在当前的 parts 数组中寻找相邻的两个字符对。
    //    在 parts 中，每一个相邻对都可以表达为 (parts[i], parts[i + 1])。
    //
    // 3. 将这一对字符组合拼接为 key：`const pairKey = `${parts[i]},${parts[i + 1]}`;`
    //    并去 `this._mergeRanks` 中查询它的合并优先级 Rank。
    //    (注：Rank 值越小，代表该合并对的优先级越高，合并顺序越靠前。)
    //
    // 4. 遍历 parts 中所有的相邻对，找到其中 Rank 最小（即最优先合并）的那一对的位置 `minIdx` 及其 Rank。
    //    如果没有任何一对在 `_mergeRanks` 中有记录，说明已经无法继续合并了，直接 `break` 退出循环。
    //
    // 5. 将 `parts[minIdx]` 和 `parts[minIdx + 1]` 融合成一个新的合并字符串 `const merged = parts[minIdx] + parts[minIdx + 1]`。
    //    然后用数组剪接（splice）操作从 parts 数组中剔除这两项，并用新融合后的项替换它：
    //    `parts.splice(minIdx, 2, merged);`
    //
    // 6. 重复此 while 循环，直到无法合并，最后返回融合完毕的 parts 数组喵！

    // 避开 tsc 的 noUnusedParameters 检查，主人编写算法时直接保留或删除本行即可喵
    void word;

    throw new Error("BPE word merge algorithm not implemented. Please implement it here!");
  }

  // 输入：待分词的原始文本字符串 text
  // 输出：编码后的 TokenId 数组
  // 预期行为：Metaspace 转换、正则预分词、遍历调用 _mergeWord 进行 BPE 合并、查表转 TokenId 喵
  public static encode(text: string): TokenId[] {
    if (!text) return [];

    // 1. Normalization: 替换普通空格为特殊的 Metaspace 字符 \u2581 (下 1/4 方块 ▁)
    let normalized = text.replace(/ /g, "\u2581");
    // Gemma 分词器规范：如果不是以空格开头，要在最前部补上一个 \u2581
    if (!normalized.startsWith("\u2581")) {
      normalized = "\u2581" + normalized;
    }

    // 2. Pre-tokenization: 利用 Unicode 属性正则切分单词和标点，防止标点和单词黏连合并
    // 匹配可选 \u2581 开头的单词/数字，或者匹配单个标点/符号/空白
    const words =
      normalized.match(/\u2581?[^\s\u2581\p{P}\p{S}\p{Z}\p{C}]+|\p{P}|\p{S}|\s+/gu) || [];

    const tokens: TokenId[] = [];

    // 3. 遍历预切分出的每个词片，执行 BPE 融合并查词表
    for (const word of words) {
      if (!word) continue;

      const mergedParts = Tokenizer._mergeWord(word);

      // 4. 将融合后的子字串转换为词表 ID，缺失的使用 unkId 填充
      for (const part of mergedParts) {
        const id = Tokenizer._vocab[part];
        tokens.push(id !== undefined ? id : Tokenizer.unkId);
      }
    }

    return tokens;
  }

  // 获取词典的总 Token 数量
  public static get vocabSize(): number {
    return Object.keys(Tokenizer._vocab).length;
  }

  // 获取 <unk> 的 TokenId
  public static get unkId(): TokenId {
    return GEMMA_UNK_ID;
  }
}
