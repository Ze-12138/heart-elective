"""清晰版棋盘预览：单遍实线铅笔 + 轻微纸纹。"""

import math
import pathlib
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "tmp" / "art" / "shots"
S = 520
PAD = S * 0.055
GAP = (S - PAD * 2) / 14
INK = (74, 61, 53)


def paper():
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    t = np.clip((xx + yy) / (2 * S), 0, 1)
    c0 = np.array([247, 238, 218], np.float32)
    c1 = np.array([240, 226, 200], np.float32)
    c2 = np.array([232, 214, 180], np.float32)
    w = np.where(t < 0.55, t / 0.55, 0)
    arr = np.where(
        (t < 0.55)[..., None],
        c0[None, None, :] * (1 - w[..., None]) + c1[None, None, :] * w[..., None],
        c1[None, None, :] * (1 - ((t - 0.55) / 0.45)[..., None])
        + c2[None, None, :] * ((t - 0.55) / 0.45)[..., None],
    )
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def pts(x1, y1, x2, y2, seed, amp=1.1):
    r = random.Random(seed)
    return [(x1 + (x2 - x1) * i / 10 + (r.random() - 0.5) * amp,
             y1 + (y2 - y1) * i / 10 + (r.random() - 0.5) * amp) for i in range(11)]


img = paper()
d = ImageDraw.Draw(img, "RGBA")
grain = random.Random(90210)
for _ in range(1600):
    gx, gy = grain.random() * S, grain.random() * S
    gr = 0.4 + grain.random()
    d.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(146, 116, 78, 11))

for i in range(15):
    p = PAD + i * GAP
    d.line(pts(PAD, p, S - PAD, p, 1000 + i, 1.4), fill=(*INK, 219), width=1)
    d.line(pts(p, PAD, p, S - PAD, 2000 + i, 1.4), fill=(*INK, 219), width=1)

for a, b, c_, e_, sd in ((PAD, PAD, S - PAD, PAD, 31), (S - PAD, PAD, S - PAD, S - PAD, 32),
                         (S - PAD, S - PAD, PAD, S - PAD, 33), (PAD, S - PAD, PAD, PAD, 34)):
    d.line(pts(a, b, c_, e_, sd, 1.6), fill=(*INK, 242), width=3)

star = random.Random(555)
for gx, gy in ((3, 3), (11, 3), (3, 11), (11, 11), (7, 7)):
    cx, cy = PAD + gx * GAP, PAD + gy * GAP
    for _ in range(2):
        rr = max(2, GAP * 0.1) * (0.8 + star.random() * 0.3)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*INK, 210))

stones = [(7, 7, 1), (8, 8, 2), (6, 7, 1), (8, 6, 2), (7, 6, 1), (6, 8, 2), (8, 7, 1), (9, 5, 2), (5, 9, 1), (9, 8, 2)]
for x, y, c in stones:
    cx, cy = PAD + x * GAP, PAD + y * GAP
    rad = GAP * 0.43
    rnd = random.Random(3000 + y * 31 + x)
    ring = []
    for i in range(30):
        a = i / 30 * 2 * math.pi
        rr = rad + (rnd.random() - 0.5) * max(0.5, rad * 0.06)
        ring.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    if c == 1:
        d.polygon(ring, fill=(38, 34, 31))
        d.line(ring + [ring[0]], fill=(40, 34, 30, 235), width=2)
        d.ellipse([cx - rad * 0.5, cy - rad * 0.55, cx - rad * 0.05, cy - rad * 0.2], fill=(112, 106, 100))
    else:
        d.polygon(ring, fill=(252, 248, 238))
        d.line(ring + [ring[0]], fill=(116, 98, 76, 224), width=2)
        d.ellipse([cx - rad * 0.5, cy - rad * 0.55, cx - rad * 0.08, cy - rad * 0.22], fill=(255, 255, 255))

lx, ly = PAD + 9 * GAP, PAD + 8 * GAP
rr = random.Random(7777)
ring = [(lx + math.cos(i / 30 * 2 * math.pi) * (GAP * 0.55 + (rr.random() - 0.5) * GAP * 0.05),
         ly + math.sin(i / 30 * 2 * math.pi) * (GAP * 0.55 + (rr.random() - 0.5) * GAP * 0.05)) for i in range(30)]
d.line(ring + [ring[0]], fill=(201, 98, 47, 242), width=3)

W, H = S + 96, S + 210
card = Image.new("RGB", (W, H), (253, 250, 241))
dp = ImageDraw.Draw(card)
card.paste(img, (16, 16))
f1 = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 26)
f2 = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 17)
dp.text((24, S + 34), "五子棋 · 和奶龙酱", font=f1, fill=(74, 61, 53))
dp.text((24, S + 70), "「这里……你确定吗？」", font=f2, fill=(150, 116, 84))
tape = Image.new("RGBA", (110, 30), (226, 205, 160, 205))
card.paste(tape, (W // 2 - 55, 4), tape)
card = card.rotate(-1.1, resample=Image.BICUBIC, expand=True, fillcolor=(238, 228, 210))
out = Image.new("RGB", (card.width + 40, card.height + 40), (238, 228, 210))
out.paste(card, (20, 20))
out.save(OUT / "gomoku-crisp.png")
print("ok")
