"""按蜡笔/铅笔笔触渲染一版棋盘预览（与 minigame.js 参数一致）。"""

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
    img = Image.new("RGB", (S, S), (247, 238, 218))
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


def dashed_polyline(draw, pts, color, width, seed, passes=2):
    rnd = random.Random(seed)
    for p in range(passes):
        local = [(x + (rnd.random() - 0.5) * width * 0.85,
                  y + (rnd.random() - 0.5) * width * 0.85) for x, y in pts]
        dash = width * (4 + rnd.random() * 7)
        gap = width * (0.15 + rnd.random() * 0.7)
        alpha = int(255 * (0.5 if p == 0 else 0.26))
        w = max(1, int(round(width * (1 if p == 0 else 0.62))))
        phase = rnd.random() * width * 6
        acc = -phase
        for i in range(len(local) - 1):
            (x1, y1), (x2, y2) = local[i], local[i + 1]
            seg = math.hypot(x2 - x1, y2 - y1)
            steps = max(1, int(seg))
            for k in range(steps):
                t0 = k / steps
                t1 = (k + 1) / steps
                acc += seg / steps
                if acc % (dash + gap) < dash:
                    draw.line(
                        [(x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0),
                         (x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1)],
                        fill=(color[0], color[1], color[2], alpha),
                        width=w,
                    )


def jitter_pts(x1, y1, x2, y2, seed, steps=10, amp=1.1):
    rnd = random.Random(seed)
    out = []
    for i in range(steps + 1):
        t = i / steps
        out.append((x1 + (x2 - x1) * t + (rnd.random() - 0.5) * amp,
                    y1 + (y2 - y1) * t + (rnd.random() - 0.5) * amp))
    return out


img = paper()
d = ImageDraw.Draw(img, "RGBA")

grain = random.Random(90210)
for _ in range(2200):
    gx, gy = grain.random() * S, grain.random() * S
    gr = 0.4 + grain.random() * 1.2
    d.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(146, 116, 78, 16))
for _ in range(90):
    gx, gy = grain.random() * S, grain.random() * S
    ln = 6 + grain.random() * 22
    ang = (grain.random() - 0.5) * 0.5
    d.line([(gx, gy), (gx + math.cos(ang) * ln, gy + math.sin(ang) * ln)],
           fill=(160, 130, 90, 18), width=1)

for i in range(15):
    p = PAD + i * GAP
    dashed_polyline(d, jitter_pts(PAD, p, S - PAD, p, 1000 + i), INK, 1.6, 4000 + i)
    dashed_polyline(d, jitter_pts(p, PAD, p, S - PAD, 2000 + i), INK, 1.6, 5000 + i)

FW = 3.0
dashed_polyline(d, jitter_pts(PAD, PAD, S - PAD, PAD, 31), INK, FW, 6031, 3)
dashed_polyline(d, jitter_pts(S - PAD, PAD, S - PAD, S - PAD, 32), INK, FW, 6032, 3)
dashed_polyline(d, jitter_pts(S - PAD, S - PAD, PAD, S - PAD, 33), INK, FW, 6033, 3)
dashed_polyline(d, jitter_pts(PAD, S - PAD, PAD, PAD, 34), INK, FW, 6034, 3)

star = random.Random(555)
for gx, gy in ((3, 3), (11, 3), (3, 11), (11, 11), (7, 7)):
    cx, cy = PAD + gx * GAP, PAD + gy * GAP
    for _ in range(3):
        rr = max(2, GAP * 0.11) * (0.7 + star.random() * 0.5)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*INK, 190))


def circle_pts(cx, cy, r, seed, amp, steps=30):
    rnd = random.Random(seed)
    pts = []
    for i in range(steps):
        a = i / steps * 2 * math.pi
        rr = r + (rnd.random() - 0.5) * amp
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    pts.append(pts[0])
    return pts


stones = [(7, 7, 1), (8, 8, 2), (6, 7, 1), (8, 6, 2), (7, 6, 1), (6, 8, 2), (8, 7, 1), (9, 5, 2), (5, 9, 1), (9, 8, 2)]
for x, y, c in stones:
    cx, cy = PAD + x * GAP, PAD + y * GAP
    rad = GAP * 0.43
    pts = circle_pts(cx, cy, rad, 3000 + y * 31 + x, max(0.5, rad * 0.06))
    if c == 1:
        d.polygon(pts, fill=(38, 34, 31, 240))
        shade = (12, 10, 9)
    else:
        d.polygon(pts, fill=(252, 248, 238, 245))
        shade = (150, 132, 106)
    hr = random.Random(3000 + y * 31 + x + 11)
    for _ in range(9 if c == 1 else 6):
        a = hr.random() * 2 * math.pi
        ln = rad * (0.45 + hr.random() * 0.5)
        d.line([(cx + math.cos(a) * rad * 0.1, cy + math.sin(a) * rad * 0.1),
                (cx + math.cos(a) * ln, cy + math.sin(a) * ln)],
               fill=(shade[0], shade[1], shade[2], int(255 * (0.16 + hr.random() * 0.12))),
               width=max(1, int(rad * 0.1)))
    dashed_polyline(d, pts, (40, 34, 30) if c == 1 else (122, 104, 82),
                    max(1.0, rad * 0.22), 3000 + y * 31 + x + 5, 2)
    d.ellipse([cx - rad * 0.34 - rad * 0.2, cy - rad * 0.38 - rad * 0.2,
               cx - rad * 0.34 + rad * 0.2, cy - rad * 0.38 + rad * 0.2],
              fill=(120, 114, 108, 120) if c == 1 else (255, 255, 255, 230))

lx, ly = PAD + 9 * GAP, PAD + 8 * GAP
ring = circle_pts(lx, ly, GAP * 0.55, 7777, GAP * 0.05)
dashed_polyline(d, ring, (201, 98, 47), 3.0, 8888, 2)

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
out.save(OUT / "gomoku-crayon2.png")
print("ok")
