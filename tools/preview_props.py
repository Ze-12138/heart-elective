#!/usr/bin/env python3
"""把道具 + 立面按 CSS 里的百分比位置合成，检查摆位。"""

from __future__ import annotations

import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOVE = ROOT / "game"
BG = LOVE / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000

PROPS = {
    "classroom": [
        ("backpack", 8, 8, 148),
        ("paper", 52, 6, 52),
        ("bottle", 16, 23, 74),
        ("pencilcase", 85, 25, 40),
    ],
    "radio": [
        ("notes", 22, 47, 78),
        ("mug", 36, 19, 92),
    ],
}

CHARS = {
    "classroom": [("boy-sit", 27.2, 26.5, 360), ("girl-sit", 76.2, 26.5, 360)],
    "radio": [("girl-sit", 50, 12, 560)],
}


def place(canvas: Image.Image, path: pathlib.Path, left: float, bottom: float, height: int) -> None:
    im = Image.open(path).convert("RGBA")
    im = im.resize((round(im.width * height / im.height), height), Image.LANCZOS)
    x = round(W * left / 100 - im.width / 2)
    y = round(H - H * bottom / 100 - im.height)
    canvas.alpha_composite(im, (x, y))


def main() -> None:
    for scene, props in PROPS.items():
        bg = Image.open(BG / f"{scene}.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
        canvas = bg.convert("RGBA")
        for name, left, bottom, h in CHARS[scene]:
            place(canvas, LOVE / "characters" / f"{name}.webp", left, bottom, h)
        for name, left, bottom, h in props:
            place(canvas, LOVE / "props" / f"{name}.webp", left, bottom, h)
        canvas.convert("RGB").save(OUT / f"props-{scene}.png", quality=92)
        print("->", OUT / f"props-{scene}.png")


if __name__ == "__main__":
    main()
