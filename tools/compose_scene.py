#!/usr/bin/env python3
"""把新场景背景裁成 1600x1000，并试排一系列坐姿立绘位置，输出预览图。"""

from __future__ import annotations

import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "tmp" / "art" / "raw5"
CHAR = ROOT / "game" / "characters"
DST = ROOT / "game" / "backgrounds-painted"
OUT = ROOT / "tmp" / "art" / "shots"
W, H = 1600, 1000


def cover(img: Image.Image, w: int, h: int) -> Image.Image:
    scale = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (img.width - w) // 2
    top = (img.height - h) // 2
    return img.crop((left, top, left + w, top + h))


def scaled(path: pathlib.Path, height: int) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    return im.resize((round(im.width * height / im.height), height), Image.LANCZOS)


def main() -> None:
    DST.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ("classroom", "radio"):
        bg = cover(Image.open(RAW / f"{name}.jpg").convert("RGB"), W, H)
        bg.save(DST / f"{name}.jpg", "JPEG", quality=88, optimize=True, progressive=True)

        canvas = bg.convert("RGBA")
        if name == "classroom":
            boy = scaled(CHAR / "boy-sit.webp", 360)
            girl = scaled(CHAR / "girl-sit.webp", 360)
            canvas.alpha_composite(boy, (435 - boy.width // 2, 735 - boy.height))
            canvas.alpha_composite(girl, (1219 - girl.width // 2, 735 - girl.height))
        else:
            girl = scaled(CHAR / "girl-sit.webp", 560)
            canvas.alpha_composite(girl, (800 - girl.width // 2, 880 - girl.height))
        canvas.convert("RGB").save(OUT / f"scene-{name}.png", quality=92)
        print("bg + preview ->", name)


if __name__ == "__main__":
    main()
