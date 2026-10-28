"""参数化窗帘 v2：褶皱带自然摆动、下摆随褶皱起伏、整体有纵向渐变。"""

from __future__ import annotations

import math
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
BG = ROOT / "game" / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000

X0, X1 = int(W * 0.688), int(W * 0.985)
SILL = int(H * 0.545)
DROP = int(H * 0.045)

LIGHT = np.array([222, 223, 226], dtype=np.float32)
MID = np.array([192, 194, 199], dtype=np.float32)
DARK = np.array([148, 151, 158], dtype=np.float32)
FOLDS = 11


def ramp(t: np.ndarray) -> np.ndarray:
    t = np.clip(t, 0, 1)[..., None]
    lo = DARK + (MID - DARK) * (t / 0.5)
    hi = MID + (LIGHT - MID) * ((t - 0.5) / 0.5)
    return np.where(t < 0.5, lo, hi)


def render(openness: float, base_name: str, out_name: str) -> None:
    base = Image.open(BG / base_name).convert("RGB")
    canvas = np.asarray(base, dtype=np.float32).copy()

    win_w = X1 - X0
    cloth_w = max(6, int(win_w * openness))
    left = X1 - cloth_w
    hem = SILL + DROP

    ys = np.arange(hem, dtype=np.float32)
    xs = np.arange(cloth_w, dtype=np.float32)
    u = xs / cloth_w

    sway = 1.6 * np.sin(ys / hem * 2.4)          # 褶皱随高度摆动
    phase = 2 * math.pi * FOLDS * u[None, :] + sway[:, None]
    # 褶皱边界越靠近两侧越暗
    edge = np.sin(np.pi * (u + 0.02))[None, :] ** 0.4
    t = (0.55 + 0.45 * np.cos(phase)) * edge
    # 纵向：底部略暗
    t *= (1 - 0.22 * (ys / hem)[:, None])
    rgb = ramp(t)

    # 下摆：随褶皱起伏
    hem_curve = (hem + 6 * np.sin(2 * math.pi * FOLDS * u + 0.8) + 2 * np.sin(4 * math.pi * u)).astype(int)
    for i, hx in enumerate(hem_curve):
        rgb[int(min(hx, hem)) :, i] = 0  # 超出下摆的部分留空

    # 贴到画布
    for y in range(hem):
        row_end = np.searchsorted(hem_curve, y)   # 未使用，占位
        canvas[y, left:X1] = rgb[y]

    # 下摆以下的像素恢复原图（避免覆盖）
    for i, hx in enumerate(hem_curve):
        y0 = int(min(hx, hem))
        canvas[y0:hem, left + i] = np.asarray(base, dtype=np.float32)[y0:hem, left + i]

    # 左缘接触阴影
    for i in range(12):
        x = left - i - 1
        if x < X0:
            break
        a = 0.09 * (1 - i / 12)
        canvas[:hem, x] *= (1 - a)

    Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).save(OUT / out_name)


if __name__ == "__main__":
    for p in (0.15, 0.35, 0.6, 0.85, 1.0):
        render(p, "sleep-girl-curtained.jpg", f"cloth2-{int(p*100)}.png")
    print("rendered")
