import { describe, it, expect } from "vitest";
import { InvertedIndex } from "../src/indexer.js";

describe("InvertedIndex CRUD 单元测试", () => {
  // 输入：空索引，添加一篇文档
  // 输出：倒排索引项更新，元数据更新
  // 预期行为：文档元数据正确保存，Posting List中能查到词项及对应词频
  it("应能正确添加文档并建立倒排索引喵", () => {
    const index = new InvertedIndex();
    
    const docId = 1;
    const tokens = [10, 20, 10, 30]; // 10 出现了 2 次，20 出现了 1 次，30 出现了 1 次
    const fields = { title: "Hello World", content: "Hello Baka Search" };

    index.addDocument(docId, tokens, fields);

    // 验证 totalDocs 和 avgDocLength
    expect(index.totalDocs).toBe(1);
    expect(index.avgDocLength).toBe(4);

    // 验证 getDocEntry
    const entry = index.getDocEntry(docId);
    expect(entry).not.toBeNull();
    expect(entry!.id).toBe(docId);
    expect(entry!.length).toBe(4);
    expect(entry!.fields).toEqual(fields);

    // 验证 postings
    const postings10 = index.getPostings(10);
    expect(postings10).not.toBeNull();
    expect(postings10!.get(docId)).toBe(2); // 词频应为 2

    const postings20 = index.getPostings(20);
    expect(postings20!.get(docId)).toBe(1); // 词频应为 1

    expect(index.getDocFreq(10)).toBe(1);
    expect(index.getDocFreq(999)).toBe(0); // 不存在该 token
  });

  // 输入：添加多篇文档，然后删除其中一篇
  // 输出：文档被彻底从索引中抹去
  // 预期行为：被删除的文档不再出现在 postings 和 _docs 中，且各项统计更新
  it("应能正确移除文档并清理倒排索引喵", () => {
    const index = new InvertedIndex();

    index.addDocument(1, [10, 20], { title: "Doc 1" });
    index.addDocument(2, [20, 30], { title: "Doc 2" });

    expect(index.totalDocs).toBe(2);
    expect(index.avgDocLength).toBe(2);

    // 删除文档 1
    index.removeDocument(1);

    expect(index.totalDocs).toBe(1);
    expect(index.avgDocLength).toBe(2);
    expect(index.getDocEntry(1)).toBeNull();
    expect(index.getDocEntry(2)).not.toBeNull();

    // 验证 term 10 的 postings 应已为空（或被删除）
    expect(index.getPostings(10)).toBeNull();

    // 验证 term 20 的 postings 中不包含 docId 1
    const postings20 = index.getPostings(20);
    expect(postings20).not.toBeNull();
    expect(postings20!.has(1)).toBe(false);
    expect(postings20!.get(2)).toBe(1);
  });

  // 输入：重复添加同一个 ID 的文档
  // 输出：覆盖原有的文档，并且总文档数不重复计算
  // 预期行为：旧文档长度被减去，新文档内容被正确更新
  it("重复添加相同 docId 时应覆盖原有记录喵", () => {
    const index = new InvertedIndex();

    index.addDocument(1, [10], { title: "Old" });
    index.addDocument(1, [20, 30, 40], { title: "New" });

    expect(index.totalDocs).toBe(1);
    expect(index.avgDocLength).toBe(3);

    expect(index.getPostings(10)).toBeNull();
    expect(index.getPostings(20)!.get(1)).toBe(1);
  });

  it("空 tokens 数组应添加文档但长度为 0", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [], { title: "empty" });
    expect(index.totalDocs).toBe(1);
    expect(index.avgDocLength).toBe(0);
    expect(index.termCount).toBe(0);
  });

  it("删除不存在的 docId 不应报错", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10], {});
    expect(() => index.removeDocument(999)).not.toThrow();
    expect(index.totalDocs).toBe(1);
  });

  it("查询不存在的 token 应返回 null 和 0", () => {
    const index = new InvertedIndex();
    expect(index.getPostings(999)).toBeNull();
    expect(index.getDocFreq(999)).toBe(0);
  });

  it("空索引的 totalDocs 和 avgDocLength 应为 0", () => {
    const index = new InvertedIndex();
    expect(index.totalDocs).toBe(0);
    expect(index.avgDocLength).toBe(0);
    expect(index.termCount).toBe(0);
  });

  it("多个 token 的文档删除后各 term 的 docFreq 应正确更新", () => {
    const index = new InvertedIndex();
    index.addDocument(1, [10, 20], {});
    index.addDocument(2, [10, 30], {});
    expect(index.getDocFreq(10)).toBe(2);
    expect(index.getDocFreq(20)).toBe(1);
    index.removeDocument(1);
    expect(index.getDocFreq(10)).toBe(1);
    expect(index.getDocFreq(20)).toBe(0);
    expect(index.getPostings(20)).toBeNull();
  });
});
