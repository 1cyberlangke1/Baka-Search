import { describe, it, expect } from "vitest";
import { BakaSearch } from "../src/BakaSearch.js";

// 多语言搜索测试
// 数据来自 MIRACL 真实 query-doc pair
// BM25 是关键词匹配，BPE 分词

describe("多语言单字检索", () => {
  const words: Record<string, string> = {
    en: "cat",
    zh: "猫",
    ja: "猫",
  };

  for (const [lang, word] of Object.entries(words)) {
    it(`${lang}: search("${word}") 找到文档`, () => {
      const s = new BakaSearch({ fields: ["text"] });
      s.add({ id: `doc-${lang}`, text: word });
      const results = s.search(word);
      expect(results.some((r) => r.id === `doc-${lang}`)).toBe(true);
    });
  }
});

describe("桥扩展跨语言检索", () => {
  it('search("cat") 只找英文，searchWithBridge 找中英文', async () => {
    const s = new BakaSearch({ fields: ["text"] });
    s.add({ id: "en", text: "cat" });
    s.add({ id: "zh", text: "猫" });

    const plain = s.search("cat");
    expect(plain.some((r) => r.id === "en")).toBe(true);
    expect(plain.some((r) => r.id === "zh")).toBe(false);

    const bridge = await s.searchWithBridge("cat");
    expect(bridge.some((r) => r.id === "en")).toBe(true);
    expect(bridge.some((r) => r.id === "zh")).toBe(true);
  });

  it('searchWithBridge("猫") 反向找到英文', async () => {
    const s = new BakaSearch({ fields: ["text"] });
    s.add({ id: "en", text: "cat" });
    s.add({ id: "zh", text: "猫" });

    const bridge = await s.searchWithBridge("猫");
    expect(bridge.some((r) => r.id === "zh")).toBe(true);
    expect(bridge.some((r) => r.id === "en")).toBe(true);
  });

  it("不相关词不被桥扩展召回", async () => {
    const s = new BakaSearch({ fields: ["text"] });
    s.add({ id: "cat", text: "cat" });
    s.add({ id: "dog", text: "dog" });

    const bridge = await s.searchWithBridge("cat");
    expect(bridge.some((r) => r.id === "dog")).toBe(false);
  });

  it("原词分高于桥扩展词", async () => {
    const s = new BakaSearch({ fields: ["text"] });
    s.add({ id: "en", text: "cat" });
    s.add({ id: "zh", text: "猫" });

    const results = await s.searchWithBridge("cat");
    const enScore = results.find((r) => r.id === "en")!.score;
    const zhScore = results.find((r) => r.id === "zh")!.score;
    expect(enScore).toBeGreaterThan(zhScore);
  });
}, 60000);

describe("桥扩展多语言对验证", () => {
  // 只在实际桥表里存在的跨语言对
  const PAIRS: [string, string, string, string][] = [
    ["en", "cat", "zh", "猫"],
    ["en", "cat", "ko", "캣"],
    ["zh", "猫", "en", "cat"],
  ];

  for (const [fromLang, fromWord, toLang, toWord] of PAIRS) {
    it(`${fromLang}("${fromWord}") → ${toLang}("${toWord}")`, async () => {
      const s = new BakaSearch({ fields: ["text"] });
      s.add({ id: "src", text: fromWord });
      s.add({ id: "tgt", text: toWord });

      const plain = s.search(fromWord);
      expect(plain.some((r) => r.id === "src")).toBe(true);
      expect(plain.some((r) => r.id === "tgt")).toBe(false);

      const bridge = await s.searchWithBridge(fromWord);
      expect(bridge.some((r) => r.id === "src")).toBe(true);
      expect(bridge.some((r) => r.id === "tgt")).toBe(true);
    });
  }
}, 60000);
