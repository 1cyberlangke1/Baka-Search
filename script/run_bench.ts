import { readFileSync, writeFileSync } from "fs";
import { BakaSearch } from "../src/BakaSearch.js";
import { BridgeTable } from "../src/BridgeTable.js";

const corpusPath = process.argv[2];
const queriesPath = process.argv[3];
const outputPath = process.argv[4];

if (!corpusPath || !queriesPath || !outputPath) {
  process.stderr.write(`用法: node script/run_bench.ts <corpus.jsonl> <queries.jsonl> <output.json>\n`);
  process.exit(1);
}

function now(): number {
  return Number(process.hrtime.bigint()) / 1e6;
}

function readJsonl(path: string): any[] {
  const lines = readFileSync(path, "utf-8").split("\n").filter(Boolean);
  return lines.map((l) => JSON.parse(l));
}

const corpus = readJsonl(corpusPath);
const queries = readJsonl(queriesPath);
const BATCH = 1000;

async function main() {
  let indexTimeMs: number;
  try {
    const search = new BakaSearch({ fields: ["text"] });
    const t0 = now();
    for (let i = 0; i < corpus.length; i += BATCH) {
      const batch = corpus.slice(i, i + BATCH);
      search.addAll(batch);
      const progress = Math.min(i + BATCH, corpus.length);
      process.stderr.write(`\r  索引中... ${progress}/${corpus.length}`);
    }
    indexTimeMs = now() - t0;
    process.stderr.write(`\r  索引完成: ${corpus.length} docs in ${(indexTimeMs / 1000).toFixed(1)}s\n`);

    const searchOpts = { topK: 10 };

    // 纯 BM25 搜索
    process.stderr.write(`\r  纯 BM25 搜索...\n`);
    const plainTimes: number[] = [];
    const results: Record<string, number[]> = {};
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i]!;
      const t0 = now();
      const res = search.search(q.text, searchOpts);
      plainTimes.push(now() - t0);
      results[q.id] = res.map((r) => r.id as number);
      if ((i + 1) % 100 === 0 || i === queries.length - 1) {
        process.stderr.write(`\r  纯 BM25... ${i + 1}/${queries.length}`);
      }
    }
    process.stderr.write(`\n`);
    const plainAvg = plainTimes.reduce((a, b) => a + b, 0) / plainTimes.length;

    // +桥扩展搜索
    process.stderr.write(`\r  加载桥扩展表...\n`);
    await BridgeTable.load();

    const bridgeTimes: number[] = [];
    const bridgeResults: Record<string, number[]> = {};
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i]!;
      const t0 = now();
      const res = await search.searchWithBridge(q.text, searchOpts);
      bridgeTimes.push(now() - t0);
      bridgeResults[q.id] = res.map((r) => r.id as number);
      if ((i + 1) % 100 === 0 || i === queries.length - 1) {
        process.stderr.write(`\r  +桥扩展... ${i + 1}/${queries.length}`);
      }
    }
    process.stderr.write(`\n`);
    const bridgeAvg = bridgeTimes.reduce((a, b) => a + b, 0) / bridgeTimes.length;

    const output = {
      indexTimeMs,
      plainResults: results,
      plainAvgSearchMs: plainAvg,
      bridgeResults,
      bridgeAvgSearchMs: bridgeAvg,
      queryCount: queries.length,
      docCount: corpus.length,
    };
    writeFileSync(outputPath, JSON.stringify(output));
  } catch (e: any) {
    process.stderr.write(`\n错误: ${e.message}\n`);
    process.exit(1);
  }
}

main();
