import { describe, it, expect } from "vitest";
import { termScore, search } from "../src/bm25.js";
import { InvertedIndex } from "../src/indexer.js";
import type { BM25Params } from "../src/types.js";

describe("termScore 公式正确性", () => {
  it("应使用默认参数 k1=1.2, b=0.7, d=0.5 计算 BM25+ 分数", () => {
    const N = 10, n = 2, tf = 3, dl = 100, avdl = 80;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    const expected =
      (idf * (tf * (1.2 + 1))) / (tf + 1.2 * (1 - 0.7 + (0.7 * dl) / avdl))
      + 0.5 * idf;
    const result = termScore(tf, N, n, dl, avdl, {});
    expect(result).toBeCloseTo(expected, 10);
  });

  it("应使用自定义 k1, b, d 参数", () => {
    const params: BM25Params = { k1: 2.0, b: 0.5, d: 0.1 };
    const N = 100, n = 10, tf = 5, dl = 50, avdl = 60;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    const expected =
      (idf * (tf * (2.0 + 1))) / (tf + 2.0 * (1 - 0.5 + (0.5 * dl) / avdl))
      + 0.1 * idf;
    const result = termScore(tf, N, n, dl, avdl, params);
    expect(result).toBeCloseTo(expected, 10);
  });

  it("termFreq=0 时分数应只包含 d * idf 保底", () => {
    const idf = Math.log(1 + (10 - 2 + 0.5) / (2 + 0.5));
    const result = termScore(0, 10, 2, 100, 80, { d: 0.5 });
    expect(result).toBeCloseTo(0.5 * idf, 10);
  });

  it("docFreq=totalDocs（全文献词）时 idf 应较小", () => {
    const result1 = termScore(3, 100, 1, 50, 60, {});  // 稀有词
    const result2 = termScore(3, 100, 99, 50, 60, {}); // 常见词
    expect(result1).toBeGreaterThan(result2);
  });

  it("d=0 时退化为标准 BM25（无保底偏移）", () => {
    const params: BM25Params = { d: 0 };
    const result = termScore(3, 10, 2, 100, 80, params);
    const idf = Math.log(1 + (10 - 2 + 0.5) / (2 + 0.5));
    const expected =
      (idf * (3 * (1.2 + 1))) / (3 + 1.2 * (1 - 0.7 + (0.7 * 100) / 80));
    expect(result).toBeCloseTo(expected, 10);
  });
});

describe("search 搜索排序", () => {
  it("应正确累加多 term 分数并返回按 score 降序的结果", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10, 20], { title: "doc1" });
    index.addDocument(2, [20, 30], { title: "doc2" });
    index.addDocument(3, [10, 10, 20], { title: "doc3" });

    const results = search(index, [10, 20], { topK: 10 }, { k1: 1.2, b: 0.7, d: 0.5 });
    expect(results.length).toBe(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
    }
  });

  it("topK 应截断返回数量", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10], { title: "a" });
    index.addDocument(2, [10], { title: "b" });
    index.addDocument(3, [10], { title: "c" });

    const results = search(index, [10], { topK: 2 }, { k1: 1.2, b: 0.7, d: 0.5 });
    expect(results.length).toBe(2);
  });

  it("无匹配 token 时应返回空数组", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10], { title: "a" });

    const results = search(index, [999], { topK: 10 }, { k1: 1.2, b: 0.7, d: 0.5 });
    expect(results).toEqual([]);
  });

  it("空 queryTokens 应返回空数组", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10], { title: "a" });

    const results = search(index, [], { topK: 10 }, { k1: 1.2, b: 0.7, d: 0.5 });
    expect(results).toEqual([]);
  });

  it("分数应与文档长度负相关（b>0 时）", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10], { title: "short" });
    index.addDocument(2, [10, 99, 99, 99, 99], { title: "long" });

    const results = search(index, [10], { topK: 10 }, { k1: 1.2, b: 0.7, d: 0.5 });
    expect(results[0]!.id).toBe(1);
  });
});
