"""按原图颜色校准帘子、加 -2.6° 倾角，并预览随开度变化的明暗。"""

from __future__ import annotations

import math
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
BG = ROOT / "game" / "backgrounds-painted"
CH = ROOT / "game" / "characters"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000

TARGET = np.array([181, 183, 187], dtype=np.float32)   # 原图帘子采样色
TILT = -2.6                                            # 原图实测倾角


def recolor(src: pathlib.Path, dst: pathlib.Path) -> np.ndarray:
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    alpha = a[:, :, 3] > 128
    mean = a[:, :, :3][alpha].mean(axis=0)
    scale = TARGET / np.maximum(mean, 1)
    a[:, :, :3] = np.clip(a[:, :, :3] * scale[None, None, :], 0, 255)
    Image.fromarray(a.astype(np.uint8), "RGBA").save(dst, "WEBP", quality=92, method=6)
    print("recolor", src.name, "mean", mean.round(0), "-> scale", scale.round(3))
    return scale


def preview(base_name: str, curtain_path: pathlib.Path, openness: float, out_name: str) -> None:
    base = Image.open(BG / base_name).convert("RGB")
    cur = Image.open(curtain_path).convert("RGBA")

    win_w = int(W * 0.30)
    win_h = int(H * 0.545)
    drop = int(H * 0.05)
    right = int(W * 0.985)

    cw = max(10, int(win_w * openness))
    panel = cur.resize((cw, win_h + drop), Image.LANCZOS)
    panel = panel.rotate(TILT, resample=Image.BICUBIC, expand=False)

    canvas = base.copy().convert("RGBA")
    canvas.alpha_composite(panel, (right - cw, -int(H * 0.01)))

    # 明暗：合得越多，窗边越暗（月光被挡）
    shade = np.zeros((H, W, 4), dtype=np.float32)
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W * 0.85, H * 0.30
    dist = np.sqrt(((xx - cx) / (W * 0.45)) ** 2 + ((yy - cy) / (H * 0.55)) ** 2)
    falloff = np.clip(1 - dist, 0, 1) ** 1.5
    alpha = (0.06 + 0.26 * openness) * falloff
    shade[:, :, 0] = 20
    shade[:, :, 1] = 24
    shade[:, :, 2] = 34
    shade[:, :, 3] = alpha * 255
    canvas = Image.alpha_composite(canvas, Image.fromarray(shade.astype(np.uint8), "RGBA"))
    canvas.convert("RGB").save(OUT / out_name)


if __name__ == "__main__":
    dst = CH / "curtain-scene.webp"
    recolor(ROOT / "tmp" / "art" / "curtain-cut2" / "curtain-b.webp", dst)
    for p in (0.3, 0.6, 0.85, 1.0):
        preview("sleep-girl.jpg", dst, p, f"lit-{int(p*100)}.png")
    print("preview done")
