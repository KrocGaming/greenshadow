"""Builds optimised web media from the raw files in /assests.

- Photos      -> public/media/photos/<slug>-{480,800,1200,1600}.webp (colour-graded set in /assests/colour)
- Hero film   -> public/media/video/hero-{wide,tall}.mp4 + hero-poster.webp (from Main_index.mp4)
- Logo        -> public/media/brand/logo-{dark,light}.png, small WebP copies for the page + favicon
- Products    -> public/media/products/<slug>.webp (pack mockups in /assests/greenshadow-product-mockups;
                 lines without a mockup fall back to the brochure crop from gsw.pdf)
- Certificates-> public/media/certs/<slug>-p<n>-{thumb,full}.webp

Personal data is never published: FSSAI page with Aadhaar details and the
APEDA application pages with bank / residential details are skipped, and the
bank account line on the SBI AD-code letter is redacted.
"""
import os
import subprocess
import fitz
import numpy as np
from PIL import Image, ImageDraw, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assests")
CERTS = os.path.join(SRC, "certificates")
OUT = os.path.join(ROOT, "public", "media")

PHOTOS = {
    "pepper-picker": "colour/DSC00068 (1).jpg",
    "pepper-vines": "colour/DSC00074 (1).jpg",
    "turmeric-field": "colour/DSC00090 (1).jpg",
    "turmeric-plants": "colour/DSC00096 (1).jpg",
    "turmeric-farmer-a": "colour/DSC00111 (1).jpg",
    "turmeric-gateway": "colour/DSC00111.png",
    "turmeric-farmer-b": "colour/DSC00112 (1).jpg",
    "chilli-kashmir": "colour/DSC00222.jpg",
    "truck-loading": "colour/DSC00228.jpg",
    "seed-heap": "colour/DSC00237 (1).jpg",
    "seed-pour": "colour/DSC00245 (1).jpg",
    "grain-heap": "colour/DSC00298 (1).jpg",
    "spice-bowl-hills": "colour/DSC00333.jpg",
    "winnow-a": "colour/DSC00341 (1).jpg",
    "winnow-b": "colour/DSC00345 (1).jpg",
    "seed-pot": "colour/DSC00369 (1).jpg",
    "seed-pots": "colour/DSC00373 (1).jpg",
    "harvest-a": "colour/DSC00378 (1).jpg",
    "harvest-b": "colour/DSC00379 (1).jpg",
    "paddy-inspect-a": "colour/DSC00409 (1).jpg",
    "paddy-inspect-b": "colour/DSC00415 (1).jpg",
    "paddy": "colour/DSC00450 (1).jpg",
    "chilli-girl-a": "colour/DSC00547.jpg",
    "chilli-girl-b": "colour/DSC00558 (1).jpg",
    "spice-pinch": "colour/DSC00577 (3).jpg",
    "chilli-sorting": "colour/DSC00691 (2).jpg",
    "elder-tractor": "colour/Still 2024-09-30 235647_1.1.4.png",
    "girl-portrait": "colour/Still 2024-10-09 152429_1.7.2.jpg",
    "girl-green": "colour/Still 2024-10-09 165042_1.6.1.jpg",
    "boatman-a": "colour/Still 2024-10-09 181716_1.5.5.jpg",
    "boatman-b": "colour/Still 2024-10-09 181903_1.5.5.jpg",
}
HERO_VIDEO = "Main_index.mp4"
PHOTO_WIDTHS = (480, 800, 1200, 1600)  # keep in step with Photo's srcSet in src/components/ui.jsx

# pack mockups: file in /assests/greenshadow-product-mockups -> product slug
MOCKUPS = {
    "01-coriander-powder": "coriander-powder",
    "02-turmeric-powder": "turmeric-powder",
    "03-garam-masala": "garam-masala",
    "04-fish-masala": "fish-masala",
    "05-chicken-masala": "chicken-masala",
    "06-meat-masala": "meat-masala",
    "07-black-pepper": "black-pepper",
    "08-white-pepper": "white-pepper",
    "09-cardamom": "cardamom",
    "10-chukku": "chukku",
    "11-clove": "clove",
    "12-cinnamon": "cinnamon-sticks",
    "13-star-anise": "anise-stars",
    "14-nutmeg-mace": "nutmace",
    "15-garam-masala-whole": "garam-masala-whole",
    "16-cashew-nuts": "cashew-nuts",
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
        for w in PHOTO_WIDTHS:
            c = im.copy()
            if c.width > w:
                c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
            c.save(os.path.join(d, f"{slug}-{w}.webp"), "WEBP", quality=70, method=6)
    print("photos ok")


def hero_video():
    """Scroll-scrubbed hero film: every frame is a keyframe so seeking is instant."""
    import imageio_ffmpeg

    ff = imageio_ffmpeg.get_ffmpeg_exe()
    d = ensure("video")
    src = os.path.join(SRC, HERO_VIDEO)
    # wide: full frame; tall: centre 3:4 crop for portrait screens (the subject stays centred)
    for name, vf, crf in (("wide", "scale=1280:-2", 26), ("tall", "crop=540:720", 27)):
        subprocess.run(
            [ff, "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-an", "-vf", vf,
             "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-g", "1", "-bf", "0",
             "-pix_fmt", "yuv420p", "-movflags", "+faststart", os.path.join(d, f"hero-{name}.mp4")],
            check=True,
        )
    png = os.path.join(d, "hero-poster.png")
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-frames:v", "1", png], check=True)
    Image.open(png).convert("RGB").save(os.path.join(d, "hero-poster.webp"), "WEBP", quality=80, method=6)
    os.remove(png)
    print("hero video ok")


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
    # what the page actually loads: the mark is shown at 40-72 px, the footer logo at 420 px
    sq.resize((160, 160), Image.LANCZOS).save(os.path.join(d, "mark-160.webp"), "WEBP", quality=90, method=6)
    lw = Image.fromarray(light.astype(np.uint8))
    if lw.width > 840:
        lw = lw.resize((840, round(lw.height * 840 / lw.width)), Image.LANCZOS)
    lw.save(os.path.join(d, "logo-light-840.webp"), "WEBP", quality=88, method=6)
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


def mockups():
    """Square tiles cut around the pack (plus a wide frame); they replace the brochure crops of the same slug."""
    d = ensure("products")

    def tile(im, slug):
        side = round(im.height * 0.92)
        x, y = (im.width - side) // 2, (im.height - side) // 2
        sq = im.crop((x, y, x + side, y + side)).resize((720, 720), Image.LANCZOS)
        sq.save(os.path.join(d, f"{slug}.webp"), "WEBP", quality=78, method=6)
        # uncropped frame for wide slots (process stages), where a square would clip the pack
        wide = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS) if im.width > 1600 else im
        wide.save(os.path.join(d, f"{slug}-wide.webp"), "WEBP", quality=74, method=6)

    for name, slug in MOCKUPS.items():
        tile(Image.open(os.path.join(SRC, "greenshadow-product-mockups", f"{name}.jpg")).convert("RGB"), slug)

    # no chilli mockup was supplied: the hero film ends on the chilli pack, so its last frame is used
    import imageio_ffmpeg

    png = os.path.join(d, "chilli-frame.png")
    subprocess.run(
        [imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-y", "-sseof", "-0.3",
         "-i", os.path.join(SRC, HERO_VIDEO), "-frames:v", "1", png],
        check=True,
    )
    tile(Image.open(png).convert("RGB"), "chilli-powder")
    os.remove(png)
    print("mockups ok")


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
    hero_video()
    logo()
    products()
    mockups()
    certs()
