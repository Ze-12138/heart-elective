#!/usr/bin/env python3
"""把纯白底的立绘抠成透明 PNG：四角洪水填充去白 → 去白边 → 裁切 → 统一高度。

用法：python tools/cutout.py tmp/art/raw game/characters 1200
"""

from __future__ import annotations

import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SENTINEL = (255, 0, 254)


def cutout(src: pathlib.Path, dst: pathlib.Path, target_h: int) -> tuple[int, int]:
    im = Image.open(src)
    if im.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")

    work = im.copy()
    w, h = work.size
    draw = ImageDraw.Draw(work)
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1)):
        try:
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=32)
        except Exception:  # noqa: BLE001
            pass

    arr = np.array(work)
    bg_mask = (arr[:, :, 0] == SENTINEL[0]) & (arr[:, :, 1] == SENTINEL[1]) & (arr[:, :, 2] == SENTINEL[2])

    alpha = Image.fromarray(np.where(bg_mask, 0, 255).astype(np.uint8), mode="L")
    # 去 1px 白边，再轻微柔化
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    rgba = Image.open(src)
    rgba = rgba.convert("RGB") if rgba.mode != "RGBA" else rgba
    out = Image.new("RGBA", im.size)
    out.paste(rgba, mask=alpha)

    bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        pad = 6
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                min(im.size[0], bbox[2] + pad), min(im.size[1], bbox[3] + pad))
        out = out.crop(bbox)

    if out.size[1] != target_h:
        scale = target_h / out.size[1]
        out = out.resize((max(1, round(out.size[0] * scale)), target_h), Image.LANCZOS)

    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, "WEBP", quality=90, method=6)
    return out.size


def main() -> None:
    src_dir = pathlib.Path(sys.argv[1])
    dst_dir = pathlib.Path(sys.argv[2])
    target_h = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
    for src in sorted(src_dir.glob("*.jp*g")):
        dst = dst_dir / f"{src.stem}.webp"
        size = cutout(src, dst, target_h)
        print(f"{src.name:22} -> {dst.name:22} {size[0]}x{size[1]}  {dst.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
