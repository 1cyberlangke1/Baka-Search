import type { TokenId } from "./types.js";
import { VOCAB, MERGES, UNK_ID } from "./vocab.js";

// 相邻字符合并的优先级 Map (left,right -> rank)
const _mergeRanks = new Map<string, number>();

// 模块加载时一次性初始化：将 merges 数组预构建为 O(1) 查询的 _mergeRanks 优先级 Map
for (let i = 0; i < MERGES.length; i++) {
  const merge = MERGES[i];
  if (merge) {
    const [left, right] = merge;
    _mergeRanks.set(`${left},${right}`, i);
  }
}

// ID -> token 字符串的反向映射，用于 query token 展开
const _idToToken = new Map<TokenId, string>();
for (const [token, id] of Object.entries(VOCAB)) {
  _idToToken.set(id, token);
}

// 对 query token 列表做 metaspace 变体展开：
// 对于 "word" → 同时匹配 "word" 和 "▁word"
// 对于 "▁word" → 同时匹配 "▁word" 和 "word"
// 这解决了 BPE 首个 token 不同的匹配问题
export function expandQueryTokens(ids: TokenId[]): TokenId[] {
  if (ids.length === 0) return ids;

  const result: TokenId[] = [];
  const seen = new Set<TokenId>();

  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }

    const token = _idToToken.get(id);
    if (token === undefined) continue;

    if (token.startsWith("\u2581")) {
      const withoutPrefix = token.slice(1);
      if (withoutPrefix.length > 0) {
        const altId = VOCAB[withoutPrefix];
        if (altId !== undefined && !seen.has(altId)) {
          seen.add(altId);
          result.push(altId);
        }
      }
    } else {
      const withPrefix = "\u2581" + token;
      const altId = VOCAB[withPrefix];
      if (altId !== undefined && !seen.has(altId)) {
        seen.add(altId);
        result.push(altId);
      }
    }
  }

  return result;
}

// 节点结构，用于在扁平数组中构建双向链表
interface SymbolNode {
  c: string; // 片段字符串值，如 "hello"
  prev: number; // 前驱 SymbolNode 索引，-1 表示无
  next: number; // 后继 SymbolNode 索引，-1 表示无
  len: number; // 字符片段长度，0 表示被惰性删除
}

// 合并任务结构，用于存储待合并的字符对信息
interface MergeJob {
  pos: number; // 左侧节点在 symbols 数组中的索引
  rank: number; // merges 中的合并优先级 Rank
}

// 最小堆的性质：任何一个节点都要 ≤ 它的所有子节点。所以树根就是整个堆的最小值。
class MinHeap {
  private data: MergeJob[] = [];

  // 插入一个元素
  public push(item: MergeJob): void {
    this.data.push(item);
    this.up(this.data.length - 1);
  }

  // 弹出元素并返回
  public pop(): MergeJob | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const bottom = this.data.pop();
    if (bottom === undefined) return undefined;
    if (this.data.length > 0) {
      this.data[0] = bottom;
      this.down(0);
    }
    return top;
  }

  // 比较
  private compare(a: MergeJob, b: MergeJob): number {
    if (a.rank !== b.rank) {
      return a.rank - b.rank; // rank 越小越优先
    }
    return a.pos - b.pos; // rank 相等时，位置越靠前越优先
  }

  // 和父亲节点比较, 直到满足最小堆
  private up(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      const current = this.data[i];
      const parent = this.data[p];
      if (current === undefined || parent === undefined) break;
      if (this.compare(current, parent) >= 0) break;
      this.data[i] = parent;
      this.data[p] = current;
      i = p;
    }
  }

  // 和孩子节点比较，直到满足最小堆
  private down(i: number): void {
    const len = this.data.length;
    while ((i << 1) + 1 < len) {
      const left = (i << 1) + 1;
      const right = left + 1;
      let best = i;

      const bestItem = this.data[best];
      const leftItem = this.data[left];
      if (bestItem === undefined || leftItem === undefined) break;

      if (this.compare(leftItem, bestItem) < 0) best = left;

      const currentBestItem = this.data[best];
      const rightItem = this.data[right];
      if (currentBestItem !== undefined && rightItem !== undefined && right < len) {
        if (this.compare(rightItem, currentBestItem) < 0) best = right;
      }

      if (best === i) break;
      const currentVal = this.data[i];
      const bestVal = this.data[best];
      if (currentVal === undefined || bestVal === undefined) break;
      this.data[i] = bestVal;
      this.data[best] = currentVal;
      i = best;
    }
  }

  public get length(): number {
    return this.data.length;
  }
}

