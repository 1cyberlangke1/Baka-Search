import { describe, it, expect } from "vitest";
import { BakaSearch } from "../src/BakaSearch.js";

describe("桥接扩展跨语言检索", () => {
  it("cat 通过桥扩展找到「猫」", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cn-cat", text: "猫" });

    const plain = searcher.search("cat");
    expect(plain.some((r) => r.id === "doc-cat")).toBe(true);
    expect(plain.some((r) => r.id === "doc-cn-cat")).toBe(false);

    const bridge = await searcher.searchWithBridge("cat");
    expect(bridge.some((r) => r.id === "doc-cat")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cn-cat")).toBe(true);
  });

  it("cats 也通过桥扩展找到「猫」", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cats", text: "cats" });
    searcher.add({ id: "doc-cn-cat", text: "猫" });

    const plain = searcher.search("cats");
    expect(plain.some((r) => r.id === "doc-cats")).toBe(true);
    expect(plain.some((r) => r.id === "doc-cn-cat")).toBe(false);

    const bridge = await searcher.searchWithBridge("cats");
    expect(bridge.some((r) => r.id === "doc-cats")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cn-cat")).toBe(true);
  });

  it("搜「猫」也能双向找到 cat 和 cats", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cats", text: "cats" });
    searcher.add({ id: "doc-cn-cat", text: "猫" });

    const plain = searcher.search("猫");
    expect(plain.some((r) => r.id === "doc-cn-cat")).toBe(true);
    expect(plain.some((r) => r.id === "doc-cat")).toBe(false);
    expect(plain.some((r) => r.id === "doc-cats")).toBe(false);

    const bridge = await searcher.searchWithBridge("猫");
    expect(bridge.some((r) => r.id === "doc-cn-cat")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cat")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cats")).toBe(true);
  });

  it("cat 通过桥扩展找到 cats", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cats", text: "cats" });

    const plain = searcher.search("cat");
    expect(plain.some((r) => r.id === "doc-cat")).toBe(true);
    expect(plain.some((r) => r.id === "doc-cats")).toBe(false);

    const bridge = await searcher.searchWithBridge("cat");
    expect(bridge.some((r) => r.id === "doc-cat")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cats")).toBe(true);
  });

  it("cats 通过桥扩展找到 cat", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cats", text: "cats" });

    const plain = searcher.search("cats");
    expect(plain.some((r) => r.id === "doc-cats")).toBe(true);
    expect(plain.some((r) => r.id === "doc-cat")).toBe(false);

    const bridge = await searcher.searchWithBridge("cats");
    expect(bridge.some((r) => r.id === "doc-cats")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-cat")).toBe(true);
  });

  it("不相关的词不应被桥扩展查到", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-dog", text: "狗" });

    const bridge = await searcher.searchWithBridge("cat");
    expect(bridge.some((r) => r.id === "doc-cat")).toBe(true);
    expect(bridge.some((r) => r.id === "doc-dog")).toBe(false);
  });

  it("原词分数应高于桥扩展词", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cn-cat", text: "猫" });

    const bridge = await searcher.searchWithBridge("cat");
    const catScore = bridge.find((r) => r.id === "doc-cat")!.score;
    const cnScore = bridge.find((r) => r.id === "doc-cn-cat")!.score;
    expect(catScore).toBeGreaterThan(cnScore);
  });

  it("多次调用原 search 结果一致", async () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "doc-cat", text: "cat" });
    searcher.add({ id: "doc-cn-cat", text: "猫" });

    const r1 = searcher.search("cat");
    const r2 = searcher.search("cat");
    expect(r1).toEqual(r2);
  });
}, 60000);
