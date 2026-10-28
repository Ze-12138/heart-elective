"""把窗帘矢量化成「竖条渐变 + 下摆曲线」，用 PIL 近似渲染做预览。"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
BG = ROOT / "game" / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000

# 窗口内需要被覆盖的区域
X0, X1 = int(W * 0.688), int(W * 0.985)
Y0, Y1 = 0, int(H * 0.575)


def analyse(closed_path: pathlib.Path):
    im = Image.open(closed_path).convert("RGB").resize((W, H), Image.LANCZOS)
    crop = np.asarray(im.crop((X0, Y0, X1, Y1)), dtype=np.float32)
    h, w, _ = crop.shape
    # 每列平均色 → 1D 颜色剖面
    cols = crop.mean(axis=0)  # (w, 3)
    # 下摆：每列从下往上找"布料"结束的位置（亮度跌落）
    lum = crop.mean(axis=2)
    hem = []
    for x in range(w):
        col = lum[:, x]
        idx = h - 1
        while idx > 0 and col[idx] < 150:
            idx -= 1
        hem.append(int(idx))
    hem = np.array(hem, dtype=np.float32)
    # 平滑下摆
    k = 9
    hem = np.convolve(hem, np.ones(k) / k, mode="same")
    hem[: k] = hem[k]
    hem[-k:] = hem[-k - 1]
    return cols, hem, w, h


def render_pull(cols, hem, pull: float, base_name: str, out_name: str) -> None:
    base = Image.open(BG / base_name).convert("RGB")
    canvas = base.copy()
    draw = ImageDraw.Draw(canvas)
    w = len(cols)
    target = int(w * max(0.04, pull))
    if target < 2:
        canvas.save(OUT / out_name)
        return

    # 采样每一列的颜色，压缩到 target 宽度
    xs = np.linspace(0, w - 1, target).astype(int)
    for i, sx in enumerate(xs):
        x = X0 + target - 1 - i + (w - target)
        yy = Y0 + int(hem[sx])
        color = tuple(int(v) for v in cols[sx])
        draw.line([(X0 + w - target + i, Y0), (X0 + w - target + i, yy)], fill=color)
    canvas.save(OUT / out_name)


if __name__ == "__main__":
    cols, hem, w, h = analyse(BG / "sleep-girl-closed.jpg")
    print("剖面列数", w, "下摆范围", int(hem.min()), int(hem.max()))
    for p in (0.25, 0.5, 0.75, 1.0):
        render_pull(cols, hem, p, "sleep-girl-curtained.jpg", f"vec-{int(p*100)}.png")
    print("rendered")
