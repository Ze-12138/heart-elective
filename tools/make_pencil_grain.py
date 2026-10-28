#!/usr/bin/env python3
"""生成一张可平铺的铅笔/纸张纹理（白底 + 极淡灰痕），用于正片叠底。"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "game" / "backgrounds" / "pencil-grain.png"
SIZE = 512
rng = np.random.default_rng(7)


def smooth_noise(size: int, cells: int) -> np.ndarray:
    """低分辨率随机噪声放大 → 平滑斑块。"""
    small = rng.random((cells, cells)).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8), "L").resize((size, size), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def main() -> None:
    base = np.zeros((SIZE, SIZE), dtype=np.float32)
    for cells, weight in ((4, 0.45), (16, 0.3), (64, 0.18), (256, 0.07)):
        base += smooth_noise(SIZE, cells) * weight
    base = (base - base.min()) / (base.max() - base.min())

    # 细小的铅笔颗粒
    speckle = rng.random((SIZE, SIZE)).astype(np.float32)
    speckle = np.where(speckle > 0.982, 1.0, 0.0)

    # 轻微纤维：横竖两向的细线
    fibers = np.zeros((SIZE, SIZE), dtype=np.float32)
    for _ in range(90):
        y = rng.integers(0, SIZE)
        length = rng.integers(40, 220)
        x = rng.integers(0, SIZE)
        fibers[y, x:x + length] = 0.35
    fibers = np.asarray(
        Image.fromarray((fibers * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.6)),
        dtype=np.float32,
    ) / 255.0

    darkness = (base * 0.55 + speckle * 0.85 + fibers * 0.5).clip(0, 1)
    gray = (255 - darkness * 46).astype(np.uint8)  # 最深处约 209，很淡
    Image.fromarray(gray, "L").convert("RGB").save(OUT, optimize=True)
    print("->", OUT, OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    from PIL import ImageFilter

    main()
