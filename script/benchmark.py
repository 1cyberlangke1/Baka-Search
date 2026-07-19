"""
BakaSearch 检索基准 — MIRACL + Belebele + MLQA
含排行榜排名，输出中文 Markdown 到 docs/benchmark/

用法:
  python script/benchmark.py                        # 全量
  python script/benchmark.py --dataset miracl       # 只跑 MIRACL
  python script/benchmark.py --force                # 强制重跑
  python script/benchmark.py --leaderboard-only     # 只更新排行榜
"""

import argparse
import json
import math
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import requests

# ─── config ───
ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "script" / "config.json"
with open(CONFIG_PATH, encoding="utf-8") as f:
    _cfg = json.load(f)

MIRROR = _cfg.get("hf_mirror", "") or ""
PROXY = _cfg.get("proxy", "") or ""
HF_BASE = MIRROR if MIRROR else "https://huggingface.co"
TIMEOUT_PER_LANG = 1800

_session = requests.Session()
_session.proxies.update({"http": PROXY, "https": PROXY} if PROXY else {})

# ─── paths ───
BENCH_DIR = ROOT / "tmp" / "benchmark"
DATA_DIR = BENCH_DIR / "data"
RUN_DIR = BENCH_DIR / "run"
BENCH_DIR.mkdir(parents=True, exist_ok=True)
RUN_DIR.mkdir(parents=True, exist_ok=True)

DOCS_DIR = ROOT / "docs" / "benchmark"
DOCS_DIR.mkdir(parents=True, exist_ok=True)
LB_CACHE_DIR = BENCH_DIR / "leaderboard"
LB_CACHE_DIR.mkdir(parents=True, exist_ok=True)

NPX_CMD = shutil.which("npx") or "npx"
NODE_RUNNER = ROOT / "script" / "run_bench.ts"

# ─── datasets ───
DATASETS = {
    "miracl": {
        "hub": "mteb/MIRACLRetrievalHardNegatives",
        "task": "MIRACLRetrievalHardNegatives",
        "split": "dev",
    },
    "belebele": {
        "hub": "mteb/belebele",
        "task": "BelebeleRetrieval",
        "split": "dev",
    },
    "mlqa": {
        "hub": "mteb/MLQARetrieval",
        "task": "MLQARetrieval",
        "split": "test",
    },
}

# ─── log ───
log = lambda msg="", end="\n": print(msg, end=end, flush=True)

# ─── mteb leaderboard ───
GITHUB_TREE_URL = "https://api.github.com/repos/embeddings-benchmark/results/git/trees/main?recursive=1"
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/embeddings-benchmark/results/main"

def _model_name_from_path(path: str) -> str:
    """Extract model name from path like results/org__model/hash/file.json → org/model."""
    parts = path.split("/")
    if len(parts) >= 3:
        name = parts[1]
        name = name.replace("__", "/")
        return name
    return path.replace("_", "/").split("/")[1] if "_" in path else path


def _model_name_from_filename(filename: str) -> str:
    """Reverse mapping from cache filename to model name."""
    # filename: results_org__model_hash_task.json
    # Try extracting org/model from the prefix
    parts = filename.split("_")
    # Find the task name to know where model name ends
    task_keywords = ["MIRACLRetrieval", "BelebeleRetrieval", "MLQARetrieval"]
    task_pos = len(filename)
    for kw in task_keywords:
        pos = filename.find(kw)
        if pos != -1 and pos < task_pos:
            task_pos = pos
    model_part = filename[:task_pos].rstrip("_")
    # Strip "results_" prefix
    if model_part.startswith("results_"):
        model_part = model_part[8:]
    model_part = model_part.replace("__", "/")
    return model_part


