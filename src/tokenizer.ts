import type { TokenId } from "./types.js";
import { GEMMA_VOCAB, GEMMA_MERGES, GEMMA_UNK_ID } from "./gemma_vocab.js";

// 相邻字符合并的优先级 Map (left,right -> rank)
const _mergeRanks = new Map<string, number>();

// 模块加载时一次性初始化：将 merges 数组预构建为 O(1) 查询的 _mergeRanks 优先级 Map
for (let i = 0; i < GEMMA_MERGES.length; i++) {
  const merge = GEMMA_MERGES[i];
  if (merge) {
    const [left, right] = merge;
    _mergeRanks.set(`${left},${right}`, i);
  }
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

// 输入：预切分好的单个子词片 (例如 " hello" 或 "world")
// 输出：BPE 合并后的子单元字符串数组
// 预期行为：使用双向指针链表与二叉最小堆优先队列实现高吞吐量的 BPE 合并循环
function _mergeWord(word: string): string[] {
  const chars = Array.from(word);
  if (chars.length <= 1) return chars;

  // 1. 初始化双向指针链表数组
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

  // 2. 扫描并把所有初始相邻字符对的合并任务推入最小堆
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

  // ==========================================
  // 主人请在这里实现你最拿手的 BPE 优先队列合并核心循环
  // ==========================================
  //
  // 【合并算法步骤提示】：
  //
  // 1. 开启循环：`while (queue.length > 0)`。
  //    弹出一个合并事件：`const top = queue.pop()!;`。
  //
  // 2. 惰性失效检查：
  //    如果左侧节点已经被合并删除了（`symbols[top.pos].len === 0`），
  //    或者左侧节点已经没有后继节点（`symbols[top.pos].next === -1`），
  //    这说明它已经失效了，直接 `continue` 跳过。
  //
  // 3. 校验 Pair 依然是最新待合并的：
  //    取出右侧节点：`const nextPos = symbols[top.pos].next; const right = symbols[nextPos];`。
  //    将左、右节点的 c 拼接为 PairKey：`${symbols[top.pos].c},${right.c}`，并查 _mergeRanks。
  //    如果查出来的 rank 与 top.rank 不一致，说明这个 MergeJob 是过期的事件，直接 `continue`。
  //
  // 4. 执行合并操作：
  //    将右侧节点的 c 拼接到左侧：`symbols[top.pos].c += right.c;`。
  //    更新左侧节点的长度和 next 指针：
  //    `symbols[top.pos].len += right.len;`
  //    `symbols[top.pos].next = right.next;`
  //
  // 5. 标记右侧节点为已合并状态：
  //    `right.len = 0;`
  //
  // 6. 更新链表后驱的前指指针：
  //    如果合并后，新的后驱节点存在（`right.next > -1`），
  //    则更新该后驱节点的 prev 指针，指向左侧：`symbols[right.next].prev = top.pos;`。
  //
  // 7. 动态将前驱形成的新 Pair 压入堆：
  //    如果左侧节点有前驱节点（`symbols[top.pos].prev >= 0`），
  //    取出前驱节点，与当前合并后的左侧节点拼接 PairKey，去 _mergeRanks 查表。
  //    如果存在 merges 规则，则将该新 Pair 作为 MergeJob 压入堆。
  //    (注意：此时合并事件发生的左边界 pos 应该是前驱节点的索引 `symbols[top.pos].prev`)
  //
  // 8. 动态将后驱形成的新 Pair 压入堆：
  //    如果合并后，新的后继节点存在（`symbols[top.pos].next > -1`），
  //    取出后继节点，与当前合并后的左侧节点拼接 PairKey，去 _mergeRanks 查表。
  //    如果存在 merges 规则，则将该新 Pair 作为 MergeJob 压入堆（pos 依然是当前 `top.pos`）。
  //
  // 9. 循环结束后，过滤出所有未被删除的节点，并将它们的字符串值 c 映射为数组返回。
  //    (你可以用 symbols.filter(s => s.len > 0).map(s => s.c) 或者用 next 指针遍历链表)

  throw new Error("BPE heap merge loop not implemented. Please implement it here!");
}

// 仿照 Math 导出的全局静态字面量 Tokenizer 对象
export const Tokenizer = {
  // 输入：待分词的原始文本字符串 text
  // 输出：编码后的 TokenId 数组
  // 预期行为：Metaspace 转换、正则预分词、遍历调用 _mergeWord 进行 BPE 合并、查表转 TokenId
  encode(text: string): TokenId[] {
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

      const mergedParts = _mergeWord(word);

      // 4. 将融合后的子字串转换为词表 ID，缺失的使用 unkId 填充
      for (const part of mergedParts) {
        const id = GEMMA_VOCAB[part];
        tokens.push(id !== undefined ? id : GEMMA_UNK_ID);
      }
    }

    return tokens;
  },

  // 获取词典的总 Token 数量
  get vocabSize(): number {
    return Object.keys(GEMMA_VOCAB).length;
  },

  // 获取 <unk> 的 TokenId
  get unkId(): TokenId {
    return GEMMA_UNK_ID;
  },
} as const;
