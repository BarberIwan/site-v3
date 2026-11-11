#!/usr/bin/env python3
"""Bewerkt één kapselfoto voor Instagram, Facebook en het Google-bedrijfsprofiel.

    python3 scripts/social-foto.py IN.jpg UIT.jpg --crop X Y BREEDTE [--gamma 0.93]
        [--sat 1.06] [--vlek X Y STRAAL ...]

- uitsnede 4:5 (hoogte = breedte x 1,25) vanaf (X, Y) in originele pixels, naar 1080x1350;
- witbalans en niveaus half toegepast, zachte S-curve, iets meer diepte en scherpte;
- licht vignet, zodat het kapsel opvalt;
- --vlek: kloont huid van 45 px links over een klein rood puntje (krasje), met zachte rand;
- schrijft JPEG zonder EXIF, dus zonder locatie.

Nodig: Pillow, numpy (opencv is niet nodig).
"""
import argparse

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


def kloon_vlek(arr, x, y, rad, dx=-45, dy=0):
    r = rad + 6
    yy, xx = np.ogrid[-r : r + 1, -r : r + 1]
    alpha = np.clip(1 - (np.sqrt(xx**2 + yy**2) - (r - 6)) / 6, 0, 1)[..., None]
    bron = arr[y + dy - r : y + dy + r + 1, x + dx - r : x + dx + r + 1].astype(np.float32)
    doel = arr[y - r : y + r + 1, x - r : x + r + 1].astype(np.float32)
    rand = alpha[..., 0] < 0.5
    bron = bron + (doel[rand].mean(0) - bron[rand].mean(0))
    arr[y - r : y + r + 1, x - r : x + r + 1] = np.clip(alpha * bron + (1 - alpha) * doel, 0, 255)
    return arr


def kleur(arr, gamma):
    f = arr.astype(np.float32) / 255
    gem = f.reshape(-1, 3).mean(0)
    f = f * (1 + 0.35 * (gem.mean() / gem - 1))
    lo, hi = np.percentile(f, 0.4), np.percentile(f, 99.6)
    f = 0.5 * f + 0.5 * (f - lo) / (hi - lo)
    f = np.clip(f, 0, 1) ** gamma
    f = f + 0.10 * (f - 0.5) * (1 - np.abs(2 * f - 1))
    return np.clip(f * 255, 0, 255).astype(np.uint8)


def vignet(im, sterkte=0.16):
    w, h = im.size
    y, x = np.ogrid[:h, :w]
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h * 0.42) / (h / 2)) ** 2)
    m = 1 - sterkte * np.clip(d - 0.55, 0, None) ** 1.6
    return Image.fromarray(np.clip(np.asarray(im).astype(np.float32) * m[..., None], 0, 255).astype(np.uint8))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("invoer")
    p.add_argument("uitvoer")
    p.add_argument("--crop", nargs=3, type=int, metavar=("X", "Y", "BREEDTE"), required=True)
    p.add_argument("--gamma", type=float, default=1.0)
    p.add_argument("--sat", type=float, default=1.06)
    p.add_argument("--vlek", nargs=3, type=int, action="append", default=[], metavar=("X", "Y", "STRAAL"))
    a = p.parse_args()

    im = ImageOps.exif_transpose(Image.open(a.invoer)).convert("RGB")
    arr = np.asarray(im).copy()
    for x, y, rad in a.vlek:
        arr = kloon_vlek(arr, x, y, rad)
    x, y, w = a.crop
    h = int(w * 1.25)
    H, W = arr.shape[:2]
    if w > W or h > H:
        raise SystemExit(f"uitsnede {w}x{h} past niet in {W}x{H}")
    x, y = min(x, W - w), min(y, H - h)
    im = Image.fromarray(kleur(arr[y : y + h, x : x + w], a.gamma))
    im = im.filter(ImageFilter.UnsharpMask(radius=40, percent=18, threshold=0))
    im = ImageEnhance.Color(im).enhance(a.sat)
    im = im.resize((1080, 1350), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=2))
    vignet(im).save(a.uitvoer, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"{a.uitvoer}: uitsnede {w}x{h} vanaf ({x},{y}) -> 1080x1350, zonder EXIF")


if __name__ == "__main__":
    main()
