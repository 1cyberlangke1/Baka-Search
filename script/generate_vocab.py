"""
从 HuggingFace tokenizer.json 自动生成 vocab.js + vocab.d.ts。

用法:
  python script/generate_vocab.py

配置在 config.json（项目根目录），如需代理/镜像修改即可。

首次运行下载 ~32MB tokenizer.json 缓存到 tmp/data/gemma4-tokenizer/，
后续运行如果缓存有效则跳过下载。支持断点续传。
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from huggingface_hub import get_token

# ---------- 加载共享配置 ----------
ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config.json"

with open(CONFIG_PATH, "r") as f:
    _cfg = json.load(f)

MODEL_ID = _cfg["model_id"]
MIRROR = _cfg.get("hf_mirror", "") or ""
PROXY = _cfg.get("proxy", "") or ""
OUTPUT_DIR = ROOT / _cfg["paths"]["output_dir"]
CACHE_DIR = ROOT / _cfg["paths"]["cache_dir"]
CACHE_FILE = CACHE_DIR / "tokenizer.json"

# 拼 HF base URL
HF_BASE = MIRROR if MIRROR else "https://huggingface.co"

# ---------- HTTP session ----------
_session = requests.Session()
_hf_token = get_token()

if _hf_token:
    _session.headers.update({"Authorization": f"Bearer {_hf_token}"})

_proxies = {"http": PROXY, "https": PROXY} if PROXY else {}
_session.proxies.update(_proxies)


def log(msg: str = "", end="\n"):
    print(msg, end=end, flush=True)


# ---------- 下载 tokenizer.json ----------
def _get_file_size(url: str) -> int:
    """用 Range: bytes=0-0 取 Content-Range 获得远端文件大小。"""
    h = {"Range": "bytes=0-0"}
    r = _session.get(url, headers=h, timeout=30)
    r.raise_for_status()
    return int(r.headers["Content-Range"].split("/")[-1])


def _fetch_range(url: str, start: int, end: int) -> bytes:
    h = {"Range": f"bytes={start}-{end}"}
    r = _session.get(url, headers=h, timeout=30)
    r.raise_for_status()
    return r.content


def _verify_json(path: Path) -> bool:
    """检查文件是否是有效的 JSON（快速验证头部）。"""
    try:
        # 只解析前 1MB 看看根结构就够了
        with open(path, "rb") as f:
            head = f.read(1024 * 1024)
        json.loads(head.decode("utf-8"))
        return True
    except (json.JSONDecodeError, UnicodeDecodeError):
        return False


def _verify_full_json(path: Path) -> bool:
    """完整验证 JSON 文件。"""
    try:
        with open(path, "r", encoding="utf-8") as f:
            json.load(f)
        return True
    except (json.JSONDecodeError, ValueError):
        return False


def download_tokenizer_json() -> Path:
    """下载 tokenizer.json 到缓存目录，支持断点续传。"""
    if not PROXY:
        log(f"[缓存] 缓存目录: {CACHE_DIR}")
    else:
        log(f"[缓存] 缓存目录: {CACHE_DIR} | 代理: {PROXY}")

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    url = f"{HF_BASE}/{MODEL_ID}/resolve/main/tokenizer.json"

    # 如果缓存完整则跳过
    if CACHE_FILE.exists() and _verify_full_json(CACHE_FILE):
        log(f"[缓存] 命中: {CACHE_FILE} ({(CACHE_FILE.stat().st_size / 1024**2):.1f} MB)")
        return CACHE_FILE

    # 如果缓存文件存在但不完整（上次下载中断），尝试续传
    local_size = CACHE_FILE.stat().st_size if CACHE_FILE.exists() else 0

    if local_size > 0:
        # 先试远端文件大小
        try:
            remote_size = _get_file_size(url)
        except Exception:
            remote_size = 0

        if remote_size > 0 and local_size < remote_size:
            log(f"[续传] {local_size / 1024**2:.1f} MB → {remote_size / 1024**2:.1f} MB")
            headers = {"Range": f"bytes={local_size}-"}
            mode = "ab"
        elif remote_size > 0 and local_size >= remote_size:
            # 本地文件可能不完整但大小一样 → 重下
            log("[续传] 缓存文件损坏，重新下载")
            CACHE_FILE.unlink()
            local_size = 0
            headers = {}
            mode = "wb"
        else:
            # 拿不到远端正大小，直接续传
            headers = {"Range": f"bytes={local_size}-"}
            mode = "ab"
    else:
        headers = {}
        mode = "wb"

    if local_size == 0:
        log(f"[下载] {url}")

    t0 = time.time()
    resp = _session.get(url, headers=headers, timeout=30, stream=True)
    resp.raise_for_status()

    downloaded = local_size
    with open(CACHE_FILE, mode) as f:
        for chunk in resp.iter_content(8 * 1024 * 1024):
            if chunk:
                f.write(chunk)
                downloaded += len(chunk)

    elapsed = time.time() - t0
    size_mb = downloaded / 1024**2

    # 验证完整性
    if not _verify_full_json(CACHE_FILE):
        log(f"[错误] tokenizer.json 下载不完整或被损坏，请重试")
        CACHE_FILE.unlink(missing_ok=True)
        sys.exit(1)

    log(f"[完成] {size_mb:.1f} MB in {elapsed:.1f}s ({size_mb / elapsed:.1f} MB/s)")
    return CACHE_FILE


# ---------- 解析 tokenizer ----------
def load_tokenizer(path: Path):
    """解析 tokenizer.json → (vocab, merges, unk_id)"""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    model = data["model"]
    vocab = model["vocab"]
    merges_raw = model.get("merges", [])
    unk_id = vocab.get("<unk>", 3)

    # merges 可能是 [[left,right],...] 或 ["left right",...]
    merges = []
    for item in merges_raw:
        if isinstance(item, list) and len(item) >= 2:
            merges.append((item[0], item[1]))
        elif isinstance(item, str):
            parts = item.split()
            if len(parts) >= 2:
                merges.append((parts[0], parts[1]))
    return vocab, merges, unk_id


# ---------- 获取 license ----------
def fetch_license() -> str:
    """从 HuggingFace API 获取模型许可证。"""
    try:
        r = _session.get(f"{HF_BASE}/api/models/{MODEL_ID}", timeout=10)
        if r.status_code == 200:
            d = r.json()
            lic = d.get("cardData", {}).get("license") or d.get("license", "")
            if lic:
                return lic
    except Exception:
        pass
    return "unknown"


# ---------- Unicode 逃逸 ----------
def escape_js(s: str) -> str:
    """将字符串转为 \\uXXXX 序列。"""
    return "".join(f"\\u{ord(c):04X}" for c in s)


def escape_js_quoted(s: str) -> str:
    """返回双引号包围的 \\uXXXX 字符串。"""
    return '"' + escape_js(s) + '"'


# ---------- 生成 vocab.js ----------
def generate_vocab_js(vocab: dict, merges: list, unk_id: int, license_: str):
    """生成 src/vocab.js（全部 key 用 Unicode 逃逸）。"""
    output_path = OUTPUT_DIR / "vocab.js"
    log(f"[生成] {output_path}")

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z")
    model_url = f"https://huggingface.co/{MODEL_ID}"

    with open(output_path, "w", encoding="utf-8") as f:
        # 表头
        f.write(f"// Source: {MODEL_ID} ({model_url})\n")
        f.write(f"// License: {license_}\n")
        f.write(f"// Generated: {now}\n")
        f.write(f"// Vocab: {len(vocab)} tokens, Merges: {len(merges)}\n")
        f.write(f"// Auto-generated by script/generate_vocab.py — do not edit manually\n")
        f.write(f"\n")

        # unk_id
        f.write(f"export const GEMMA_UNK_ID = {unk_id};\n\n")

        # vocab
        f.write("export const GEMMA_VOCAB = {\n")
        for token, tid in vocab.items():
            f.write(f"  {escape_js_quoted(token)}: {tid},\n")
        f.write("};\n\n")

        # merges
        f.write("export const GEMMA_MERGES = [\n")
        for left, right in merges:
            f.write(f"  [{escape_js_quoted(left)}, {escape_js_quoted(right)}],\n")
        f.write("];\n")

    size_mb = output_path.stat().st_size / 1024**2
    log(f"[生成] {size_mb:.1f} MB — {len(vocab)} tokens, {len(merges)} merges")


# ---------- 生成 vocab.d.ts ----------
def generate_vocab_d_ts(license_: str):
    """生成 src/vocab.d.ts。"""
    output_path = OUTPUT_DIR / "vocab.d.ts"
    log(f"[生成] {output_path}")

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z")
    model_url = f"https://huggingface.co/{MODEL_ID}"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"// Source: {MODEL_ID} ({model_url})\n")
        f.write(f"// License: {license_}\n")
        f.write(f"// Generated: {now}\n")
        f.write(f"// Auto-generated by script/generate_vocab.py — do not edit manually\n")
        f.write(f"\n")
        f.write(f"export declare const GEMMA_UNK_ID: number;\n")
        f.write(f"export declare const GEMMA_VOCAB: Record<string, number>;\n")
        f.write(f"export declare const GEMMA_MERGES: [string, string][];\n")


# ---------- main ----------
def main():
    log("=" * 55)
    log(f"  生成 vocab.js / vocab.d.ts")
    log(f"  模型: {MODEL_ID}")
    log(f"  Base: {HF_BASE}")
    if PROXY:
        log(f"  代理: {PROXY}")
    log("=" * 55)
    log()

    # 1. 下载/使用缓存
    tokenizer_path = download_tokenizer_json()

    # 2. 获取 license
    log("[信息] 获取模型许可证...")
    license_ = fetch_license()
    log(f"  License: {license_}")

    # 3. 解析
    log("[信息] 解析 tokenizer...")
    vocab, merges, unk_id = load_tokenizer(tokenizer_path)
    log(f"  Vocab: {len(vocab)} tokens, Merges: {len(merges)}, Unk ID: {unk_id}")

    # 4. 生成
    t0 = time.time()
    generate_vocab_js(vocab, merges, unk_id, license_)
    generate_vocab_d_ts(license_)
    elapsed = time.time() - t0

    # 5. 摘要
    js_size = (OUTPUT_DIR / "vocab.js").stat().st_size / 1024**2
    dts_size = (OUTPUT_DIR / "vocab.d.ts").stat().st_size / 1024

    log()
    log("=" * 55)
    log(f"  生成完成 in {elapsed:.1f}s")
    log(f"  {OUTPUT_DIR / 'vocab.js'}: {js_size:.1f} MB")
    log(f"  {OUTPUT_DIR / 'vocab.d.ts'}: {dts_size:.1f} KB")
    log(f"  License: {license_}")
    log("=" * 55)


if __name__ == "__main__":
    main()
