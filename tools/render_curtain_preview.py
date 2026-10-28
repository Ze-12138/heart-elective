"""把 curtain.svg 用 PIL 近似渲染出来，做一张预览图（我这边起不了浏览器）。"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOVE = ROOT / "game"
OUT = ROOT / "tmp" / "art" / "shots"


def bez(p0, p1, p2, p3, n=60):
    t = np.linspace(0, 1, n)[:, None]
    pts = ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3
    return pts


def make_curtain(w=320, h=640) -> Image.Image:
    poly = [(10, 0), (310, 0), (313, 560)]
    curve = bez(np.array([313.0, 560.0]), np.array([240.0, 572.0]),
                np.array([150.0, 572.0]), np.array([8.0, 558.0]))
    poly += [tuple(p) for p in curve]

    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.6))

    # 垂直渐变：上 #cdcfd4 → 中 #c0c3c9 → 下 #b0b3ba
    top, mid, bot = np.array([205, 207, 212]), np.array([192, 195, 201]), np.array([176, 179, 186])
    grad = np.zeros((h, w, 3), dtype=np.float32)
    for y in range(h):
        t = y / (h - 1)
        c = top + (mid - top) * (t / 0.5) if t < 0.5 else mid + (bot - mid) * ((t - 0.5) / 0.5)
        grad[y, :, :] = c
    cloth = Image.fromarray(grad.astype(np.uint8), "RGB").convert("RGBA")

    # 褶皱
    folds = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(folds)
    for x0, wd in ((26, 18), (78, 20), (134, 17), (192, 19), (250, 16), (292, 14)):
        d.rectangle([x0, 0, x0 + wd, h], fill=(149, 152, 161, 90))
    for x0, wd in ((52, 11), (106, 10), (163, 11), (221, 10), (272, 9)):
        d.rectangle([x0, 0, x0 + wd, h], fill=(224, 226, 231, 110))
    folds = folds.filter(ImageFilter.GaussianBlur(3.4))

    curtain = Image.alpha_composite(cloth, folds)
    curtain.putalpha(mask)
    return curtain


def main() -> None:
    W, H = 1600, 1000
    base = Image.open(LOVE / "backgrounds-painted" / "sleep-girl.jpg").convert("RGBA")
    orig = Image.open(LOVE / "backgrounds-painted" / "sleep-girl-curtained.jpg").convert("RGB")
    curtain = make_curtain()

    # 窗口容器（CSS 里的值）
    cx, cy, cw, ch = int(W * 0.675), int(H * -0.01), int(W * 0.305), int(H * 0.52)
    pw, ph = int(cw * 1.12), ch
    panel = curtain.resize((pw, ph), Image.LANCZOS).rotate(2.6, resample=Image.BICUBIC, expand=False)

    for name, open_ratio in (("closed", 0.0), ("half", 0.5), ("open", 1.0)):
        layer = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        layer.alpha_composite(panel, (int(-0.06 * cw + open_ratio * pw), 0))
        canvas = base.copy()
        canvas.alpha_composite(layer.crop((0, 0, cw, ch)), (cx, cy))
        canvas.convert("RGB").save(OUT / f"curtain-render-{name}.png", quality=92)

    # 与原图对比（窗口区域）
    new = Image.open(OUT / "curtain-render-closed.png").convert("RGB")
    a = new.crop((cx - 40, 0, cx + cw + 40, ch + 60))
    b = orig.crop((cx - 40, 0, cx + cw + 40, ch + 60))
    sheet = Image.new("RGB", (a.width, a.height * 2 + 10), (245, 240, 232))
    sheet.paste(b, (0, 0))
    sheet.paste(a, (0, a.height + 10))
    sheet.save(OUT / "curtain-compare-final.png")
    print("->", OUT / "curtain-compare-final.png")


if __name__ == "__main__":
    main()
