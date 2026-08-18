#!/usr/bin/env python3
"""THE GROCER STRIPE — Option 1 frame assets for Skin Grocer order emails.

Option 1 wraps the ENTIRE email in a continuous navy-and-white diagonal
signature frame: a horizontal band across the top and bottom, and a vertical
tile repeated down the left and right rails. Pure white — no cream in email.

  sg-frame-h.png   620x22  horizontal band (top and bottom)
  sg-frame-v.png    22x220 vertical tile, seamlessly repeatable down the rails
  sg-frame-h-m.png  390x16 mobile crop of the horizontal band

Geometry is 45 degrees with a 44px period, so the vertical tile height (220px)
is an exact multiple of the period and repeat-y is seamless.
"""

from PIL import Image, ImageDraw

NAVY = (13, 27, 42)     # #0D1B2A
WHITE = (255, 255, 255)

SS = 4          # supersample factor
PERIOD = 44     # px along x for one navy+white pair
NAVY_RUN = 22   # px of navy within each period


def draw(width: int, height: int, path: str, period: int = PERIOD, navy_run: int = NAVY_RUN) -> None:
    w, h = width * SS, height * SS
    img = Image.new("RGB", (w, h), WHITE)
    d = ImageDraw.Draw(img)

    p = period * SS
    run = navy_run * SS
    # 45 degrees: a band edge is the line x + y = c, so the top edge of a band
    # sits `h` px further left than its bottom edge.
    x = -h - p
    while x < w + h + p:
        d.polygon([(x, h), (x + run, h), (x + run + h, 0), (x + h, 0)], fill=NAVY)
        x += p

    img.resize((width, height), Image.LANCZOS).save(path, optimize=True)
    print("wrote", path, width, "x", height)


if __name__ == "__main__":
    draw(620, 22, "public/email/sg-frame-h.png")
    draw(390, 16, "public/email/sg-frame-h-m.png", period=32, navy_run=16)
    draw(22, 220, "public/email/sg-frame-v.png")
