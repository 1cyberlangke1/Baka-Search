"""
从模型嵌入层生成桥接扩展表 (bridge-data.js + bridge-data.d.ts)。

三阶段管线:
  阶段 1 (embed):   从 HuggingFace 下载嵌入层 safetensors（范围请求+断点续传）
  阶段 2 (compute):  GPU/CPU top-K 余弦相似度计算 + 跨语言桥验证
  阶段 3 (generate):  PASS 对构建 CSR 格式, 生成 JS 源文件

用法:
  python script/build-bridge.py                    # 全量
  python script/build-bridge.py --stage embed      # 只下载嵌入层
  python script/build-bridge.py --stage compute    # 只计算
  python script/build-bridge.py --stage generate   # 只生成
  python script/build-bridge.py --device cpu       # 强制 CPU
  python script/build-bridge.py --force            # 重跑所有阶段

配置在 script/config.json。
"""

import argparse
import json
import math
import os
import struct
import sys
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import requests
import torch
from huggingface_hub import get_token

# ─── config ────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "script" / "config.json"

with open(CONFIG_PATH, encoding="utf-8") as f:
    _cfg = json.load(f)

MODEL_ID = _cfg["model_id"]
MIRROR = _cfg.get("hf_mirror", "") or ""
PROXY = _cfg.get("proxy", "") or ""
EMBED_DIR = ROOT / _cfg["paths"]["embed_dir"]
CACHE_DIR = ROOT / _cfg["paths"]["cache_dir"]
OUTPUT_DIR = ROOT / _cfg["paths"]["output_dir"]
BRIDGE_CFG = _cfg.get("bridge", {})

HF_BASE = MIRROR if MIRROR else "https://huggingface.co"
HF_TOKEN = get_token()

TOPK = BRIDGE_CFG.get("topk", 100)
BATCH_GPU = BRIDGE_CFG.get("batch_gpu", 512)
BATCH_CPU = BRIDGE_CFG.get("batch_cpu", 64)
CAND_THRESH = BRIDGE_CFG.get("candidate_threshold", 0.35)
VOTE_THRESH = BRIDGE_CFG.get("vote_threshold", 0.35)
VOTE_RATIO = BRIDGE_CFG.get("vote_ratio", 4)
EMBED_TENSOR_KEY = BRIDGE_CFG.get(
    "embed_tensor_key",
    "model.language_model.embed_tokens.weight",
)

N = 262144

# ─── HTTP session ──────────────────────────────────────────────────────────
_session = requests.Session()
if HF_TOKEN:
    _session.headers.update({"Authorization": f"Bearer {HF_TOKEN}"})
_proxies = {"http": PROXY, "https": PROXY} if PROXY else {}
_session.proxies.update(_proxies)

EMBED_PATH = EMBED_DIR / "embed_weight.safetensors"
INDEX_PATH = EMBED_DIR / "model.safetensors.index.json"
BRIDGE_TSV_DIR = EMBED_DIR / "similarity"
BRIDGE_TSV = BRIDGE_TSV_DIR / "bridge_pass.tsv"
VOCAB_CACHE = CACHE_DIR / "tokenizer.json"

# ─── helpers ───────────────────────────────────────────────────────────────

def log(msg: str = "", end: str = "\n"):
    print(msg, end=end, flush=True)


def _get_remote_size(url: str) -> int:
    h = {"Range": "bytes=0-0"}
    r = _session.get(url, headers=h, timeout=30)
    r.raise_for_status()
    return int(r.headers["Content-Range"].split("/")[-1])


def _fetch_range(url: str, start: int, end: int) -> bytes:
    h = {"Range": f"bytes={start}-{end}"}
    r = _session.get(url, headers=h, timeout=60)
    r.raise_for_status()
    return r.content


# ─── 阶段 1: 下载嵌入层 ────────────────────────────────────────────────────

