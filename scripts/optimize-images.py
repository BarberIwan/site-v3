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
FOTO = PUBLIC / "foto"

BG = (8, 8, 8)
GOLD = (201, 168, 74)

# bron in public/ -> (beschrijvende naam, breedtes in px). De naam komt in de
# URL van de foto terecht; Google Afbeeldingen leest die mee.
PHOTOS = {
    # Portret van Iwan in de salon; het origineel staat buiten public/.
    "design/fotos/iwan-portret.jpg": ("iwan-barber-almere", (480, 900)),
    "7BA86E7C-5624-4FB8-B92B-ED7F1729ACC7.jpg": ("mid-fade-krullen-baard", (480, 900)),
    "7367F35C-CC28-43C5-A6F7-E786E6FD6D31.jpg": ("contouren-cornrows", (480, 900)),
    "ECE8A51A-C1C4-4D31-9604-795D3E8BC503.jpg": ("klassieke-taper", (480, 900)),
    "C61F0EF9-D76E-4DD4-AA20-F9F5ADF5E800.jpg": ("buzzcut-fade", (480, 900)),
    "CF0D0669-07E7-485C-8260-C9BED93B82F8.jpg": ("korte-crop-fade", (480, 900)),
    "2D8D9132-0A24-4FA7-B8A7-3D3A91395F3F.jpg": ("lange-pony-low-taper", (480, 1024)),
    "9AA8A269-A960-4E8A-B7B7-22A7C1038927.jpg": ("kaal-geschoren-baard", (480, 900)),
    "ig-3.jpg": ("afro-top-taper-fade", (400, 900)),
    "ig-2.jpg": ("textured-top-fade", (400, 900)),
    "ig-4.jpg": ("lang-haar-fade-baard", (400, 900)),
    "ig-5.jpg": ("kort-opzij-volle-baard", (400, 900)),
    "ig-6.jpg": ("golvend-low-taper", (400, 1026)),
    "ig-1.jpg": ("recht-afgeknipt", (400, 900)),
    "carousel-1.jpg": ("kinderkapsel-fade", (488,)),
    "carousel-2.jpg": ("geschoren-figuur-krullen", (488,)),
    "carousel-3.jpg": ("afro-taper-fade", (488,)),
}


def save_webp(im: Image.Image, path: Path, quality: int = 78) -> None:
    im.save(path, "WEBP", quality=quality, method=6)


def photos() -> None:
    FOTO.mkdir(exist_ok=True)
    for name, (slug, widths) in PHOTOS.items():
        src = Image.open((ROOT if name.startswith("design/") else PUBLIC) / name).convert("RGB")
        # Origineel onder de beschrijvende naam, als fallback voor browsers zonder WebP.
        src.save(FOTO / f"{slug}.jpg", quality=84, optimize=True, progressive=True)
        for w in widths:
            w = min(w, src.width)
            h = round(src.height * w / src.width)
            save_webp(src.resize((w, h), Image.LANCZOS), OUT / f"{slug}-{w}.webp")


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
    # Links het portret van Iwan, rechts logo en tekst.
    left = 470
    portrait = Image.open(ROOT / "design/fotos/iwan-portret.jpg").convert("RGB")
    ratio = max(left / portrait.width, H / portrait.height)
    portrait = portrait.resize((round(portrait.width * ratio), round(portrait.height * ratio)), Image.LANCZOS)
    x = (portrait.width - left) // 2 + round(portrait.width * 0.12)
    canvas.paste(portrait.crop((x, 0, x + left, H)), (0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.line([(left, 0), (left, H)], fill=GOLD, width=2)
    panel_w = W - left
    ratio = (panel_w - 160) / mark.width
    m = mark.resize((round(mark.width * ratio), round(mark.height * ratio)), Image.LANCZOS)
    top = 120
    canvas.paste(m, (left + (panel_w - m.width) // 2, top), m)
    if fonts:
        serif = ImageFont.truetype(str(fonts / "cormorant-italic.ttf"), 40)
        sans = ImageFont.truetype(str(fonts / "montserrat-500.ttf"), 16)
        for text, font, y, fill in (
            ("Kapper & barber in Almere Stad", serif, top + m.height + 40, (240, 240, 240)),
            ("MICHELANGELOSTRAAT 195 · SINDS 1994", sans, top + m.height + 108, GOLD),
        ):
            tw = draw.textlength(text, font=font)
            draw.text((left + (panel_w - tw) / 2, y), text, font=font, fill=fill)
    canvas.save(PUBLIC / "og-barber-iwan.jpg", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    fonts = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    photos()
    mark = logo()
    icons(mark)
    og_image(mark, fonts)
    print("klaar")
