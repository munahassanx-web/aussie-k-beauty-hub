#!/usr/bin/env python3
"""THE GROCER STRIPE — V5 signature assets for Skin Grocer order emails.

V5 treats the stripe as a PRIMARY brand asset, not trim. Bands are broad and
few, navy dominates, warm cream carves strong negative space, and a genuinely
visible champagne-gold companion band rides every cream band (~10-12% of the
treatment) so the gold reads at true inbox size without zooming.

Rendered at 2x (retina) and written to public/email/.

  sg-stripe-band.png     620x64  signature ribbon above the masthead
  sg-stripe-column.png   168x360 vertical editorial crop beside the hero
  sg-stripe-mobile.png   390x56  mobile crop of the hero stripe moment
  sg-stripe-foot.png     620x44  bold repeat before the footer
"""

from PIL import Image, ImageDraw

NAVY = (13, 27, 42, 255)      # #0D1B2A
CREAM = (247, 244, 238, 255)  # #F7F4EE
GOLD = (198, 161, 91, 255)    # #C6A15B — richer muted champagne, clearly visible

SS = 4  # supersample factor

# One rhythm unit, in CSS px measured along the horizontal axis.
# navy field -> cream band -> gold companion band.
NAVY_RUN = 78
CREAM_RUN = 34
GOLD_RUN = 22
PERIOD = NAVY_RUN + CREAM_RUN + GOLD_RUN  # 134px -> gold is ~16.4% of the field


def stripe(width: int, height: int, path: str, scale: float = 1.0, phase: float = 0.0) -> None:
    """Draw the broad 60-degree navy/cream/gold band system."""
    w, h = int(width * SS), int(height * SS)
    img = Image.new("RGB", (w, h), NAVY[:3])
    d = ImageDraw.Draw(img)

    period = PERIOD * SS * scale
    cream_w = CREAM_RUN * SS * scale
    gold_w = GOLD_RUN * SS * scale
    slant = h * 0.58  # ~60deg lean; bands read as editorial, never barber-pole

    x = -slant - period + (phase * period)
    while x < w + slant + period:
        # cream band as a filled parallelogram
        d.polygon(
            [(x, h), (x + cream_w, h), (x + cream_w + slant, 0), (x + slant, 0)],
            fill=CREAM[:3],
        )
        g = x + cream_w
        d.polygon(
            [(g, h), (g + gold_w, h), (g + gold_w + slant, 0), (g + slant, 0)],
            fill=GOLD[:3],
        )
        x += period

    img = img.resize((width, height), Image.LANCZOS)
    img.save(path, optimize=True)
    print("wrote", path, img.size)


if __name__ == "__main__":
    stripe(620, 64, "public/email/sg-stripe-band.png")
    stripe(620, 44, "public/email/sg-stripe-foot.png", phase=0.42)
    stripe(390, 56, "public/email/sg-stripe-mobile.png", scale=0.78)
    # vertical crop: generate rotated so bands run across the narrow column
    stripe(360, 168, "/tmp/sg-col-raw.png", scale=1.0, phase=0.2)
    Image.open("/tmp/sg-col-raw.png").rotate(90, expand=True).save(
        "public/email/sg-stripe-column.png", optimize=True
    )
    print("wrote public/email/sg-stripe-column.png (168x360)")