def _verify_safetensors_header(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            hl = struct.unpack("<Q", f.read(8))[0]
            hdr = json.loads(f.read(hl))
            if EMBED_TENSOR_KEY not in hdr:
                return False
            sh = hdr[EMBED_TENSOR_KEY]
            return sh["dtype"] == "BF16" and sh["shape"] == [N, 2816]
    except Exception:
        return False


def download_embed(force: bool = False):
    EMBED_DIR.mkdir(parents=True, exist_ok=True)

    if not force and EMBED_PATH.exists() and _verify_safetensors_header(EMBED_PATH):
        size_mb = EMBED_PATH.stat().st_size / 1024**2
        log(f"[缓存] 嵌入层已缓存: {EMBED_PATH} ({size_mb:.0f} MB)")
        return

    index_url = f"{HF_BASE}/{MODEL_ID}/resolve/main/model.safetensors.index.json"
    log(f"[下载] index.json from {HF_BASE}/{MODEL_ID}")

    r = _session.get(index_url, timeout=60)
    r.raise_for_status()
    index_data = r.json()
    weight_map = index_data.get("weight_map", {})

    shard_path = weight_map.get(EMBED_TENSOR_KEY)
    if not shard_path:
        raise RuntimeError(f"在 index 中找不到 {EMBED_TENSOR_KEY}")

    shard_url = f"{HF_BASE}/{MODEL_ID}/resolve/main/{shard_path}"
    log(f"[信息] {EMBED_TENSOR_KEY} 位于分片: {shard_path}")

    shard_size = _get_remote_size(shard_url)
    log(f"[信息] 分片大小: {shard_size / 1024**3:.2f} GB")

    hdr_size = min(1024 * 1024, shard_size)
    hdr_bytes = _fetch_range(shard_url, 0, hdr_size - 1)
    hdr_len = struct.unpack("<Q", hdr_bytes[:8])[0]
    hdr_json = json.loads(hdr_bytes[8:8 + hdr_len])
    meta = hdr_json.get(EMBED_TENSOR_KEY)
    if not meta:
        raise RuntimeError(f"在 safetensors header 中找不到 {EMBED_TENSOR_KEY}")

    doff_start, doff_end = meta["data_offsets"]
    total_tensor_bytes = doff_end - doff_start
    log(f"[信息] 嵌入张量偏移: {doff_start}-{doff_end} ({total_tensor_bytes / 1024**3:.2f} GB)")

    local_size = EMBED_PATH.stat().st_size if EMBED_PATH.exists() else 0
    expected_total = 8 + hdr_len + ((8 - hdr_len % 8) % 8) + total_tensor_bytes

    if not force and local_size >= expected_total:
        if _verify_safetensors_header(EMBED_PATH):
            log(f"[缓存] 嵌入层已存在: {EMBED_PATH}")
            return
        else:
            log("[续传] 缓存文件损坏, 重新下载")
            EMBED_PATH.unlink(missing_ok=True)
            local_size = 0
            doff_offset = 0
    else:
        doff_offset = max(0, local_size - (8 + hdr_len + ((8 - hdr_len % 8) % 8)))
        if doff_offset > 0:
            log(f"[续传] 嵌入层 {local_size / 1024**2:.0f} MB 已存在")

    if local_size == 0:
        safe_hdr = json.dumps(
            {EMBED_TENSOR_KEY: {"dtype": "BF16", "shape": [N, 2816], "data_offsets": [0, total_tensor_bytes]}},
            separators=(",", ":"),
        ).encode()
        pad = (8 - len(safe_hdr) % 8) % 8
        safe_hdr += b" " * pad
        with open(EMBED_PATH, "wb") as f:
            f.write(struct.pack("<Q", len(safe_hdr)))
            f.write(safe_hdr)
        local_size = 8 + len(safe_hdr)
        doff_offset = 0

    if doff_offset < total_tensor_bytes:
        chunk_start = doff_start + doff_offset
        chunk_end = doff_end - 1
        log(f"[下载] 张量数据 {doff_offset / 1024**2:.0f}/{total_tensor_bytes / 1024**3:.2f} GB")
        t0 = time.time()
        data = _fetch_range(shard_url, chunk_start, chunk_end)
        with open(EMBED_PATH, "ab") as f:
            f.write(data)
        elapsed = time.time() - t0
        mb = len(data) / 1024**2
        log(f"[完成] {mb:.0f} MB in {elapsed:.1f}s ({mb / elapsed:.1f} MB/s)")

    if not _verify_safetensors_header(EMBED_PATH):
        log("[错误] 嵌入层下载不完整")
        sys.exit(1)

    size_mb = EMBED_PATH.stat().st_size / 1024**2
    log(f"[完成] 嵌入层: {size_mb:.0f} MB")


# ─── 阶段 2: 计算桥接表 ────────────────────────────────────────────────────

def _same_script(a: str, b: str) -> bool:
    def scripts(tok):
        for c in tok:
            if c == "\u2581":
                continue
            try:
                yield unicodedata.name(c).split()[0]
            except ValueError:
                continue
    sa = set(scripts(a)) or {"LATIN"}
    sb = set(scripts(b)) or {"LATIN"}
    return bool(sa & sb)


def compute_bridge(device: str, force: bool = False):
    if not force and BRIDGE_TSV.exists() and BRIDGE_TSV.stat().st_size > 100:
        log(f"[缓存] 桥接表已存在: {BRIDGE_TSV}")
        return

    log(f"[信息] 设备: {device}")
    batcher = BATCH_GPU if device == "cuda" else BATCH_CPU

    log("[信息] 加载词表...")
    with open(VOCAB_CACHE, encoding="utf-8") as f:
        tokenizer_data = json.load(f)
        vocab = tokenizer_data["model"]["vocab"]
    rev = {v: k for k, v in vocab.items()}
    special_ids = {t["id"] for t in tokenizer_data.get("added_tokens", []) if t.get("special")}
    log(f"  {N} tokens, {len(special_ids)} special")

    log("[信息] 计算 Token 书写系统元数据...")
    script_of = [""] * N
    is_valid = [True] * N
    for tid in range(N):
        tok = rev.get(tid)
        if not tok or tid in special_ids or len(tok) > 25:
            is_valid[tid] = False
            continue
        for c in tok:
            if c == "\u2581":
                continue
            try:
                script_of[tid] = unicodedata.name(c).split()[0]
            except ValueError:
                continue
            break

    log("[信息] 加载嵌入层...")
    embed_sd = torch.load(EMBED_PATH, weights_only=True, map_location=device)
    weight = list(embed_sd.values())[0]
    log(f"  Shape: {list(weight.shape)}, Dtype: {weight.dtype}")

    log("[信息] 归一化...")
    norm = weight.to(torch.float32)
    norm = norm / norm.norm(dim=1, keepdim=True).clamp(min=1e-12)
    log(f"  {N} tokens on {norm.device}")

    # ── Pass 1: top-K ──
    log("\n=== Pass 1: top-K ===")
    topk_vals = torch.empty(N, TOPK, dtype=torch.float32, device="cpu")
    topk_idx = torch.empty(N, TOPK, dtype=torch.int64, device="cpu")
    t1_start = time.time()

    for batch_start in range(0, N, batcher):
        batch_end = min(batch_start + batcher, N)
        batch = norm[batch_start:batch_end]
        sim = batch @ norm.T
        vals, idx = sim.topk(TOPK + 1)
        topk_vals[batch_start:batch_end] = vals[:, 1:].cpu()
        topk_idx[batch_start:batch_end] = idx[:, 1:].cpu()
        del sim, vals, idx, batch

        elapsed = time.time() - t1_start
        speed = batch_end / elapsed if elapsed > 0 else 0
        log(f"  [{batch_end}/{N}] {100 * batch_end // N}%  {speed:.0f} tok/s")

    t1_time = time.time() - t1_start
    avg_speed = N / t1_time
    log(f"Pass 1 完成: {t1_time:.0f}s ({avg_speed:.0f} tok/s 平均)")

    # ── Pass 2: 桥验证 ──
    log("\n=== Pass 2: 桥验证 ===")
    BRIDGE_TSV_DIR.mkdir(parents=True, exist_ok=True)
    out_lines = []
    pass_lines = []
    total_candidates = 0
    total_passed = 0
    total_blocked = 0
    t2_start = time.time()

    for batch_start in range(0, N, batcher):
        batch_end = min(batch_start + batcher, N)
        bsize = batch_end - batch_start

        batch_plans = []
        all_cand = set()
        all_bridge = set()

        for i in range(bsize):
            tid = batch_start + i
            if not is_valid[tid]:
                continue

            val_row = topk_vals[tid]
            idx_row = topk_idx[tid]
            mean_val = float(val_row.mean().item())
            if mean_val <= 0:
                continue

            cand_ids = []
            for j in range(TOPK):
                s_sim = float(val_row[j].item())
                if s_sim < CAND_THRESH:
                    break
                sid = int(idx_row[j].item())
                if not is_valid[sid]:
                    continue
                cand_ids.append(sid)

            if len(cand_ids) < 2:
                continue

            a_script = script_of[tid]
            bridge_ids = [c for c in cand_ids if c < N and script_of[c] != a_script]
            same_ids = [c for c in cand_ids if c < N and script_of[c] == a_script]
            if not bridge_ids or not same_ids:
                continue

            sim_map = {}
            for j in range(TOPK):
                sid = int(idx_row[j].item())
                if sid in same_ids or sid in bridge_ids:
                    sim_map[sid] = float(val_row[j].item())

            same_with_sim = [(c, sim_map.get(c, 0.0)) for c in same_ids]
            a_tok = rev.get(tid, "")
            a_str = a_tok.replace("\u2581", "_")
            for bid in bridge_ids:
                b_str = rev.get(bid, "").replace("\u2581", "_")
                s_val = sim_map.get(bid, 0.0)
                out_lines.append(f"{tid}\t{bid}\t{s_val:.4f}\t0\t0\t0\tPASS\n")
                pass_lines.append(f"{tid}\t{bid}\t{s_val:.4f}\n")

            all_cand.update(same_ids)
            all_bridge.update(bridge_ids)
            batch_plans.append((tid, bridge_ids, same_with_sim, mean_val))

        if not batch_plans:
            continue

        P_list = list(all_cand)
        Q_list = list(all_bridge)
        P_t = torch.tensor(P_list, device=device)
        Q_t = torch.tensor(Q_list, device=device)
        sim_mat = norm[P_t] @ norm[Q_t].T
        sim_cpu = sim_mat.cpu().numpy()

        p_lookup = {pid: i for i, pid in enumerate(P_list)}
        q_lookup = {qid: i for i, qid in enumerate(Q_list)}

        for tid, bridge_ids, same_with_sim, mean_val in batch_plans:
            M = len(bridge_ids)
            q_indices = [q_lookup[bid] for bid in bridge_ids]
            for sid, s_sim in same_with_sim:
                pi = p_lookup.get(sid)
                if pi is not None:
                    votes = int((sim_cpu[pi, q_indices] > VOTE_THRESH).sum())
                    thr_needed = (M + VOTE_RATIO - 1) // VOTE_RATIO
                    verdict = "PASS" if votes >= thr_needed else "BLOCK"
                else:
                    votes = 0
                    thr_needed = 0
                    verdict = "BLOCK"
                if verdict == "PASS":
                    total_passed += 1
                else:
                    total_blocked += 1
                total_candidates += 1

                b_str = rev.get(sid, "").replace("\u2581", "_")
                out_lines.append(f"{tid}\t{sid}\t{s_sim:.4f}\t{M}\t{votes}\t{thr_needed}\t{verdict}\n")
                if verdict == "PASS":
                    pass_lines.append(f"{tid}\t{sid}\t{s_sim:.4f}\n")

        elapsed = time.time() - t2_start
        speed = batch_end / elapsed if elapsed > 0 else 0
        log(f"  [{batch_end}/{N}] {100 * batch_end // N}%  {speed:.0f} tok/s")

    t2_time = time.time() - t2_start
    log(f"\nPass 2 完成: {t2_time:.0f}s")

    log(f"\n[写入] {len(out_lines)} 行 → {BRIDGE_TSV.parent / 'bridge_results.tsv'}")
    with open(BRIDGE_TSV.parent / "bridge_results.tsv", "w", encoding="utf-8") as f:
        f.write("a_id\tb_id\tsim_ab\tbridges\tvotes\tthreshold\tverdict\n")
        f.writelines(out_lines)

    log(f"[写入] {len(pass_lines)} 行 → {BRIDGE_TSV}")
    with open(BRIDGE_TSV, "w", encoding="utf-8") as f:
        f.write("a_id\tb_id\tsim_ab\n")
        f.writelines(pass_lines)

    t_total = time.time() - t1_start
    log(f"\n=== 摘要 ===")
    log(f"候选: {total_candidates}")
    log(f"  PASS:  {total_passed} ({total_passed / max(1, total_candidates) * 100:.1f}%)")
    log(f"  BLOCK: {total_blocked} ({total_blocked / max(1, total_candidates) * 100:.1f}%)")
    log(f"Pass 1: {t1_time:.0f}s, Pass 2: {t2_time:.0f}s, 总计: {t_total:.0f}s")


# ─── 阶段 3: 生成 JS ─────────────────────────────────────────────────────

def _escape_js(s: str) -> str:
    return "".join(f"\\u{ord(c):04X}" for c in s)


def generate_js():
    log("[信息] 加载词表...")
    with open(VOCAB_CACHE, encoding="utf-8") as f:
        vocab = json.load(f)["model"]["vocab"]
    rev_vocab = {v: k for k, v in vocab.items()}

    log("[信息] 读取桥接表...")
    pairs = []
    is_id_format = None

    with open(BRIDGE_TSV, encoding="utf-8") as f:
        f.readline()
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            a_raw, b_raw, sim_str = parts[0], parts[1], parts[2]

            if is_id_format is None and a_raw:
                try:
                    int(a_raw)
                    is_id_format = True
                except ValueError:
                    is_id_format = False

            try:
                sim = float(sim_str)
            except ValueError:
                continue

            if is_id_format:
                try:
                    a_id = int(a_raw)
                    b_id = int(b_raw)
                except ValueError:
                    continue
            else:
                a_tok = a_raw.replace("_", "\u2581")
                b_tok = b_raw.replace("_", "\u2581")
                a_id = vocab.get(a_tok)
                b_id = vocab.get(b_tok)
                if a_id is None or b_id is None:
                    continue

            pairs.append((a_id, b_id, sim))

    log(f"  {len(pairs)} 个 PASS 对")

    log("[信息] 构建 CSR...")
    pairs.sort(key=lambda x: x[0])
    offsets: list[int] = []
    dst_ids: list[int] = []

    i = 0
    for src_id in range(N):
        offsets.append(i)
        while i < len(pairs) and pairs[i][0] == src_id:
            _, b_id, sim = pairs[i]
            sim_int = min(100, max(0, round(sim * 100)))
            packed = (sim_int << 18) | (b_id & 0x3FFFF)
            dst_ids.append(packed)
            i += 1
    offsets.append(len(dst_ids))

    log(f"  Offsets: {len(offsets)}, Pairs: {len(dst_ids)}")

    log("[信息] 写入 bridge-data.js...")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z")
    model_url = f"https://huggingface.co/{MODEL_ID}"

    js_path = OUTPUT_DIR / "bridge-data.js"
    with open(js_path, "w", encoding="utf-8") as f:
        # 元信息表头
        f.write(f"// Source: {MODEL_ID} ({model_url})\n")
        f.write(f"// License: {BRIDGE_CFG.get('license', 'apache-2.0')}\n")
        f.write(f"// Generated: {now}\n")
        f.write(f"// Pairs: {len(pairs)}, TopK: {TOPK}, Threshold: {CAND_THRESH}, VoteThreshold: {VOTE_THRESH}\n")
        f.write(f"// EmbedKey: {EMBED_TENSOR_KEY}\n")
        f.write(f"// Auto-generated by script/build-bridge.py — do not edit manually\n")
        f.write("\n")

        f.write(f"export const BRIDGE_OFFSETS = [{','.join(str(x) for x in offsets)}];\n")
        f.write(f"\n")
        f.write(f"export const BRIDGE_PAIRS = [{','.join(str(x) for x in dst_ids)}];\n")

    js_size = js_path.stat().st_size / 1024**2
    log(f"[生成] {js_path} ({js_size:.1f} MB)")

    log("[信息] 写入 bridge-data.d.ts...")
    dts_path = OUTPUT_DIR / "bridge-data.d.ts"
    with open(dts_path, "w", encoding="utf-8") as f:
        f.write(f"// Source: {MODEL_ID} ({model_url})\n")
        f.write(f"// License: {BRIDGE_CFG.get('license', 'apache-2.0')}\n")
        f.write(f"// Generated: {now}\n")
        f.write(f"// Auto-generated by script/build-bridge.py — do not edit manually\n")
        f.write("\n")
        f.write("export declare const BRIDGE_OFFSETS: number[];\n")
        f.write("export declare const BRIDGE_PAIRS: number[];\n")

    dts_size = dts_path.stat().st_size / 1024
    log(f"[生成] {dts_path} ({dts_size:.1f} KB)")
    
    log(f"\n=== 完成 ===")
    log(f"  {js_path}: {js_size:.1f} MB")
    log(f"  {dts_path}: {dts_size:.1f} KB")


# ─── main ──────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="构建桥接扩展表")
    parser.add_argument("--stage", choices=["embed", "compute", "generate"], help="只运行指定阶段")
    parser.add_argument("--device", choices=["cuda", "cpu"], help="强制指定设备")
    parser.add_argument("--force", action="store_true", help="强制重新运行")
    args = parser.parse_args()

    stages = [args.stage] if args.stage else ["embed", "compute", "generate"]
    device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")

    log("=" * 55)
    log(f"  build-bridge.py — 桥接扩展表生成")
    log(f"  模型: {MODEL_ID}")
    log(f"  Base: {HF_BASE}  |  设备: {device}")
    if PROXY:
        log(f"  代理: {PROXY}")
    if args.force:
        log("  模式: --force (强制重跑)")
    log("=" * 55)
    log()

    for stage in stages:
        log(f"{'=' * 55}")
        log(f"  阶段: {stage}")
        log(f"{'=' * 55}")

        if stage == "embed":
            download_embed(force=args.force)
        elif stage == "compute":
            if not EMBED_PATH.exists():
                log("[错误] 嵌入层未下载, 先运行 embed 阶段")
                sys.exit(1)
            if not VOCAB_CACHE.exists():
                log(f"[错误] tokenizer.json 未缓存 ({VOCAB_CACHE}), 请先运行 generate_vocab.py")
                sys.exit(1)
            compute_bridge(device, force=args.force)
        elif stage == "generate":
            if not BRIDGE_TSV.exists():
                log(f"[错误] 桥接表未生成 ({BRIDGE_TSV}), 先运行 compute 阶段")
                sys.exit(1)
            if not VOCAB_CACHE.exists():
                log(f"[错误] tokenizer.json 未缓存 ({VOCAB_CACHE}), 请先运行 generate_vocab.py")
                sys.exit(1)
            generate_js()

    log()
    log("=" * 55)
    log("  全部完成")
    log("=" * 55)


if __name__ == "__main__":
    main()