def download_leaderboard(force: bool = False):
    """Fetch mteb leaderboard JSONs and cache locally.

    One-time GitHub tree API call to list all files, then download per-task.
    """
    tree_cache = LB_CACHE_DIR / "_tree_cache.json"

    if not force and tree_cache.exists():
        with open(tree_cache, encoding="utf-8") as f:
            tree = json.load(f)
    else:
        log("[排行榜] 获取 mteb 文件列表...")
        r = _session.get(GITHUB_TREE_URL, timeout=30)
        r.raise_for_status()
        tree = r.json().get("tree", [])
        with open(tree_cache, "w", encoding="utf-8") as f:
            json.dump(tree, f)
        log(f"[排行榜] 共 {len(tree)} 个文件")

    # Group files by task name
    tasks = {"MIRACLRetrievalHardNegatives": [], "BelebeleRetrieval": [], "MLQARetrieval": []}
    for item in tree:
        p = item["path"]
        for task in tasks:
            fname = f"{task}.json"
            if p.endswith(fname) and "v2" not in p:
                tasks[task].append(p)

    for task, files in tasks.items():
        cache_dir = LB_CACHE_DIR / task
        cache_dir.mkdir(parents=True, exist_ok=True)
        existing = len([f for f in cache_dir.iterdir() if f.name.endswith(".json") and not f.name.startswith("_")])
        need = len(files) - existing
        status = f"已有{existing}个" if existing > 0 else "未缓存"
        log(f"[排行榜] {task}: {len(files)} 个模型（{status}，还需下载{need}个）")

        for idx, fp in enumerate(files, 1):
            local = cache_dir / fp.replace("/", "_")
            if local.exists() and local.stat().st_size > 100:
                continue
            url = f"{GITHUB_RAW_BASE}/{fp}"
            try:
                r = _session.get(url, timeout=30)
                r.raise_for_status()
                with open(local, "wb") as f:
                    f.write(r.content)
            except Exception as e:
                log(f"\r  [{idx}/{len(files)}] ❌ {fp} ({e})")
                continue
            log(f"\r  [排行榜] {task}: {idx}/{len(files)} 下载中...", end="")
        log(f"\r  [排行榜] {task}: 完成 ({len(files)}/{len(files)})")

    return tasks


def compute_rank(task_name: str, our_score: float) -> tuple[int, int, list[tuple]]:
    """Return (rank, total_models, top10_list)."""
    cache_dir = LB_CACHE_DIR / task_name
    if not cache_dir.exists():
        return (0, 0, [])

    scores: list[tuple[str, float]] = []
    for f in cache_dir.iterdir():
        if not f.name.endswith(".json") or f.name.startswith("_"):
            continue
        try:
            with open(f, encoding="utf-8") as fh:
                data = json.load(fh)
            ndcg = None
            for sk in ("dev", "test", "validation"):
                try:
                    ndcg = data["scores"][sk][0]["ndcg_at_10"]
                    break
                except (KeyError, IndexError):
                    continue
            if ndcg is None:
                continue
            model_name = _model_name_from_filename(f.name)
            scores.append((model_name, ndcg))
        except Exception:
            continue

    if not scores:
        log(f"[错误] {task_name}: leaderboard JSON 中无有效 nDCG@10 分数")
        sys.exit(1)

    scores.sort(key=lambda x: -x[1])

    # Find where our score would rank
    rank = 1
    for s_score in scores:
        if our_score < s_score[1]:
            rank += 1

    # Build top 10 with our insertion
    ours = ("BakaSearch (baka-search)", our_score)
    top10_all = scores[:9] + [ours] + scores[9:]
    top10_all.sort(key=lambda x: -x[1])
    top10 = top10_all[:10]

    return (rank, len(scores) + 1, top10)


def get_dataset_langs(hub: str, split: str) -> list[str]:
    """从 HF API 动态获取数据集的所有语种/语言对列表。"""
    url = f"https://huggingface.co/api/datasets/{hub}"
    try:
        r = _session.get(url, timeout=15)
        r.raise_for_status()
        siblings = r.json()["siblings"]
    except Exception as e:
        log(f"[错误] 无法获取 {hub} 语种列表: {e}")
        sys.exit(1)

    langs = set()
    if "belebele" in hub:
        for s in siblings:
            path = s["rfilename"]
            if path.startswith("data/") and path.endswith(".jsonl"):
                lang = path[5:-6]
                langs.add(lang)
    else:
        for s in siblings:
            path = s["rfilename"]
            keyword = f"-corpus/{split}-"
            if keyword in path:
                lang = path.split(keyword)[0]
                langs.add(lang)

    result = sorted(langs)
    if not result:
        log(f"[错误] {hub}: 未找到任何语种文件，数据集结构可能有变")
        sys.exit(1)
    log(f"[信息] {hub}: {len(result)} 个语种/语言对")
    return result


