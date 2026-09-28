"""Builds optimised web media from the raw files in /assests.

- Photos      -> public/media/photos/<slug>-{800,1600}.webp
- Logo        -> public/media/brand/logo-{dark,light}.png + favicon
- Products    -> public/media/products/<slug>.webp (cropped from the brochure, gsw.pdf)
- Certificates-> public/media/certs/<slug>-p<n>-{thumb,full}.webp

Personal data is never published: FSSAI page with Aadhaar details and the
APEDA application pages with bank / residential details are skipped, and the
bank account line on the SBI AD-code letter is redacted.
"""
import os
import fitz
import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assests")
CERTS = os.path.join(SRC, "certificates")
OUT = os.path.join(ROOT, "public", "media")

PHOTOS = {
    "girl-portrait": "WhatsApp Image 2026-09-27 at 5.24.24 PM (1).jpeg",
    "boatman-a": "WhatsApp Image 2026-09-27 at 5.24.25 PM (1).jpeg",
    "boatman-b": "WhatsApp Image 2026-09-27 at 5.24.25 PM (2).jpeg",
    "girl-green": "WhatsApp Image 2026-09-27 at 5.24.25 PM.jpeg",
    "spice-bowl": "WhatsApp Image 2026-09-27 at 5.26.28 PM.jpeg",
    "farmer-field": "WhatsApp Image 2026-09-27 at 5.26.29 PM (1).jpeg",
    "farmer-inspect": "WhatsApp Image 2026-09-27 at 5.26.29 PM (2).jpeg",
    "hands-bowl": "WhatsApp Image 2026-09-27 at 5.26.29 PM.jpeg",
    "elder-hills": "WhatsApp Image 2026-09-27 at 5.26.30 PM (1).jpeg",
    "turmeric-a": "WhatsApp Image 2026-09-27 at 5.26.30 PM (2).jpeg",
    "nutmeg-mace": "WhatsApp Image 2026-09-27 at 5.26.30 PM.jpeg",
    "truck-loading": "WhatsApp Image 2026-09-27 at 5.26.31 PM (1).jpeg",
    "grain-check-a": "WhatsApp Image 2026-09-27 at 5.26.31 PM (2).jpeg",
    "turmeric-b": "WhatsApp Image 2026-09-27 at 5.26.31 PM.jpeg",
    "grain-check-b": "WhatsApp Image 2026-09-27 at 5.26.32 PM (1).jpeg",
    "grain-check-c": "WhatsApp Image 2026-09-27 at 5.26.32 PM.jpeg",
    "sack-weigh-a": "WhatsApp Image 2026-09-27 at 5.26.33 PM (1).jpeg",
    "sack-weigh-b": "WhatsApp Image 2026-09-27 at 5.26.33 PM.jpeg",
}
LOGO = "WhatsApp Image 2026-09-27 at 5.24.24 PM.jpeg"


def ensure(*p):
    d = os.path.join(OUT, *p)
    os.makedirs(d, exist_ok=True)
    return d


def photos():
    d = ensure("photos")
    for slug, f in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, f))).convert("RGB")
        for w in (800, 1600):
            c = im.copy()
            if c.width > w:
                c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
            c.save(os.path.join(d, f"{slug}-{w}.webp"), "WEBP", quality=78 if w > 800 else 72, method=6)
        # tiny blurred placeholder colour
    print("photos ok")