// 参考 huggingface tokenizer 的 BPE 实现
// 输入：预切分好的单个子词片 (例如 " hello" 或 "world")
// 输出：BPE 合并后的子单元字符串数组
// 预期行为：使用双向指针链表与二叉最小堆优先队列实现高吞吐量的 BPE 合并循环
function _expandWithByteFallback(text: string): string[] {
  const encoder = new TextEncoder();
  const result: string[] = [];
  for (const char of text) {
    if (VOCAB[char] !== undefined) {
      result.push(char);
    } else {
      const bytes = encoder.encode(char);
      const byteTokens: string[] = [];
      let allExist = true;
      for (const b of bytes) {
        const token = `<0x${b.toString(16).toUpperCase().padStart(2, "0")}>`;
        if (VOCAB[token] === undefined) {
          allExist = false;
          break;
        }
        byteTokens.push(token);
      }
      if (allExist) {
        result.push(...byteTokens);
      } else {
        result.push(char);
      }
    }
  }
  return result;
}

function _mergeWord(word: string): string[] {
  const chars = _expandWithByteFallback(word);
  if (chars.length <= 1) return chars;

  // 1初始化双向指针链表数组
  const symbols: SymbolNode[] = [];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === undefined) continue;
    symbols.push({
      c: char,
      prev: i - 1,
      next: i === chars.length - 1 ? -1 : i + 1,
      len: char.length,
    });
  }

  // 扫描并把所有初始相邻字符对的合并任务推入最小堆
  const queue = new MinHeap();
  for (let i = 0; i < symbols.length - 1; i++) {
    const leftNode = symbols[i];
    const rightNode = symbols[i + 1];
    if (leftNode === undefined || rightNode === undefined) continue;
    const pairKey = `${leftNode.c},${rightNode.c}`;
    const rank = _mergeRanks.get(pairKey);
    if (rank !== undefined) {
      queue.push({ pos: i, rank });
    }
  }

  while (queue.length > 0) {
    const top = queue.pop();
    if (!top) break;

    const node = symbols[top.pos];
    // 左节点不存在、被删了、或没有右邻居，直接跳过
    if (!node || node.len === 0 || node.next === -1) continue;

    const nextNode = symbols[node.next];
    // 如果右邻居不存在，跳过
    if (!nextNode) continue;

    // 校验 Pair 依然是最新待合并的
    if (_mergeRanks.get(`${node.c},${nextNode.c}`) !== top.rank) continue;

    // 执行合并操作
    node.c += nextNode.c;
    node.len += nextNode.len;
    node.next = nextNode.next;
    nextNode.len = 0; // 标记右侧已被合并

    // 更新后驱的前指指针
    if (node.next !== -1) {
      const nextNode = symbols[node.next];
      if (nextNode) nextNode.prev = top.pos;
    }

    // 合并节点
    const pushPair = (leftIdx: number, rightIdx: number) => {
      const l = symbols[leftIdx];
      const r = symbols[rightIdx];
      // 只要两个邻居都存在且没被合并删除
      if (l && r && l.len > 0 && r.len > 0) {
        const rank = _mergeRanks.get(`${l.c},${r.c}`);
        if (rank !== undefined) queue.push({ pos: leftIdx, rank });
      }
    };

    // 向左、向右的邻居合并尝试
    if (node.prev !== -1) pushPair(node.prev, top.pos);
    if (node.next !== -1) pushPair(top.pos, node.next);
  }
  // 返回未删除节点
  return symbols.filter((s) => s.len > 0).map((s) => s.c);
}

// 仿照 Math 导出的全局静态字面量 Tokenizer 对象
export const Tokenizer = {
  // 输入：待分词的原始文本字符串 text
  // 输出：编码后的 TokenId 数组
  // 预期行为：Metaspace 转换、正则预分词、遍历调用 _mergeWord 进行 BPE 合并、查表转 TokenId
  encode(text: string): TokenId[] {
    if (!text) return [];

    // 1. Normalization: 替换普通空格为 Metaspace 字符 ▁ (\u2581)
    const normalized = text.replace(/ /g, "\u2581");

    // 2. 整个字符串作为一个词片执行 BPE 合并（官方 pipeline：normalize 后再 pre-tokenize，
    //    此时已无空格可 split，整个文本作为单个 pre-token 送入 BPE 模型）
    const mergedParts = _mergeWord(normalized);

    const tokens: TokenId[] = [];
    let lastWasUnk = false;

    // 3. 将融合后的子字串转换为词表 ID，缺失的使用 unkId 填充，连续 unk 仅保留首个（fuse_unk）
    for (const part of mergedParts) {
      const id = VOCAB[part];
      if (id === undefined) {
        if (!lastWasUnk) {
          tokens.push(UNK_ID);
        }
        lastWasUnk = true;
      } else {
        tokens.push(id);
        lastWasUnk = false;
      }
    }

    return tokens;
  },

  // 获取词典的总 Token 数量
  get vocabSize(): number {
    return Object.keys(VOCAB).length;
  },

  // 获取 <unk> 的 TokenId
  get unkId(): TokenId {
    return UNK_ID;
  },
} as const;