def output_markdown(name: str, results: dict, langs: list[str], run_time: float):
    if not results:
        return

    avg_plain = float(np.mean([r["ndcg"] for r in results.values()]))
    avg_bridge = float(np.mean([r.get("bridgeNdcg", 0) for r in results.values()]))
    total_idx = sum(r["indexTimeMs"] for r in results.values())
    total_docs = sum(r["docCount"] for r in results.values())
    total_queries = sum(r["queryCount"] for r in results.values())
    avg_docs_s = total_docs / (total_idx / 1000) if total_idx > 0 else 0
    avg_ms_plain = np.mean([r["avgSearchMs"] for r in results.values()])
    avg_ms_bridge = np.mean([r.get("bridgeAvgSearchMs", 0) for r in results.values()])

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    task_name = DATASETS[name]["task"]

    rank, total_models, top10 = compute_rank(task_name, avg_plain)

    ds_labels = {"miracl": "MIRACL", "belebele": "Belebele", "mlqa": "MLQA"}
    ds_desc = {"miracl": "多语言检索", "belebele": "阅读理解检索", "mlqa": "跨语言检索"}

    lines = []
    lines.append(f"# BakaSearch — {ds_labels.get(name, name)} {ds_desc.get(name, '')}")
    lines.append("")
    lines.append(f"生成时间：{now}")
    lines.append("")

    # 摘要
    diff = avg_bridge - avg_plain
    lines.append("## 摘要")
    lines.append("")
    lines.append(f"| 指标 | 数值 |")
    lines.append(f"|------|------|")
    lines.append(f"| 纯 BM25 nDCG@10 | **{avg_plain:.4f}** |")
    lines.append(f"| +桥扩展 nDCG@10 | **{avg_bridge:.4f}** |")
    lines.append(f"| 差值 | **{diff:+.4f}** |")
    lines.append(f"| 排行榜排名 | **#{rank} / {total_models}** |")
    lines.append(f"| 总文档数 | {total_docs} |")
    lines.append(f"| 总查询数 | {total_queries} |")
    lines.append(f"| 索引吞吐 | {avg_docs_s:.0f} doc/s |")
    lines.append(f"| 纯 BM25 搜索延迟 | {avg_ms_plain:.2f} ms/query |")
    lines.append(f"| +桥扩展搜索延迟 | {avg_ms_bridge:.2f} ms/query |")
    lines.append(f"| 总耗时 | {run_time:.0f}s ({run_time/60:.1f} min) |")
    lines.append("")

    # 分语言对比
    lines.append("## 分语言对比")
    lines.append("")
    lines.append("| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |")
    lines.append("|------|---------|--------|------|-----------|-------------|")
    for lang in langs:
        r = results.get(lang)
        if r:
            d = r.get("bridgeNdcg", 0) - r["ndcg"]
            lines.append(f"| {lang} | {r['ndcg']:.4f} | {r.get('bridgeNdcg',0):.4f} | {d:+.4f} | {r['avgSearchMs']:.2f} | {r.get('bridgeAvgSearchMs',0):.2f} |")
        else:
            lines.append(f"| {lang} | ❌ | - | - | - | - |")
    lines.append(f"| **平均** | **{avg_plain:.4f}** | **{avg_bridge:.4f}** | **{diff:+.4f}** | {avg_ms_plain:.2f} | {avg_ms_bridge:.2f} |")
    lines.append("")

    # 排行榜
    lines.append("## 排行榜")
    lines.append("")
    for i, (m, s) in enumerate(top10):
        prefix = "#" + str(i + 1)
        marker = "  ← BakaSearch" if m == "BakaSearch (baka-search)" else ""
        lines.append(f"{prefix}  {m}  {s:.4f}{marker}")
    lines.append(f"#...")
    lines.append(f"#{rank}  BakaSearch（纯 BM25）  {avg_plain:.4f}  ←")
    if avg_bridge != avg_plain:
        lines.append(f"#{rank}  BakaSearch（+桥扩展）  {avg_bridge:.4f}")
    lines.append("#...")
    lines.append(f"#{total_models}  ...")
    lines.append("")

    path = DOCS_DIR / f"{name}.md"
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    log(f"[输出] {path}")


