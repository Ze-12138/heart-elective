"""清爽校园风棋盘预览：直线外框、米白偏冷纸面、灰蓝网格。"""

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
GRID = (108, 112, 128)
INK = (74, 61, 53)


def paper():
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    t = np.clip((xx + yy) / (2 * S), 0, 1)
    c0 = np.array([253, 252, 249], np.float32)
    c1 = np.array([247, 244, 236], np.float32)
    c2 = np.array([239, 238, 232], np.float32)
    w = np.where(t < 0.55, t / 0.55, 0)
    arr = np.where(
        (t < 0.55)[..., None],
        c0[None, None, :] * (1 - w[..., None]) + c1[None, None, :] * w[..., None],
        c1[None, None, :] * (1 - ((t - 0.55) / 0.45)[..., None])
        + c2[None, None, :] * ((t - 0.55) / 0.45)[..., None],
    )
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def pts(x1, y1, x2, y2, seed, amp):
    r = random.Random(seed)
    return [(x1 + (x2 - x1) * i / 10 + (r.random() - 0.5) * amp,
             y1 + (y2 - y1) * i / 10 + (r.random() - 0.5) * amp) for i in range(11)]


img = paper()
d = ImageDraw.Draw(img, "RGBA")
grain = random.Random(90210)
for _ in range(1400):
    gx, gy = grain.random() * S, grain.random() * S
    gr = 0.4 + grain.random()
    d.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(120, 124, 140, 13))

for i in range(15):
    p = PAD + i * GAP
    d.line(pts(PAD, p, S - PAD, p, 1000 + i, 0.6), fill=(*GRID, 184), width=1)
    d.line(pts(p, PAD, p, S - PAD, 2000 + i, 0.6), fill=(*GRID, 184), width=1)

FW = 3
d.rectangle([PAD - FW // 2, PAD - FW // 2, S - PAD + FW // 2, S - PAD + FW // 2],
            outline=(*INK, 242), width=FW)

star = random.Random(555)
for gx, gy in ((3, 3), (11, 3), (3, 11), (11, 11), (7, 7)):
    cx, cy = PAD + gx * GAP, PAD + gy * GAP
    for _ in range(2):
        rr = max(2, GAP * 0.1) * (0.8 + star.random() * 0.3)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*GRID, 204))

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
        d.polygon(ring, fill=(48, 48, 56))
        d.line(ring + [ring[0]], fill=(48, 48, 56), width=2)
        d.ellipse([cx - rad * 0.5, cy - rad * 0.55, cx - rad * 0.05, cy - rad * 0.2], fill=(126, 126, 138))
    else:
        d.polygon(ring, fill=(255, 253, 249))
        d.line(ring + [ring[0]], fill=(150, 146, 138), width=2)
        d.ellipse([cx - rad * 0.5, cy - rad * 0.55, cx - rad * 0.08, cy - rad * 0.22], fill=(255, 255, 255))

lx, ly = PAD + 9 * GAP, PAD + 8 * GAP
rr = random.Random(7777)
ring = []
for i in range(30):
    a = i / 30 * 2 * math.pi
    rad = GAP * 0.55 + (rr.random() - 0.5) * GAP * 0.05
    ring.append((lx + math.cos(a) * rad, ly + math.sin(a) * rad))
d.line(ring + [ring[0]], fill=(232, 122, 92, 242), width=3)

W, H = S + 96, S + 210
card = Image.new("RGB", (W, H), (255, 253, 248))
dp = ImageDraw.Draw(card)
card.paste(img, (16, 16))
f1 = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 26)
f2 = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 17)
dp.text((24, S + 34), "五子棋 · 和奶龙酱", font=f1, fill=(74, 61, 53))
dp.text((24, S + 70), "「这里……你确定吗？」", font=f2, fill=(150, 116, 84))
tape = Image.new("RGBA", (110, 30), (208, 226, 236, 210))
card.paste(tape, (W // 2 - 55, 4), tape)
card = card.rotate(-1.1, resample=Image.BICUBIC, expand=True, fillcolor=(238, 240, 244))
out = Image.new("RGB", (card.width + 40, card.height + 40), (238, 240, 244))
out.paste(card, (20, 20))
out.save(OUT / "gomoku-fresh.png")
print("ok")
