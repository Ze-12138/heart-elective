#!/usr/bin/env python3
"""按游戏里的真实显示尺寸（470px 高）比较不同像素强度。"""

from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHAR = ROOT / "game" / "characters"
OUT = ROOT / "tmp" / "art" / "shots"
FONT = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 18)
DISPLAY_H = 470


def at_scale(src: Image.Image, blocks: float) -> Image.Image:
    """模拟 CSS 用 image-rendering:pixelated 放大的效果。"""
    h = max(1, round(DISPLAY_H / blocks))
    small = src.resize((max(1, round(src.width * h / src.height)), h), Image.BOX)
    return small.resize((round(src.width * DISPLAY_H / src.height), DISPLAY_H), Image.NEAREST)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(CHAR / "girl-smile.webp").convert("RGBA")
    variants = [("原图（清晰）", 0), ("2x 像素", 2), ("3x 像素", 3), ("4x 像素", 4)]
    sheets = []
    for label, blocks in variants:
        im = src.resize((round(src.width * DISPLAY_H / src.height), DISPLAY_H), Image.LANCZOS) if blocks == 0 else at_scale(src, blocks)
        sheets.append((label, im))

    pad, label_h = 18, 34
    width = sum(im.width + pad for _, im in sheets) + pad
    sheet = Image.new("RGB", (width, DISPLAY_H + label_h + pad * 2), (247, 243, 235))
    draw = ImageDraw.Draw(sheet)
    x = pad
    for label, im in sheets:
        sheet.paste(im, (x, pad), im)
        draw.text((x, pad + DISPLAY_H + 8), label, font=FONT, fill=(70, 60, 50))
        x += im.width + pad
    sheet.save(OUT / "pixel-display-scale.png")
    print("->", OUT / "pixel-display-scale.png")


if __name__ == "__main__":
    main()
