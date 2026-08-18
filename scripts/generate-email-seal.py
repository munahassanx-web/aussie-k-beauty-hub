import math, os
from PIL import Image, ImageDraw, ImageFont

NOTO = "/nix/store/dg3hd9mqha517djbgpgnq8r4q1j1wn30-noto-fonts-2025.11.01/share/fonts/noto"
SERIF = os.path.join(NOTO, "NotoSerif[wdth,wght].ttf")
SANS = os.path.join(NOTO, "NotoSans[wdth,wght].ttf")

ROSE = (207, 162, 139)
ROSE_DEEP = (183, 130, 103)
NAVY = (13, 27, 42)
CREAM = (247, 244, 238)

S = 8  # supersample


def font(path, size, wght=400, wdth=100):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([wdth, wght])
    except Exception:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f


def wobble_r(R, theta, amps):
    r = R
    for k, a, ph in amps:
        r += R * a * math.sin(k * theta + ph)
    return r


def draw_ring_text(img, cx, cy, radius, text, fnt, fill, start_deg=-90, spacing=1.0, flip=False):
    """Draw text along a circle, one glyph at a time."""
    d = ImageDraw.Draw(img)
    widths = []
    for ch in text:
        widths.append(d.textlength(ch, font=fnt) * spacing)
    total = sum(widths)
    arc = total / radius  # radians
    ang = math.radians(start_deg) - arc / 2
    for ch, w in zip(text, widths):
        step = w / radius
        a = ang + step / 2
        gx = cx + radius * math.cos(a)
        gy = cy + radius * math.sin(a)
        bbox = fnt.getbbox(ch)
        gw, gh = bbox[2] - bbox[0], bbox[3] - bbox[1]
        pad = 12
        tile = Image.new("RGBA", (gw + pad * 2, gh + pad * 2), (0, 0, 0, 0))
        ImageDraw.Draw(tile).text((pad - bbox[0], pad - bbox[1]), ch, font=fnt, fill=fill)
        rot = -math.degrees(a) - 90 if not flip else -math.degrees(a) + 90
        tile = tile.rotate(rot, resample=Image.BICUBIC, expand=True)
        img.alpha_composite(tile, (int(gx - tile.width / 2), int(gy - tile.height / 2)))
        ang += step


def seal(size, variant="seal", ring_text=None, center="SG", sub="SEOUL", amps=None):
    px = size * S
    img = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = cy = px / 2
    R = px * 0.455
    amps = amps or [(3, 0.016, 0.7), (5, 0.010, 2.1), (7, 0.006, 4.0)]

    # irregular hand-cut outline
    pts = []
    for i in range(721):
        t = i / 720 * 2 * math.pi
        r = wobble_r(R, t, amps)
        pts.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    d.line(pts + [pts[0]], fill=ROSE + (255,), width=int(px * 0.0135), joint="curve")

    # inner hairline ring
    ri = R * 0.665
    pts2 = []
    for i in range(721):
        t = i / 720 * 2 * math.pi
        r = wobble_r(ri, t, [(3, 0.012, 0.7), (5, 0.008, 2.1)])
        pts2.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    d.line(pts2 + [pts2[0]], fill=ROSE + (215,), width=int(px * 0.0055), joint="curve")

    # circular wording
    if ring_text:
        f = font(SANS, int(px * 0.052), wght=500)
        rt = R * 0.825
        draw_ring_text(img, cx, cy, rt, ring_text[0], f, ROSE_DEEP + (255,), start_deg=-90, spacing=1.34)
        if len(ring_text) > 1:
            draw_ring_text(img, cx, cy, rt - int(px * 0.062) * 0.95, ring_text[1][::-1], f, ROSE_DEEP + (255,), start_deg=90, spacing=1.34, flip=True)

    # centre monogram
    fm = font(SERIF, int(px * 0.30), wght=500)
    bb = d.textbbox((0, 0), center, font=fm)
    d.text((cx - (bb[2] + bb[0]) / 2, cy - (bb[3] + bb[1]) / 2 - px * 0.045), center, font=fm, fill=ROSE_DEEP + (255,))

    # hairline + subline
    d.line([(cx - px * 0.075, cy + px * 0.115), (cx + px * 0.075, cy + px * 0.115)], fill=ROSE_DEEP + (200,), width=int(px * 0.006))
    fs = font(SANS, int(px * 0.052), wght=700)
    tw = d.textlength(sub, font=fs)
    ls = px * 0.016
    x = cx - (tw + ls * (len(sub) - 1)) / 2
    for ch in sub:
        d.text((x, cy + px * 0.155), ch, font=fs, fill=ROSE_DEEP + (245,))
        x += d.textlength(ch, font=fs) + ls

    return img.resize((size, size), Image.LANCZOS)


def on_bg(im, bg):
    out = Image.new("RGB", im.size, bg)
    out.paste(im, (0, 0), im)
    return out


OUT = "/dev-server/public/email"
os.makedirs(OUT, exist_ok=True)
AMPS = [(3, 0.016, 0.7), (5, 0.010, 2.1), (7, 0.006, 4.0)]
main = seal(288, ring_text=("SEOUL SOURCED", "SKIN ASSURED"), center="SG", sub="SEOUL", amps=AMPS)
disp = seal(288, ring_text=("DISPATCHED", "MELBOURNE"), center="SG", sub="AUS", amps=AMPS)
on_bg(main, NAVY).save(f"{OUT}/sg-seal-navy.png")
on_bg(main, (255, 255, 255)).save(f"{OUT}/sg-seal-paper.png")
on_bg(main, CREAM).save(f"{OUT}/sg-seal-cream.png")
on_bg(disp, (255, 255, 255)).save(f"{OUT}/sg-stamp-dispatched.png")
print("seal assets written to", OUT)
