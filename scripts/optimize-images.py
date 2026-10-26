"""Maakt de webversies van logo, foto's, icons en de deelafbeelding.

Eenmalig draaien na het vervangen van een bronafbeelding in public/:
    python3 scripts/optimize-images.py [map-met-ttf-fonts]

Uitvoer staat in public/img/ en public/ (icons). De bronbestanden blijven staan
als fallback voor browsers zonder WebP.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = PUBLIC / "img"
OUT.mkdir(exist_ok=True)

BG = (8, 8, 8)
GOLD = (201, 168, 74)

# bron -> breedtes in px (nooit groter dan het origineel)
PHOTOS = {
    "7BA86E7C-5624-4FB8-B92B-ED7F1729ACC7.jpg": (480, 900),
    "ECE8A51A-C1C4-4D31-9604-795D3E8BC503.jpg": (480, 900),
    "C61F0EF9-D76E-4DD4-AA20-F9F5ADF5E800.jpg": (480, 900),
    "7367F35C-CC28-43C5-A6F7-E786E6FD6D31.jpg": (480, 900),
    "9AA8A269-A960-4E8A-B7B7-22A7C1038927.jpg": (480, 900),
    "CF0D0669-07E7-485C-8260-C9BED93B82F8.jpg": (480, 900),
    "2D8D9132-0A24-4FA7-B8A7-3D3A91395F3F.jpg": (480, 1024),
    "ig-1.jpg": (400, 900),
    "ig-2.jpg": (400, 900),
    "ig-3.jpg": (400, 900),
    "ig-4.jpg": (400, 900),
    "ig-5.jpg": (400, 900),
    "ig-6.jpg": (400, 1026),
    "carousel-1.jpg": (488,),
    "carousel-2.jpg": (488,),
    "carousel-3.jpg": (488,),
    "hero-barber.jpg": (600, 864),
    "tools-flatlay.jpg": (720, 1344),
}


def save_webp(im: Image.Image, path: Path, quality: int = 78) -> None:
    im.save(path, "WEBP", quality=quality, method=6)


def photos() -> None:
    for name, widths in PHOTOS.items():
        src = Image.open(PUBLIC / name).convert("RGB")
        stem = Path(name).stem
        for w in widths:
            w = min(w, src.width)
            h = round(src.height * w / src.width)
            save_webp(src.resize((w, h), Image.LANCZOS), OUT / f"{stem}-{w}.webp")


def logo() -> Image.Image:
    src = Image.open(PUBLIC / "logo.png").convert("RGBA")
    # Zelfde compositie als het origineel (3:2 met marge), alleen kleiner.
    for w in (336, 672):
        h = round(src.height * w / src.width)
        im = src.resize((w, h), Image.LANCZOS)
        save_webp(im, OUT / f"logo-{w}.webp", quality=85)
    fallback = src.resize((672, 448), Image.LANCZOS)
    fallback.save(OUT / "logo-672.png", optimize=True)
    # Strak bijgesneden woordmerk voor icons en de deelafbeelding.
    return src.crop((276, 199, 1206, 758))


def icon(mark: Image.Image, size: int, pad: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), BG + (255,))
    inner = round(size * (1 - 2 * pad))
    ratio = min(inner / mark.width, inner / mark.height)
    m = mark.resize((round(mark.width * ratio), round(mark.height * ratio)), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return canvas


def icons(mark: Image.Image) -> None:
    # Onder 64px is "BARBER" onleesbaar; dan alleen de handtekening "Iwan".
    script = mark.crop((round(mark.width * 0.14), round(mark.height * 0.30), round(mark.width * 0.86), round(mark.height * 0.92)))
    small = [icon(script, s, 0.06).convert("RGB") for s in (16, 32, 48)]
    small[2].save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    icon(mark, 180, 0.10).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    icon(mark, 192, 0.10).save(PUBLIC / "icon-192.png", optimize=True)
    icon(mark, 512, 0.10).save(PUBLIC / "icon-512.png", optimize=True)
    # maskable: veilige zone is de binnenste 80%
    icon(mark, 512, 0.20).save(PUBLIC / "icon-maskable-512.png", optimize=True)


def cover(path: str, w: int, h: int) -> Image.Image:
    im = Image.open(PUBLIC / path).convert("RGB")
    ratio = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.LANCZOS)
    left = (im.width - w) // 2
    top = max(0, (im.height - h) // 3)
    return im.crop((left, top, left + w, top + h))


def og_image(mark: Image.Image, fonts: Path | None) -> None:
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), BG)
    strip = 220
    for i, name in enumerate(
        (
            "7BA86E7C-5624-4FB8-B92B-ED7F1729ACC7.jpg",
            "7367F35C-CC28-43C5-A6F7-E786E6FD6D31.jpg",
            "ig-3.jpg",
        )
    ):
        tile = ImageEnhance.Brightness(cover(name, strip, H)).enhance(0.85)
        canvas.paste(tile, (i * strip, 0))
    draw = ImageDraw.Draw(canvas)
    x0 = 3 * strip
    draw.line([(x0, 0), (x0, H)], fill=GOLD, width=2)
    panel_w = W - x0
    ratio = (panel_w - 120) / mark.width
    m = mark.resize((round(mark.width * ratio), round(mark.height * ratio)), Image.LANCZOS)
    canvas.paste(m, (x0 + (panel_w - m.width) // 2, 120), m)
    if fonts:
        serif = ImageFont.truetype(str(fonts / "cormorant-italic.ttf"), 38)
        sans = ImageFont.truetype(str(fonts / "montserrat-500.ttf"), 16)
        for text, font, y, fill in (
            ("Herenkapper & barber in Almere", serif, 120 + m.height + 40, (240, 240, 240)),
            ("MICHELANGELOSTRAAT 195 · TUSSEN DE VAARTEN", sans, 120 + m.height + 110, GOLD),
        ):
            tw = draw.textlength(text, font=font)
            draw.text((x0 + (panel_w - tw) / 2, y), text, font=font, fill=fill)
    canvas.save(PUBLIC / "og-barber-iwan.jpg", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    fonts = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    photos()
    mark = logo()
    icons(mark)
    og_image(mark, fonts)
    print("klaar")
