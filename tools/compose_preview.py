#!/usr/bin/env python3
"""离线合成预览图：把背景和立绘按游戏里的位置拼起来，用于检查画面效果。"""

from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOVE = ROOT / "game"
BG = LOVE / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
FONT = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 22)
FONT_S = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)

W, H = 1600, 1000


def cover(img: Image.Image, w: int, h: int, pos: tuple[float, float] = (0.5, 0.5)) -> Image.Image:
    scale = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = round((img.width - w) * pos[0])
    top = round((img.height - h) * pos[1])
    return img.crop((left, top, left + w, top + h))


def scaled(path: pathlib.Path, height: int) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    return im.resize((round(im.width * height / im.height), height), Image.LANCZOS)


def compose(bg_name: str, girl_mood: str, out: pathlib.Path, dark: bool = False) -> None:
    bg = cover(Image.open(BG / f"{bg_name}.jpg").convert("RGB"), W, H, (0.5, 0.44))
    canvas = bg.convert("RGBA")

    girl = scaled(LOVE / "characters" / f"girl-{girl_mood}.webp", 430)
    boy = scaled(LOVE / "characters" / "boy-smile.webp", 400)
    canvas.alpha_composite(boy, (round(W * 0.15), round(H * 0.86) - boy.height))
    canvas.alpha_composite(girl, (round(W * 0.85) - girl.width, round(H * 0.92) - girl.height))

    draw = ImageDraw.Draw(canvas, "RGBA")
    # 对白卡片
    card = (120, 760, W - 120, 940)
    draw.rounded_rectangle(card, 18, fill=(255, 250, 240, 242), outline=(120, 104, 88, 60), width=2)
    draw.text((156, 786), "奶龙酱", font=FONT_S, fill=(196, 122, 118))
    draw.text((156, 820), "你也喜欢靠窗的位置吗？", font=FONT, fill=(72, 62, 54))
    draw.text((W - 250, 896), "点击继续  ›", font=FONT_S, fill=(150, 138, 124))
    # 顶栏
    draw.rounded_rectangle((40, 32, 360, 84), 14, fill=(255, 250, 240, 220))
    draw.text((62, 46), "第一章 · 第三排靠窗", font=FONT_S, fill=(96, 84, 72))
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out, quality=92)


def contact_sheet(out: pathlib.Path) -> None:
    moods = ["normal", "smile", "shy", "sad", "surprised"]
    cell_w, cell_h = 300, 460
    sheet = Image.new("RGB", (cell_w * len(moods), cell_h * 2 + 40), (250, 246, 238))
    draw = ImageDraw.Draw(sheet)
    for row, who in enumerate(("boy", "girl")):
        for col, mood in enumerate(moods):
            im = scaled(LOVE / "characters" / f"{who}-{mood}.webp", cell_h - 30)
            x = col * cell_w + (cell_w - im.width) // 2
            y = row * cell_h + 10
            sheet.paste(im, (x, y), im)
            draw.text((col * cell_w + 12, row * cell_h + cell_h - 26), f"{who} · {mood}", font=FONT_S, fill=(110, 96, 84))
    sheet.save(out)
    print("contact sheet ->", out)


def bg_sheet(out: pathlib.Path) -> None:
    names = ["campus", "classroom", "dorm", "restaurant", "walk", "cinema",
             "street", "library", "rain", "track", "ferris", "aquarium",
             "dorm-day-girl", "dorm-night-boy", "dorm-night-girl",
             "dorm-storm-girl", "dorm-radio-night"]
    cols, cw, ch = 4, 380, 250
    rows = (len(names) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, rows * ch), (245, 240, 232))
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(names):
        p = BG / f"{name}.jpg"
        if not p.exists():
            continue
        im = cover(Image.open(p).convert("RGB"), cw, ch, (0.5, 0.44))
        x, y = (i % cols) * cw, (i // cols) * ch
        sheet.paste(im, (x, y))
        draw.rectangle((x, y + ch - 20, x + 130, y + ch), fill=(255, 255, 255))
        draw.text((x + 6, y + ch - 19), name, font=FONT_S, fill=(90, 80, 70))
    sheet.save(out)
    print("bg sheet ->", out)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    contact_sheet(OUT / "characters.png")
    if not BG.exists():
        print("场景图是矢量 SVG，跳过位图合成（只输出立绘总览）")
        raise SystemExit(0)
    bg_sheet(OUT / "backgrounds.png")
    for bg_name, mood in [("classroom", "smile"), ("campus", "normal"), ("dorm-night-girl", "shy")]:
        p = BG / f"{bg_name}.jpg"
        if p.exists():
            compose(bg_name, mood, OUT / f"scene-{bg_name}.png")
            print("scene ->", OUT / f"scene-{bg_name}.png")
