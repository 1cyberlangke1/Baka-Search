import { describe, it, expect } from "vitest";
import { BakaSearch } from "../src/BakaSearch.js";

describe("BakaSearch 真实管线集成测试", () => {
  it("添加文档并用真实 tokenizer + bm25 搜索", () => {
    const searcher = new BakaSearch({ fields: ["title", "content"] });
    searcher.add({ id: 1, title: "hello world", content: "this is a test document for baka search" });
    searcher.add({ id: 2, title: "goodbye world", content: "another test document here" });

    expect(searcher.stats.documentCount).toBe(2);
    expect(searcher.stats.termCount).toBeGreaterThan(0);

    const results = searcher.search("hello");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]!.score).toBeGreaterThan(0);
    expect(results[0]!.id).toBe(1);
  });

  it("多次添加同一 id 应覆盖", () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "x", text: "hello world" });
    expect(searcher.stats.documentCount).toBe(1);
    searcher.add({ id: "x", text: "completely different content" });
    expect(searcher.stats.documentCount).toBe(1);
  });

  it("删除后搜索不到", () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "del", text: "will be removed" });
    searcher.remove("del");
    expect(searcher.stats.documentCount).toBe(0);
    const results = searcher.search("removed");
    expect(results).toEqual([]);
  });

  it("不匹配的搜索应返回空", () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: 1, text: "hello world" });
    const results = searcher.search("zzzxxxxnonexistent");
    expect(results).toEqual([]);
  });

  it("addAll 批量添加", () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.addAll([
      { id: "a", text: "first document" },
      { id: "b", text: "second document" },
    ]);
    expect(searcher.stats.documentCount).toBe(2);
  });

  it("无 id 字段应抛错", () => {
    const searcher = new BakaSearch();
    expect(() => {
      (searcher as any).add({ text: "no id" });
    }).toThrow("must have a valid 'id' field");
  });

  it("返回结果应包含原始字段", () => {
    const searcher = new BakaSearch({ fields: ["title"] });
    searcher.add({ id: "my-id", title: "unique title here" });
    const results = searcher.search("unique");
    expect(results[0]!.id).toBe("my-id");
    expect(results[0]!.title).toBe("unique title here");
  });

  it("query token 展开后高频文档应有更高分数", () => {
    const searcher = new BakaSearch({ fields: ["text"] });
    searcher.add({ id: "low", text: "cat" });
    searcher.add({ id: "high", text: "cat cat cat cat cat" });
    const results = searcher.search("cat");
    expect(results[0]!.id).toBe("high");
    expect(results[0]!.score).toBeGreaterThan(results[1]!.score);
  });
});
