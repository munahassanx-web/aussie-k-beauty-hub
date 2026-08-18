#!/usr/bin/env python3
"""Generate THE GROCER STRIPE assets for Skin Grocer transactional emails.

A refined diagonal navy + warm cream stripe with a very thin muted champagne
keyline. Rendered at 2x for retina and written to public/email/.

  sg-grocer-stripe.png       signature edge (top of the email)
  sg-grocer-stripe-thin.png  quiet echo (above the footer)
"""

from PIL import Image, ImageDraw

NAVY = (13, 27, 42, 255)      # #0D1B2A
CREAM = (247, 244, 238, 255)  # #F7F4EE
GOLD = (200, 178, 138, 255)   # muted pale champagne

SS = 4  # supersample factor


def stripe(width: int, height: int, band: int, path: str) -> None:
    w, h = width * SS, height * SS
    img = Image.new("RGBA", (w, h), NAVY)
    d = ImageDraw.Draw(img)

    b = band * SS               # cream band width (perpendicular-ish)
    period = b * 4              # generous navy field between cream bands
    keyline = max(1, int(0.9 * SS))

    # 45-degree diagonals drawn as thick lines well beyond the canvas.
    x = -h - period
    while x < w + h + period:
        d.line([(x, h), (x + 2 * h, 0)], fill=CREAM, width=b)
        # very thin champagne keyline riding the leading edge of each cream band
        off = b // 2 + keyline
        d.line([(x + off, h), (x + off + 2 * h, 0)], fill=GOLD, width=keyline)
        x += period

    img = img.resize((width, height), Image.LANCZOS)
    img.save(path)
    print("wrote", path, img.size)


if __name__ == "__main__":
    stripe(1240, 26, 13, "public/email/sg-grocer-stripe.png")
    stripe(1240, 10, 6, "public/email/sg-grocer-stripe-thin.png")
