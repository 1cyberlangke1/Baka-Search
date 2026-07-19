import type { TokenId } from "./types.js";

const MASK_ID = 0x3FFFF;
const SHIFT_SIM = 18;

let _offsets: Uint32Array | null = null;
let _pairs: Int32Array | null = null;
let _loadPromise: Promise<void> | null = null;

export const BridgeTable = {
  // 输入：无
  // 输出：Promise<void>
  // 预期行为：动态 import bridge-data.js，将 JS 数组转成 TypedArray，仅首次调用时执行
  async load(): Promise<void> {
    if (_offsets) return;
    if (_loadPromise) return _loadPromise;
    _loadPromise = (async () => {
      const { BRIDGE_OFFSETS, BRIDGE_PAIRS } = await import("./bridge-data.js");
      _offsets = new Uint32Array(BRIDGE_OFFSETS);
      _pairs = new Int32Array(BRIDGE_PAIRS);
    })();
    return _loadPromise;
  },

  // 输入：tokenId 查询 token 的 ID
  // 输出：Array<{ id: TokenId; sim: number }> 目标 token ID 列表及相似度
  // 预期行为：CSR 偏移量直接索引范围，遍历 pairs 拆包 dstId/sim，O(1) 时间复杂度
  lookup(tokenId: number): Array<{ id: TokenId; sim: number }> {
    if (!_offsets || !_pairs) return [];
    const start = _offsets[tokenId];
    const end = _offsets[tokenId + 1];
    if (start === undefined || end === undefined) return [];
    if (start === end) return [];
    const result: Array<{ id: TokenId; sim: number }> = [];
    for (let i = start; i < end; i++) {
      const packed = _pairs[i];
      if (packed === undefined) continue;
      result.push({
        id: packed & MASK_ID,
        sim: (packed >> SHIFT_SIM) & 0x7F,
      });
    }
    return result;
  },

  // 输入：无
  // 输出：boolean 桥接表是否已加载
  get isLoaded(): boolean {
    return _offsets !== null;
  },
} as const;
