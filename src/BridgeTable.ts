import type { TokenId } from "./types.js";

const MASK_ID = 0x3FFFF;
const SHIFT_SIM = 18;

let _offsets: Uint32Array | null = null;
let _pairs: Int32Array | null = null;
let _loadPromise: Promise<void> | null = null;

export const BridgeTable = {
  /**
   * 动态 import bridge-data.js，将 JS 数组转成 TypedArray，仅首次调用时执行
   * @returns Promise<void>
   */
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

  /**
   * 遍历指定 token ID 的桥接目标及相似度，零对象分配喵
   * @param tokenId - 查询 token 的 ID
   * @param fn - 遍历回调函数 (id, sim) => void
   */
  lookupForEach(tokenId: number, fn: (id: TokenId, sim: number) => void): void {
    if (!_offsets || !_pairs) return;
    const start = _offsets[tokenId];
    const end = _offsets[tokenId + 1];
    if (start === undefined || end === undefined || start === end) return;
    for (let i = start; i < end; i++) {
      const packed = _pairs[i];
      if (packed !== undefined) {
        fn(packed & MASK_ID, (packed >> SHIFT_SIM) & 0x7F);
      }
    }
  },

  /**
   * @param tokenId - 查询 token 的 ID
   * @returns 目标 token ID 列表及相似度
   */
  lookup(tokenId: number): Array<{ id: TokenId; sim: number }> {
    const result: Array<{ id: TokenId; sim: number }> = [];
    this.lookupForEach(tokenId, (id, sim) => {
      result.push({ id, sim });
    });
    return result;
  },

  /**
   * 桥接表是否已加载
   * @returns boolean
   */
  get isLoaded(): boolean {
    return _offsets !== null;
  },
} as const;