def logo():
    d = ensure("brand")
    im = Image.open(os.path.join(SRC, LOGO)).convert("RGB")
    a = np.array(im).astype(int)
    bg = np.array([247, 247, 247])
    diff = np.abs(a - bg).sum(2)
    alpha = np.clip((diff - 12) * 4, 0, 255).astype(np.uint8)
    ys, xs = np.where(alpha > 40)
    box = (xs.min() - 8, ys.min() - 8, xs.max() + 8, ys.max() + 8)

    # un-premultiply against the light background so edges stay clean
    rgba = np.dstack([a, alpha]).astype(np.uint8)
    dark = Image.fromarray(rgba).crop(box)

    # light variant: neutral (black / grey) pixels -> warm white, greens & gold untouched
    arr = np.array(dark).astype(int)
    rgb = arr[..., :3]
    sat = rgb.max(2) - rgb.min(2)
    neutral = sat < 28
    light = arr.copy()
    light[neutral, 0] = 245
    light[neutral, 1] = 240
    light[neutral, 2] = 230
    dark.save(os.path.join(d, "logo-dark.png"), optimize=True)
    Image.fromarray(light.astype(np.uint8)).save(os.path.join(d, "logo-light.png"), optimize=True)

    # mark only (the "G" leaf), above the wordmark
    h = dark.height
    col = np.array(dark)[..., 3]
    rows = np.where(col.max(1) > 40)[0]
    # find first large vertical gap = split between mark and wordmark
    gaps = np.where(np.diff(rows) > 6)[0]
    split = rows[gaps[0]] + 3 if len(gaps) else int(h * 0.55)
    mark = dark.crop((0, 0, dark.width, split))
    top = np.array(mark)[: int(split * 0.6), :, 3]
    cols = np.where(top.max(0) > 40)[0]
    mb = (cols.min(), 0, cols.max() + 1, split)
    mark = mark.crop(mb)
    mb = mark.getbbox()
    mark = mark.crop(mb)
    side = max(mark.size) + 24
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
    sq.save(os.path.join(d, "mark.png"), optimize=True)
    sq.resize((64, 64), Image.LANCZOS).save(os.path.join(ROOT, "public", "favicon.png"))
    sq.resize((180, 180), Image.LANCZOS).save(os.path.join(ROOT, "public", "apple-touch-icon.png"))
    # OG image
    og = Image.new("RGB", (1200, 630), (243, 239, 230))
    lg = dark.copy()
    lg.thumbnail((760, 400), Image.LANCZOS)
    og.paste(lg, ((1200 - lg.width) // 2, (630 - lg.height) // 2), lg)
    og.save(os.path.join(ROOT, "public", "og-image.jpg"), quality=86)
    print("logo ok", box, "split", split)


def render(pdf, page, dpi):
    doc = fitz.open(os.path.join(CERTS, pdf))
    pix = doc[page].get_pixmap(dpi=dpi)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


# crop boxes measured on a 130 dpi render of gsw.pdf
PRODUCTS_P3 = [
    ("black-pepper", 270, 160, 455), ("cardamom", 565, 160, 455), ("chukku", 865, 160, 455),
    ("white-pepper", 270, 495, 775), ("garam-masala-whole", 565, 508, 775), ("cinnamon-sticks", 870, 495, 748),
    ("anise-stars", 270, 805, 1075), ("clove", 565, 805, 1075), ("cashew-nuts", 865, 822, 1075),
    ("nutmace", 270, 1105, 1385), ("coffee-powder", 565, 1105, 1385), ("tea-powder", 865, 1105, 1385),
]
PRODUCTS_P4 = [
    ("chilli-powder", 305, 180, 535, 270), ("coriander-powder", 590, 180, 535, 270), ("turmeric-powder", 865, 180, 535, 270),
    ("garam-masala", 385, 620, 975, 270), ("fish-masala", 780, 620, 975, 270),
    ("chicken-masala", 360, 1050, 1410, 270), ("meat-masala", 755, 1050, 1410, 270),
]


def products():
    d = ensure("products")
    s = 300 / 130
    p3 = render("gsw.pdf", 2, 300)
    for slug, cx, y0, y1 in PRODUCTS_P3:
        box = tuple(round(v * s) for v in (cx - 150, y0, cx + 150, y1))
        p3.crop(box).save(os.path.join(d, f"{slug}.webp"), "WEBP", quality=82, method=6)
    p4 = render("gsw.pdf", 3, 300)
    for slug, cx, y0, y1, w in PRODUCTS_P4:
        box = tuple(round(v * s) for v in (cx - w / 2, y0, cx + w / 2, y1))
        p4.crop(box).save(os.path.join(d, f"{slug}.webp"), "WEBP", quality=82, method=6)
    # brochure imagery reused editorially
    cover = render("gsw.pdf", 0, 200)
    cover.save(os.path.join(d, "brochure-cover.webp"), "WEBP", quality=78, method=6)
    p2 = render("gsw.pdf", 1, 200)
    w, h = p2.size
    p2.crop((0, int(h * 0.55), w, h)).save(os.path.join(d, "spoons.webp"), "WEBP", quality=80, method=6)
    print("products ok")


CERT_PAGES = {
    "incorporation": ("incorporation certificate.pdf", [0]),
    "iec": ("IE certificate.pdf", [0]),
    "fssai": ("fssai latest .pdf", [0, 2, 3]),
    "udyam": ("11_UDYAM.pdf", [0]),
    "icegate": ("ICE gate -Certificate.pdf", [0]),
    "apeda-rcmc": ("apeda green.pdf", [2]),
    "ad-code": ("AD code(authorised dealer).pdf", [0]),
}


def redact_ad_code(img):
    """Blank out the account number / IFSC sentence on the SBI letter."""
    doc = fitz.open(os.path.join(CERTS, "AD code(authorised dealer).pdf"))
    page = doc[0]
    sx = img.width / page.rect.width
    sy = img.height / page.rect.height
    dr = ImageDraw.Draw(img)
    for needle in ("43171799675", "SBIN0070041"):
        for r in page.search_for(needle):
            dr.rectangle([r.x0 * sx - 3, r.y0 * sy - 2, r.x1 * sx + 3, r.y1 * sy + 2], fill=(20, 20, 20))
    return img


def certs():
    d = ensure("certs")
    for slug, (pdf, pages) in CERT_PAGES.items():
        for i, p in enumerate(pages):
            img = render(pdf, p, 170)
            if slug == "ad-code":
                img = redact_ad_code(img)
            full = img.copy()
            full.thumbnail((1400, 1980), Image.LANCZOS)
            full.save(os.path.join(d, f"{slug}-p{i + 1}-full.webp"), "WEBP", quality=84, method=6)
            th = img.copy()
            th.thumbnail((560, 800), Image.LANCZOS)
            th.save(os.path.join(d, f"{slug}-p{i + 1}-thumb.webp"), "WEBP", quality=78, method=6)
    print("certs ok")


if __name__ == "__main__":
    photos()
    logo()
    products()
    certs()