# ─── download helpers ───
def download_parquet(hub: str, config: str, split: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    url = f"{HF_BASE}/datasets/{hub}/resolve/main/{config}/{split}-00000-of-00001.parquet"
    try:
        r = _session.get(url, timeout=60)
        r.raise_for_status()
    except Exception:
        url = f"{HF_BASE}/datasets/{hub}/resolve/main/{config}/{split}.parquet"
        r = _session.get(url, timeout=60)
        r.raise_for_status()
    with open(dest, "wb") as f:
        f.write(r.content)
    return dest


def load_miracl(lang, split):
    c = download_parquet("mteb/MIRACLRetrievalHardNegatives", f"{lang}-corpus", split, DATA_DIR / "miracl" / f"{lang}-corpus.parquet")
    q = download_parquet("mteb/MIRACLRetrievalHardNegatives", f"{lang}-queries", split, DATA_DIR / "miracl" / f"{lang}-queries.parquet")
    qr = download_parquet("mteb/MIRACLRetrievalHardNegatives", f"{lang}-qrels", split, DATA_DIR / "miracl" / f"{lang}-qrels.parquet")
    return pd.read_parquet(c), pd.read_parquet(q), pd.read_parquet(qr)


def load_belebele(lang, split):
    cache_file = DATA_DIR / "belebele" / f"{lang}.jsonl"
    cache_file.parent.mkdir(parents=True, exist_ok=True)
    if not cache_file.exists():
        url = f"{HF_BASE}/datasets/mteb/belebele/resolve/main/data/{lang}.jsonl"
        r = _session.get(url, timeout=120)
        r.raise_for_status()
        cache_file.write_bytes(r.content)
    rows = []
    with open(cache_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    corpus_records = []
    queries_records = []
    qrels_records = []
    for r in rows:
        doc_id = f"{r['link']}_{r['question_number']}"
        corpus_records.append({"id": doc_id, "text": r["flores_passage"]})
        queries_records.append({"id": doc_id, "text": r["question"]})
        qrels_records.append({"query-id": doc_id, "corpus-id": doc_id, "score": 1})
    return pd.DataFrame(corpus_records), pd.DataFrame(queries_records), pd.DataFrame(qrels_records)


def load_mlqa(lang_pair, split):
    c = download_parquet("mteb/MLQARetrieval", f"{lang_pair}-corpus", split, DATA_DIR / "mlqa" / f"{lang_pair}-corpus.parquet")
    q = download_parquet("mteb/MLQARetrieval", f"{lang_pair}-queries", split, DATA_DIR / "mlqa" / f"{lang_pair}-queries.parquet")
    qr = download_parquet("mteb/MLQARetrieval", f"{lang_pair}-qrels", split, DATA_DIR / "mlqa" / f"{lang_pair}-qrels.parquet")
    return pd.read_parquet(c), pd.read_parquet(q), pd.read_parquet(qr)


# ─── nDCG@10 ───
def ndcg10(ranks):
    dcg = sum((2**r - 1) / math.log2(i + 2) for i, r in enumerate(ranks[:10]))
    idcg = sum(1.0 / math.log2(i + 2) for i in range(min(sum(ranks), 10)))
    return dcg / idcg if idcg > 0 else 0.0


# ─── run node.js ───
def run_node(corpus_df, queries_df, qrels_df, lang_dir, label):
    lang_dir.mkdir(parents=True, exist_ok=True)
    cf = lang_dir / "corpus.jsonl"
    qf = lang_dir / "queries.jsonl"
    qrf = lang_dir / "qrels.json"
    of = lang_dir / "output.json"
    rf = lang_dir / "result.json"
    if rf.exists():
        return json.loads(rf.read_text(encoding="utf-8"))

    qrel_map = {}
    for _, row in qrels_df.iterrows():
        qrel_map.setdefault(str(row["query-id"]), set()).add(str(row["corpus-id"]))
    has_title = "title" in corpus_df.columns

    with open(cf, "w", encoding="utf-8") as f:
        for _, row in corpus_df.iterrows():
            text = str(row.get("text", "") or "")
            if has_title and pd.notna(row.get("title")):
                text += " " + str(row["title"])
            f.write(json.dumps({"id": str(row["id"]), "text": text}, ensure_ascii=False) + "\n")

    with open(qf, "w", encoding="utf-8") as f:
        for _, row in queries_df.iterrows():
            f.write(json.dumps({"id": str(row["id"]), "text": str(row.get("text", "") or "")}, ensure_ascii=False) + "\n")

    with open(qrf, "w", encoding="utf-8") as f:
        json.dump({k: list(v) for k, v in qrel_map.items()}, f)

    cmd = [NPX_CMD, "tsx", str(NODE_RUNNER), str(cf), str(qf), str(of)]
    try:
        t0 = time.time()
        proc = subprocess.Popen(cmd, cwd=ROOT, stderr=subprocess.PIPE, text=True)
        for line in iter(proc.stderr.readline, ""):
            s = line.rstrip("\r\n")
            if s:
                log(f"\r  {s}", end="")
        proc.wait(timeout=TIMEOUT_PER_LANG)
        rt = time.time() - t0
    except subprocess.TimeoutExpired:
        proc.kill()
        log(f"\n  [{label}] 超时，跳过")
        return None
    except Exception as e:
        log(f"\n  [{label}] 错误: {e}")
        return None

    if not of.exists():
        return None

    out = json.loads(of.read_text(encoding="utf-8"))

    def calc_ndcg(results_key):
        ndcg_scores = [ndcg10([1 if str(did) in qrel_map.get(qid, set()) else 0 for did in doc_ids])
                       for qid, doc_ids in out.get(results_key, {}).items()
                       if qrel_map.get(qid)]
        return float(np.mean(ndcg_scores)) if ndcg_scores else 0.0

    plain_ndcg = calc_ndcg("plainResults")
    bridge_ndcg = calc_ndcg("bridgeResults")

    dc = out.get("docCount", 0)
    idx_ms = out.get("indexTimeMs", 0)
    result = {
        "ndcg": plain_ndcg, "bridgeNdcg": bridge_ndcg,
        "docCount": dc, "queryCount": out.get("queryCount", 0),
        "indexTimeMs": idx_ms,
        "avgSearchMs": out.get("plainAvgSearchMs", 0),
        "bridgeAvgSearchMs": out.get("bridgeAvgSearchMs", 0),
        "docsPerSec": dc / (idx_ms / 1000) if idx_ms > 0 else 0,
        "runTime": rt,
    }
    rf.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


# ─── eval ───
def eval_dataset(name, loader, split):
    langs = get_dataset_langs(DATASETS[name]["hub"], split)
    log(f"\n{'=' * 55}")
    log(f"  {name.upper()} ({len(langs)} 语种)")
    log(f"{'=' * 55}")

    results = {}
    lang_dir = RUN_DIR / name

    for idx, lang in enumerate(langs, 1):
        label = f"{lang:>12s}"
        log(f"\r  [{idx:>3}/{len(langs)}] {label}  下载数据...", end="")
        try:
            corpus, queries, qrels = loader(lang, split)
        except Exception as e:
            log(f"\r  [{idx:>3}/{len(langs)}] {label}  ❌ {e}")
            continue
        log(f"\r  [{idx:>3}/{len(langs)}] {label}  docs={len(corpus):>6} qrys={len(queries):>4}", end="")
        res = run_node(corpus, queries, qrels, lang_dir / lang, label)
        if res is None:
            log(f"\r  [{idx:>3}/{len(langs)}] {label}  ❌")
            continue
        bridge_str = f" bridge={res.get('bridgeNdcg',0):.4f}" if res.get('bridgeNdcg', 0) != res['ndcg'] else ""
        log(f"\r  [{idx:>3}/{len(langs)}] {label}  plain={res['ndcg']:.4f}{bridge_str}  idx={res['docsPerSec']:.0f}doc/s  srch={res['avgSearchMs']:.2f}ms/q  ⏱{res['runTime']:.1f}s")
        results[lang] = res

    log(f"\n  {'─' * 50}")
    if results:
        avg = float(np.mean([r["ndcg"] for r in results.values()]))
        avg_bridge = float(np.mean([r.get("bridgeNdcg", 0) for r in results.values()]))
        diff = avg_bridge - avg
        tt = sum(r["runTime"] for r in results.values())
        log(f"  纯 BM25: {avg:.4f} (+桥扩展: {avg_bridge:.4f} 差值: {diff:+.4f})  总耗时: {tt:.0f}s")
    else:
        tt = 0.0

    # Cache raw data for leaderboard re-generation
    raw = {"results": {k: v for k, v in results.items()}, "langs": langs, "runTime": tt}
    (BENCH_DIR / f"{name}_raw.json").write_text(json.dumps(raw, ensure_ascii=False), encoding="utf-8")

    output_markdown(name, results, langs, tt)
    return results


def generate_leaderboard_only():
    """Re-generate markdown from cached results without re-running eval."""
    for name in DATASETS:
        raw_path = BENCH_DIR / f"{name}_raw.json"
        if not raw_path.exists():
            log(f"[跳过] {name}: 无缓存结果")
            continue
        raw = json.loads(raw_path.read_text(encoding="utf-8"))
        output_markdown(name, raw["results"], raw["langs"], raw["runTime"])


def main():
    parser = argparse.ArgumentParser(description="BakaSearch 检索基准")
    parser.add_argument("--dataset", choices=list(DATASETS))
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--leaderboard-only", action="store_true", help="只更新排行榜排名，不重跑评测")
    args = parser.parse_args()

    if args.force:
        shutil.rmtree(RUN_DIR, ignore_errors=True)
        RUN_DIR.mkdir(parents=True, exist_ok=True)

    # Always refresh leaderboard data
    download_leaderboard(force=args.force)

    if args.leaderboard_only:
        generate_leaderboard_only()
        return

    datasets_to_run = [args.dataset] if args.dataset else list(DATASETS.keys())
    loaders = {"miracl": load_miracl, "belebele": load_belebele, "mlqa": load_mlqa}

    for name in datasets_to_run:
        info = DATASETS[name]
        eval_dataset(name, loaders[name], info["split"])

    total_time = 0
    log(f"\n{'=' * 55}")
    log(f"  全部完成")
    log(f"{'=' * 55}")
    for name in datasets_to_run:
        raw_path = BENCH_DIR / f"{name}_raw.json"
        if raw_path.exists():
            raw = json.loads(raw_path.read_text(encoding="utf-8"))
            avg = float(np.mean([r["ndcg"] for r in raw["results"].values()])) if raw["results"] else 0
            avg_bridge = float(np.mean([r.get("bridgeNdcg", 0) for r in raw["results"].values()])) if raw["results"] else 0
            diff = avg_bridge - avg
            tt = raw.get("runTime", 0)
            total_time += tt
            log(f"  {name:>10s}: 纯BM25={avg:.4f}  +桥={avg_bridge:.4f}  ({diff:+.4f})  ⏱{tt:.0f}s")
    log(f"\n  总计: ⏱{total_time:.0f}s ({total_time/60:.1f} min)")
    log(f"  输出目录: docs/benchmark/")


if __name__ == "__main__":
    main()
