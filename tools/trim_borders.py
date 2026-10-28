#!/usr/bin/env python3
"""裁掉背景图四周的纯色（纸张）留边，并输出到 game/backgrounds-painted/。"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

SRC = pathlib.Path(r"C:\Users\hp\Desktop\奶龙酱\tmp\art\bg2")
DST = pathlib.Path(r"C:\Users\hp\Desktop\奶龙酱\web\love\backgrounds-painted")
MAX_RATIO = 0.09  # 每边最多裁 9%
TOL = 14


def uniform_run(edges: np.ndarray, colors: np.ndarray) -> int:
    """从外向内数，连续多少行/列与四角颜色一致。"""
    h = edges.shape[0]
    limit = int(h * MAX_RATIO)
    base = colors
    run = 0
    for i in range(min(limit, h)):
        row = edges[i].astype(np.int16)
        if np.all(np.abs(row - base) <= TOL):
            run += 1
        else:
            break
    return run


def trim(path: pathlib.Path, out: pathlib.Path) -> tuple[tuple[int, int], tuple[int, int]]:
    im = Image.open(path).convert("RGB")
    arr = np.array(im)
    h, w, _ = arr.shape
    corners = np.array([arr[0, 0], arr[0, w - 1], arr[h - 1, 0], arr[h - 1, w - 1]], dtype=np.int16)
    base = np.median(corners, axis=0)

    top = uniform_run(arr, base)
    bottom = uniform_run(arr[::-1], base)
    left = uniform_run(np.transpose(arr, (1, 0, 2)), base)
    right = uniform_run(np.transpose(arr[::-1], (1, 0, 2)), base)

    box = (left, top, w - right, h - bottom)
    if box[2] - box[0] < w * 0.5 or box[3] - box[1] < h * 0.5:
        box = (0, 0, w, h)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.crop(box).save(out, "JPEG", quality=88, optimize=True, progressive=True)
    return (w, h), (box[2] - box[0], box[3] - box[1])


def main() -> None:
    for src in sorted(SRC.glob("*.jpg")):
        before, after = trim(src, DST / src.name)
        mark = "" if before == after else "  trimmed"
        print(f"{src.stem:20} {before[0]}x{before[1]} -> {after[0]}x{after[1]}{mark}")


if __name__ == "__main__":
    main()
