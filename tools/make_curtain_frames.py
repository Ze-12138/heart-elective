#!/usr/bin/env python3
"""生成窗帘帧，并用「夜空位置 + 覆盖率」自动验收，只保留合格帧。"""

from __future__ import annotations

import pathlib
import sys
import time

import numpy as np
from PIL import Image

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from seedream_image import HERE, download, generate, read_key  # noqa: E402

ROOT = HERE
BG = ROOT / "game" / "backgrounds-painted"
RAW = ROOT / "tmp" / "art" / "raw21"
RAW.mkdir(parents=True, exist_ok=True)

MODEL = "doubao-seedream-5-0-flash-260915"
WIN = {
    "girl": (0.655, 0.005, 0.345, 0.50),
    "boy": (0.665, 0.005, 0.335, 0.575),
}
REFS = {
    "girl": BG / "sleep-girl-curtained.jpg",
    "boy": BG / "sleep-boy.jpg",
}
SCENE = {
    "girl": "浅金色长卷发的少女躺床上刷手机，床边台灯和兔子玩偶，墙上有灯串，右侧窗外是夜空和月亮",
    "boy": "深棕短发的少年躺床上看手机，床边台灯、吉他、书本，右侧窗外是城市夜景",
}


def metrics(path: pathlib.Path, who: str) -> tuple[float, float]:
    im = Image.open(path).convert("RGB")
    W, H = im.size
    l, t, w, h = WIN[who]
    a = np.asarray(im.crop((int(W * l), int(H * t), int(W * (l + w)), int(H * (t + h)))), dtype=np.int16)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    sky = (b > r + 18) & (b > g + 6) & (b > 40) & (b < 190)
    frac = float(sky.mean())
    if sky.sum() < 50:
        return frac, 0.5
    ys, xs = np.nonzero(sky)
    return frac, float(xs.mean() / sky.shape[1])


def prompt(who: str, pct: int) -> str:
    return (
        "以参考图为基础画一张插画，画风、房间、人物、光线、配色必须与参考图完全一致（低饱和手绘、细墨线）。"
        "只改变窗帘：窗户右上方有一根窗帘杆，一条浅灰白色的窗帘挂在杆上，"
        "窗帘**始终位于窗户的右侧，从右向左展开**，绝不能出现在窗户左侧。"
        f"本次让窗帘遮住整扇窗户宽度的 {pct}%，因此窗格左侧的 {100 - pct}% 必须露出窗外的景色。"
        "窗帘要有自然的竖向褶皱，下摆垂在窗台下方，边缘柔和。"
        f"画面内容：{SCENE[who]}。人物姿势表情不变，不要文字、对话框。"
    )


def gen(who: str, pct: int, tag: str) -> pathlib.Path | None:
    out = RAW / f"{who}-{tag}.jpg"
    for attempt in range(3):
        try:
            url = generate(prompt(who, pct), MODEL, "1536x1024", KEY, [str(REFS[who])])
            download(url, out)
            return out
        except Exception as exc:  # noqa: BLE001
            print("   retry", attempt + 1, exc)
            time.sleep(3)
    return None


def collect(who: str, need: int = 10) -> list[tuple[float, pathlib.Path]]:
    good: list[tuple[float, pathlib.Path]] = []
    pcts = [8, 18, 28, 38, 48, 58, 68, 78, 88, 100]
    rounds = 0
    while len(good) < need and rounds < 4:
        rounds += 1
        for pct in pcts:
            if len(good) >= need:
                break
            tag = f"{pct}r{rounds}"
            path = gen(who, pct, tag)
            if not path:
                continue
            frac, cx = metrics(path, who)
            # 合格：夜空在左半边（帘子从右来），且不是全开/全关的极端值
            ok = (cx < 0.52) and (0.01 < frac < 0.75)
            print(f"  {who} {pct}% r{rounds}: 夜空{frac:.2f} 重心{cx:.2f} {'OK' if ok else 'reject'}")
            if ok:
                good.append((frac, path))
    return good


def pick(good: list[tuple[float, pathlib.Path]], n: int = 10) -> list[pathlib.Path]:
    good.sort(key=lambda x: x[0], reverse=True)  # 夜空多 → 帘子少
    if len(good) <= n:
        return [p for _, p in good]
    idx = np.linspace(0, len(good) - 1, n).round().astype(int)
    return [good[i][1] for i in idx]


KEY = read_key()
for who in ("girl", "boy"):
    print("==", who)
    good = collect(who)
    chosen = pick(good)
    print(f"  {who}: 合格 {len(good)} 帧，选出 {len(chosen)} 帧")
    for i, path in enumerate(chosen):
        im = Image.open(path).convert("RGB")
        W, H = 1600, 1000
        s = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        left = (im.width - W) // 2
        top = (im.height - H) // 2
        im.crop((left, top, left + W, top + H)).save(
            BG / f"{who}-f{i}.webp", "WEBP", quality=84, method=6)
        frac, cx = metrics(BG / f"{who}-f{i}.webp", who)
        print(f"    f{i} <- {path.name}  夜空{frac:.2f} 重心{cx:.2f}")
print("done")
