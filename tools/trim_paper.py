#!/usr/bin/env python3
"""裁掉水彩纸一样的白边。

判定：四条边里至少三条是"浅色且非常平整"的纸边带，才认为是装裱留白，四边各自裁掉。
只有上下或只有左右的留白（例如淡天空）不裁。
"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

SRC = pathlib.Path(r"C:\Users\hp\Desktop\奶龙酱\tmp\art\bg2")
DST = pathlib.Path(r"C:\Users\hp\Desktop\奶龙酱\web\love\backgrounds-painted")
MAX_INSET = 0.10
STD_THRESH = 9.0
PAD = 4


def run_length(gray: np.ndarray) -> int:
    limit = int(gray.shape[0] * MAX_INSET)
    std = gray.std(axis=1)
    for i in range(limit):
        if std[i] > STD_THRESH:
            return max(0, i - PAD)
    return limit


def main() -> None:
    for src in sorted(SRC.glob("*.jpg")):
        im = Image.open(src).convert("RGB")
        arr = np.array(im)
        gray = arr.mean(axis=2).astype(np.float32)
        h, w = gray.shape

        top = run_length(gray)
        bottom = run_length(gray[::-1])
        left = run_length(gray.T)
        right = run_length(gray[::-1].T)
        sides = sum(1 for v in (top, bottom, left, right) if v > 8)
        ring = np.concatenate([arr[:4].reshape(-1, 3), arr[-4:].reshape(-1, 3),
                               arr[:, :4].reshape(-1, 3), arr[:, -4:].reshape(-1, 3)])
        bright = ring.mean() > 190

        if sides >= 3 and bright:
            box = (left, top, w - right, h - bottom)
            tag = f"trim t{top} b{bottom} l{left} r{right}"
        else:
            box = (0, 0, w, h)
            tag = "keep"
        out = im.crop(box)
        dst = DST / src.name
        dst.parent.mkdir(parents=True, exist_ok=True)
        out.save(dst, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"{src.stem:20} {w}x{h} -> {out.width}x{out.height}  [{tag}]")


if __name__ == "__main__":
    main()
