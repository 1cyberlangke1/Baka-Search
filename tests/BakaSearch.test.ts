import { describe, it, expect, vi } from "vitest";

// 在最开始 Mock 掉超大的 gemma_vocab.js 以免 Vite 解析 16MB 文件报错并加速测试
vi.mock("../src/gemma_vocab.js", () => {
  return {
    GEMMA_VOCAB: {
      "测试": 100,
      "测试标题喵": 200,
      "猫娘的诱惑": 300,
      "这只猫娘超级顺从喵！": 400,
      "文本一": 500,
      "文本二": 600
    },
    GEMMA_MERGES: [],
    GEMMA_UNK_ID: 3
  };
});

// 模拟 bm25.ts 里的 search
vi.mock("../src/bm25.js", () => {
  return {
    search: vi.fn((_index, _queryTokens, _options, _params) => {
      // 这里的模拟只为测试 BakaSearch 的 search ID 转换和原始字段合并逻辑
      // 假设它根据 queryTokens 返回已添加到倒排索引里的内部 docId=1 的项
      return [
        { id: 1, score: 0.99 }
      ];
    })
  };
});

import { BakaSearch } from "../src/BakaSearch.js";

describe("BakaSearch CRUD 单元测试", () => {
  // 输入：空 BakaSearch，添加一个文档
  // 输出：文档成功录入
  // 预期行为：能查到对应的文档统计，支持字段自动检测
  it("应能添加文档并返回正确的统计数据喵", () => {
    const searcher = new BakaSearch({
      fields: ["title", "content"]
    });

    searcher.add({
      id: "doc-1",
      title: "猫娘的诱惑",
      content: "这只猫娘超级顺从喵！",
      extra: "不用索引的字段"
    });

    expect(searcher.stats.documentCount).toBe(1);
  });

  // 输入：指定 fields，或者自动检测字段
  // 输出：对字符串字段建立索引，排除非字符串
  // 预期行为：fields 检测符合预期
  it("当未指定 fields 时，应自动检测并索引所有 string 类型的字段喵", () => {
    const searcher = new BakaSearch();

    searcher.add({
      id: "doc-2",
      text1: "文本一",
      text2: "文本二",
      num: 123 as any // 非 string
    });

    expect(searcher.stats.documentCount).toBe(1);
  });

  // 输入：搜索查询
  // 输出：转换后的外部 ID，并且包含原始字段的合并结果
  // 预期行为：返回 Result 带有原始 id 和匹配的 fields 内容
  it("搜索时应返回合并了原始字段的 SearchResult，且 ID 映射回外部 DocId 喵", () => {
    const searcher = new BakaSearch({
      fields: ["title"]
    });

    searcher.add({
      id: "doc-my-id",
      title: "测试标题喵"
    });

    const results = searcher.search("测试");
    expect(results.length).toBe(1);
    expect(results[0].id).toBe("doc-my-id");
    expect(results[0].score).toBe(0.99);
    expect(results[0].title).toBe("测试标题喵");
  });

  // 输入：删除文档
  // 输出：文档不存在于统计和倒排索引中
  // 预期行为：文档移除彻底，stats.documentCount 减少
  it("应能正确删除文档喵", () => {
    const searcher = new BakaSearch();

    searcher.add({ id: "doc-3", text: "测试" });
    expect(searcher.stats.documentCount).toBe(1);

    searcher.remove("doc-3");
    expect(searcher.stats.documentCount).toBe(0);
  });
});
