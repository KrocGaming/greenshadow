# Greenshadow Agri-Allied — website

React + Vite site for **Greenshadow Agri-Allied Private Limited** (Thiruvananthapuram, Kerala), built on GSAP ScrollTrigger and Lenis smooth scrolling.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run media     # regenerate optimised media from /assests (needs Python: PyMuPDF, Pillow, numpy, imageio-ffmpeg)
```

## Where the content comes from

All company facts live in `src/data/` and are taken from the documents in `assests/`. Each data file lists its sources at the top.

| Source file | Used for |
|---|---|
| `certificates/gsw.pdf` (brochure) | Product catalogue and product images, processing and QC flow, spice-care tips, contact details, ISO 9001:2015 statement |
| `certificates/pitch deck .pdf` | 15+ years promoter experience, ≈25 km to Vizhinjam, own land, facility status, sourcing network, business model, USA/UAE focus, Sep 2026 launch |
| `incorporation certificate.pdf`, `IE certificate.pdf`, `fssai latest .pdf`, `11_UDYAM.pdf`, `ICE gate -Certificate.pdf`, `apeda green.pdf`, `AD code(authorised dealer).pdf` | Certifications page, milestones, registered product scope, export markets |
| `greenshadow-product-mockups/*` | Product images everywhere products appear — 16 pack mockups. Chilli Powder uses the last frame of the hero film; Coffee and Tea Powder still use the brochure photo until mockups are supplied |
| `colour/*` | Photography — the 31 colour-graded photos used across the site |
| `Main_index.mp4` | Home hero film, scrubbed by scroll (re-encoded with every frame a keyframe, plus a centre-cropped portrait cut for phones) |
| `WhatsApp Image …5.24.24 PM.jpeg` | Logo. The other WhatsApp photos are the ungraded originals and are no longer published |

## Things the owner should review

- **The hero film carries a Veo watermark** (bottom-right corner) and shows a "Kashmir Chilly Powder" pack, which is not one of the 19 products in the catalogue.
- **No factory or machinery photos were supplied.** The site uses the sourcing, grading and logistics photography. Add real facility photos to strengthen the Facility and Process pages.
- **ISO 9001:2015 (No. 304920082406Q)** appears only in the brochure. No certificate copy was supplied, so the site lists it as "stated in company literature" and doesn't show it in the certificate viewer.
- **APEDA** – the supplied file is an e-RCMC *application* (19 Dec 2025), so it's labelled "Application filed". Replace it with the issued RCMC when available.
- **Privacy** – certificate previews omit Aadhaar and residential details; the SBI letter's account number and IFSC are blacked out. The pitch deck (bank loan, funding) is not published.
- **Commercial launch** is shown as "targeted September 2026". Update `src/data/company.js` once operations start.
- The contact form opens the visitor's email app (`mailto:`). Connect a form backend to collect enquiries directly.

## Structure

- `src/pages/` – Home, About, Process, Facility, Products, Markets, Quality, Certifications, Contact, 404
- `src/lib/usePageMotion.js` – declarative scroll animations (`data-split`, `data-reveal`, `data-clip`, `data-parallax`, …). With `prefers-reduced-motion`, content shows in its final state.
- `src/lib/loader.js` + `src/lib/heroFilm.js` – first-load preloader. On the home page it stays up until the hero film has fully downloaded (25 s cap), with the counter following the real download.
- `scripts/build_media.py` – WebP conversion, logo variants, brochure product crops, certificate renders and redaction
- SPA rewrites for hosting: `public/_redirects` (Netlify), `vercel.json` (Vercel)
