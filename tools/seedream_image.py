#!/usr/bin/env python3
"""用火山方舟 Seedream 生图（Seedream 只能走 /images/generations，不能当聊天模型用）。

用法：
    python tools/seedream_image.py "夕阳下的校园走廊，两个学生并肩走，日系动画风，无文字"
    python tools/seedream_image.py --model flash --size 1536x1024 --out game/assets/bg.jpg "..."

密钥来源：环境变量 VOLCARK_API_KEY，或 ~/.dsh/.credentials.yaml 里的 VOLCARK_API_KEY。
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

BASE = "https://ark.cn-beijing.volces.com/api/v3"
DEFAULT_MODEL = "doubao-seedream-5-0-pro-260628"
HERE = pathlib.Path(__file__).resolve().parent.parent


def read_key() -> str:
    key = os.environ.get("VOLCARK_API_KEY", "").strip()
    if key:
        return key
    cred = pathlib.Path.home() / ".dsh" / ".credentials.yaml"
    if cred.exists():
        m = re.search(r"VOLCARK_API_KEY:\s*(\S+)", cred.read_text(encoding="utf-8"))
        if m:
            return m.group(1)
    sys.exit("找不到 VOLCARK_API_KEY（环境变量或 ~/.dsh/.credentials.yaml）")


def post(path: str, payload: dict, key: str) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        try:
            err = json.loads(body)["error"]
            sys.exit(f"HTTP {exc.code} {err.get('code')}: {err.get('message')}")
        except (ValueError, KeyError):
            sys.exit(f"HTTP {exc.code}: {body[:500]}")


def as_image_ref(ref: str) -> str:
    """本地文件转 data URL；http(s) 直接透传。"""
    if ref.lower().startswith(("http://", "https://", "data:")):
        return ref
    path = pathlib.Path(ref)
    if not path.is_absolute():
        path = HERE / path
    if not path.exists():
        sys.exit(f"参考图不存在：{path}")
    mime = {".png": "image/png", ".webp": "image/webp"}.get(path.suffix.lower(), "image/jpeg")
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def generate(prompt: str, model: str, size: str, key: str, refs: list[str] | None = None) -> str:
    payload = {"model": model, "prompt": prompt, "size": size, "response_format": "url", "watermark": False}
    if refs:
        payload["image"] = [as_image_ref(r) for r in refs]
    data = post("/images/generations", payload, key)
    if not data.get("data"):
        sys.exit(f"返回里没有图片：{json.dumps(data, ensure_ascii=False)[:500]}")
    return data["data"][0]["url"]


def download(url: str, out: pathlib.Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=180) as resp, open(out, "wb") as fh:
        fh.write(resp.read())


def main() -> None:
    ap = argparse.ArgumentParser(description="Seedream 文生图")
    ap.add_argument("prompt", nargs="+", help="画面描述")
    ap.add_argument("--model", default=DEFAULT_MODEL,
                    help=f"模型 id，默认 {DEFAULT_MODEL}；也可用 doubao-seedream-5-0-flash-260915")
    ap.add_argument("--size", default="1024x1024")
    ap.add_argument("--ref", action="append", default=[], help="参考图（可多次），本地路径或 URL")
    ap.add_argument("--out", default="tmp/seedream.jpg")
    args = ap.parse_args()

    prompt = " ".join(args.prompt)
    key = read_key()
    url = generate(prompt, args.model, args.size, key, args.ref)
    out = pathlib.Path(args.out)
    if not out.is_absolute():
        out = HERE / out
    download(url, out)
    print(f"OK -> {out}  ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
