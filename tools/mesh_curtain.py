"""把窗帘布切成竖片，按拖动量压缩，模拟布料收拢。"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
BG = ROOT / "game" / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000

# 窗口区域（原图坐标系）
WIN = {"girl": (0.685, 0.0, 0.985, 0.555)}


def fold_edges(fabric: Image.Image, n: int = 8) -> list[int]:
    """按竖向亮度变化找褶皱边界。"""
    a = np.asarray(fabric.convert("L"), dtype=np.float32)
    prof = a.mean(axis=0)
    grad = np.abs(np.gradient(prof))
    # 在 8 等分附近找梯度峰
    edges = [0]
    step = fabric.width / n
    for i in range(1, n):
        lo = int(step * i - step * 0.45)
        hi = int(step * i + step * 0.45)
        idx = lo + int(np.argmax(grad[lo:hi]))
        edges.append(idx)
    edges.append(fabric.width)
    return edges


def render(who: str, pull: float, base_name: str, closed_name: str, out_name: str) -> Image.Image:
    base = Image.open(BG / base_name).convert("RGB")
    closed = Image.open(BG / closed_name).convert("RGB").resize((W, H), Image.LANCZOS)
    l, t, r, b = WIN[who]
    x0, x1 = int(W * l), int(W * r)
    y0, y1 = int(H * t), int(H * b)
    win_w, win_h = x1 - x0, y1 - y0

    fabric = closed.crop((x0, y0, x1, y1))
    edges = fold_edges(fabric, 8)

    canvas = base.copy()
    target_w = max(6, int(win_w * pull))
    # 每片按"越靠近右侧压缩越少"的曲线分配宽度
    n = len(edges) - 1
    weights = []
    for i in range(n):
        # 右侧的片压缩少一点，模拟布在拉动端堆叠
        k = 1 - 0.55 * (i / max(1, n - 1))
        weights.append((edges[i + 1] - edges[i]) * (pull ** k))
    scale = target_w / sum(weights)

    pos = 0
    brightness = 0.88 + 0.12 * pull
    for i in range(n):
        sw = max(1, int(round(weights[i] * scale)))
        piece = fabric.crop((edges[i], 0, edges[i + 1], win_h))
        piece = piece.resize((sw, win_h), Image.LANCZOS)
        piece = ImageEnhance.Brightness(piece).enhance(brightness)
        # 片与片之间加一道暗影，增强褶皱分隔
        arr = np.asarray(piece, dtype=np.float32)
        shade = np.ones(sw, dtype=np.float32)
        edge_px = min(3, max(1, sw // 8))
        shade[:edge_px] *= 0.92
        shade[-edge_px:] *= 0.92
        arr *= shade[None, :, None]
        piece = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
        canvas.paste(piece, (x0 + win_w - target_w + pos, y0))
        pos += sw

    canvas.save(OUT / out_name)
    return canvas


if __name__ == "__main__":
    for p in (0.25, 0.5, 0.75, 1.0):
        render("girl", p, "sleep-girl-curtained.jpg", "sleep-girl-closed.jpg", f"mesh-{int(p*100)}.png")
    print("rendered")
