import { readFileSync, writeFileSync, existsSync } from "fs";
import { BakaSearch } from "../src/BakaSearch.js";

const corpusPath = process.argv[2];
const queriesPath = process.argv[3];
const outputPath = process.argv[4];

if (!corpusPath || !queriesPath || !outputPath) {
  process.stderr.write(`用法: node benchmark/run.js <corpus.jsonl> <queries.jsonl> <output.json>\n`);
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

// 索引
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

  // 搜索
  const searchTimePerQuery: number[] = [];
  const results: Record<string, number[]> = {};
  const searchOpts = { topK: 10 };

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i]!;
    const t0 = now();
    const res = search.search(q.text, searchOpts);
    const elapsed = now() - t0;
    searchTimePerQuery.push(elapsed);
    results[q.id] = res.map((r) => r.id as number);

    if ((i + 1) % 100 === 0 || i === queries.length - 1) {
      process.stderr.write(`\r  搜索中... ${i + 1}/${queries.length}`);
    }
  }
  process.stderr.write(`\n`);

  const totalSearchMs = searchTimePerQuery.reduce((a, b) => a + b, 0);
  const avgSearchMs = totalSearchMs / searchTimePerQuery.length;

  const output = {
    indexTimeMs,
    totalSearchMs,
    avgSearchMs,
    queryCount: queries.length,
    docCount: corpus.length,
    results,
  };
  writeFileSync(outputPath, JSON.stringify(output));
} catch (e: any) {
  process.stderr.write(`\n错误: ${e.message}\n`);
  process.exit(1);
}
