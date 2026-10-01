import { useRef, useState, useEffect } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, ScrollTrigger, useGSAP, introReady, onIntro } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { Photo, Media, Button, TextLink, Eyebrow, CtaBand } from '../components/ui'
import { TLink } from '../components/Transition'
import { stats, process, facilityStatus, sourcing } from '../data/company'
import { products, productImg, productCls } from '../data/products'
import { certificates } from '../data/certificates'
import RouteDiagram from '../components/RouteDiagram'
import HoverList from '../components/HoverList'

const STRIP = [
  { name: 'chilli-girl-a', alt: 'A smiling girl holds a thick garland of fresh red chillies', cap: 'Red chilli' },
  { name: 'paddy-inspect-b', alt: 'A farmer in a blue turban inspects ripening grain in the field', cap: 'At the field' },
  { name: 'boatman-a', alt: 'An elderly boatman rows a traditional wooden boat', cap: 'Across regions' },
  { name: 'pepper-picker', alt: 'A woman reaches into the leaves of a pepper vine to pick by hand', cap: 'Pepper vines' },
  { name: 'seed-pot', alt: 'A clay pot heaped with whole seed spice on a stone ledge', cap: 'Seed spices' },
  { name: 'elder-tractor', alt: 'An elderly grower with a long white beard stands beside a tractor', cap: 'Grower communities' },
  { name: 'paddy', alt: 'Grain heads ripening on tall green stalks', cap: 'In the field' },
  { name: 'winnow-a', alt: 'A woman winnows seed in a bamboo tray against a blue-washed wall', cap: 'Winnowed by hand' },
  { name: 'turmeric-field', alt: 'Rows of broad-leaved turmeric plants stretching to the horizon', cap: 'Turmeric' },
]

/* Hero chapters, one per act of the hero film (grower → grinding → pack).
   Read together the three headlines make the page's h1. */
const CHAPTERS = [
  {
    kicker: '01 · Sourced',
    lines: [[['From the centres', false]], [['of ', false], ['produce,', true]]],
    body: 'Spices, nuts and masalas — sourced directly from growers and producer communities across India.',
  },
  {
    kicker: '02 · Processed',
    lines: [[['ground in our', false]], [['own facility,', true]]],
    body: 'Cleaned, graded and low-temperature ground in our own facility in Thiruvananthapuram, Kerala.',
  },
  {
    kicker: '03 · Packed',
    lines: [[['to ', false], ['global', true]], [['markets.', false]]],
    body: 'Sealed for freshness and dispatched about 25 km from Vizhinjam International Seaport.',
  },
]

/* Headline set one character at a time, so the hero timeline can "write" it
   by switching characters on in order. Words stay unbreakable. */
function Written({ lines }) {
  return lines.map((line, i) => (
    <span className="hero__wline" key={i}>
      {line.map(([text, em], j) => {
        const words = text.split(' ').flatMap((w, k) => {
          const word = (
            <span className="hero__word" key={k}>
              {[...w].map((c, m) => (
                <span className="ch" key={m}>{c}</span>
              ))}
            </span>
          )
          return k ? [' ', word] : [word]
        })
        return em ? <em key={j}>{words}</em> : <span key={j}>{words}</span>
      })}
    </span>
  ))
}

/* Brand film on a card tilted back in 3D; the Home timeline swings it upright
   to full bleed on scroll. Starts muted, streams only near the viewport and
   pauses off-screen; reduced-motion visitors get it flat with a play button.
   The sound button only appears when the file actually carries an audio track. */
function Film() {
  const video = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hasSound, setHasSound] = useState(false)
  const [muted, setMuted] = useState(true)
  const userPaused = useRef(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) userPaused.current = true
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {})
        else if (!e.isIntersecting) v.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(v)
    // no standard "has audio" flag: Firefox, Safari and Chromium each expose their own
    const probe = () => {
      if (!(v.mozHasAudio || v.audioTracks?.length > 0 || v.webkitAudioDecodedByteCount > 0)) return
      setHasSound(true)
      v.removeEventListener('loadeddata', probe)
      v.removeEventListener('timeupdate', probe)
    }
    v.addEventListener('loadeddata', probe)
    v.addEventListener('timeupdate', probe)
    return () => {
      io.disconnect()
      v.removeEventListener('loadeddata', probe)
      v.removeEventListener('timeupdate', probe)
    }
  }, [])

  const toggle = () => {
    const v = video.current
    if (v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  const toggleSound = () => {
    const v = video.current
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section className="film" aria-labelledby="film-title">
      <div className="film__head wrap">
        <p className="mono">Greenshadow · In motion</p>
        <h2 id="film-title" className="film__title">
          Journeys of spice, <em>told in frames.</em>
        </h2>
      </div>
      <div className="film__scene">
        <div className="film__card">
          <video
            ref={video}
            src="/media/video/greenshadow-720.mp4"
            poster="/media/video/greenshadow-poster.webp"
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <div className="film__gloss" aria-hidden="true" />
          <div className="film__shade" aria-hidden="true" />
          <div className="film__meta wrap">
            <p className="film__caption">From the centres of produce — a short film.</p>
            <div className="film__controls">
              <button type="button" className="film__toggle" onClick={toggle} aria-label={playing ? 'Pause film' : 'Play film'}>
                <span className={`film__icon ${playing ? 'is-playing' : ''}`} aria-hidden="true" />
                <span>{playing ? 'Pause' : 'Play'}</span>
              </button>
              {hasSound && (
                <button type="button" className="film__toggle" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
                  <svg className="film__speaker" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" />
                    {muted ? (
                      <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                    ) : (
                      <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                    )}
                  </svg>
                  <span>{muted ? 'Sound off' : 'Sound on'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const root = useRef(null)
  useSeo({
    description:
      'Greenshadow Agri-Allied Private Limited — a Thiruvananthapuram, Kerala spice and agricultural processing company. Direct-sourced whole spices, nuts, ground spices and masalas for domestic trade and export.',
    path: '/',
  })
  usePageMotion(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const q = (s) => root.current.querySelector(s)
      const qa = (s) => root.current.querySelectorAll(s)

      /* ---------- HERO: film scrubbed by scroll, headline written over it ---------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const v = q('.hero__film video')
        const chapters = [...qa('.hero__chapter')]
        const chars = chapters.map((c) => [...c.querySelectorAll('.ch')])
        const extras = (i) => chapters[i].querySelectorAll('.hero__kicker, .hero__body')
        const shown = chars.map(() => -1)
        // switch on the first n characters; the newest carries the pen stroke
        const write = (i, n) => {
          n = Math.round(n)
          if (n === shown[i]) return
          shown[i] = n
          chars[i].forEach((c, k) => {
            c.classList.toggle('is-on', k < n)
            c.classList.toggle('is-pen', k === n - 1 && n < chars[i].length)
          })
        }
        const pen = { film: 0, a: 0, b: 0, c: 0 }

        // the whole file is fetched up front so every seek is served from memory
        const url = `/media/video/hero-${window.matchMedia('(max-aspect-ratio: 3/4)').matches ? 'tall' : 'wide'}.mp4`
        let blob = null
        let dead = false
        fetch(url)
          .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
          .then((b) => {
            if (dead) return
            blob = URL.createObjectURL(b)
            v.src = blob
          })
          .catch(() => !dead && (v.src = url))
        // seeks are queued: one at a time, always toward the latest scroll position
        const seek = () => {
          if (!v.duration || v.seeking) return
          const t = Math.min(pen.film * v.duration, v.duration - 0.05)
          if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t
        }
        v.addEventListener('seeked', seek)
        v.addEventListener('loadeddata', seek)
        // iOS only decodes frames after a gesture-started play
        const prime = () => v.play().then(() => v.pause()).catch(() => {})
        window.addEventListener('touchstart', prime, { once: true, passive: true })

        // chapter one is written on arrival, held until the preloader lifts
        const intro = gsap.timeline({ delay: 0.15, paused: !introReady() })
        intro
          .fromTo(qa('.hero__eyebrow > span'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1 }, 0)
          .fromTo(chapters[0].querySelector('.hero__kicker'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
          .to(pen, { a: chars[0].length, duration: 1.7, ease: 'none', onUpdate: () => write(0, pen.a) }, 0.25)
          .fromTo(
            [chapters[0].querySelector('.hero__body'), q('.hero__ctas'), ...qa('.hero__scroll > *')],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1 },
            1.3,
          )
        const offIntro = onIntro(() => intro.play())

        // chapters two and three are written by the scroll itself
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            write(1, pen.b)
            write(2, pen.c)
            seek()
          },
          scrollTrigger: {
            trigger: q('.hero'),
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => self.progress > 0.01 && intro.progress() < 1 && intro.progress(1),
          },
        })
        tl.to(pen, { film: 1, duration: 0.94 }, 0)
          .to(q('.hero__scroll'), { autoAlpha: 0, duration: 0.05 }, 0.02)
          .to(chapters[0], { autoAlpha: 0, yPercent: -10, duration: 0.07 }, 0.13)
          .fromTo(extras(1), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.06 }, 0.23)
          .to(pen, { b: chars[1].length, duration: 0.17 }, 0.25)
          .to(chapters[1], { autoAlpha: 0, yPercent: -10, duration: 0.06 }, 0.52)
          .fromTo(extras(2), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.06 }, 0.61)
          .to(pen, { c: chars[2].length, duration: 0.16 }, 0.63)
          .to({}, { duration: 0.06 }, 0.94) // hold the finished pack before unpinning

        return () => {
          dead = true
          offIntro()
          v.removeEventListener('seeked', seek)
          v.removeEventListener('loadeddata', seek)
          window.removeEventListener('touchstart', prime)
          v.removeAttribute('src')
          v.load()
          if (blob) URL.revokeObjectURL(blob)
        }
      })

      /* ---------- Film: tilted card swings upright to full bleed ---------- */
      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1000px)' },
        (ctx) => {
          if (!ctx.conditions.motion) return
          const d = ctx.conditions.desktop
          const card = q('.film__card')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: q('.film'), start: 'top top', end: '+=150%', pin: true, scrub: 1, anticipatePin: 1 },
          })
          tl.fromTo(
            card,
            { rotateX: d ? 32 : 24, rotateZ: d ? -4 : -2, scale: d ? 0.56 : 0.78, yPercent: d ? 22 : 21, borderRadius: 28 },
            { rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, borderRadius: 0, ease: 'power2.inOut', duration: 1 },
            0,
          )
            .fromTo(q('.film__card video'), { scale: 1.2 }, { scale: 1, ease: 'none', duration: 1 }, 0)
            .to(q('.film__gloss'), { opacity: 0, duration: 0.6 }, 0.3)
            .to(q('.film__head'), { yPercent: -40, autoAlpha: 0, ease: 'power1.in', duration: 0.6 }, 0.2)
            .fromTo(q('.film__shade'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.8)
            .fromTo(qa('.film__meta > *'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.25 }, 0.85)
            .to({}, { duration: 0.2 }) // hold the full-bleed frame before unpinning
        },
      )

      /* ---------- Sourcing strip: horizontal drift ---------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = q('.strip__track')
        gsap.fromTo(
          track,
          { x: () => window.innerWidth * 0.1 },
          {
            x: () => -(track.scrollWidth - window.innerWidth * 0.9),
            ease: 'none',
            scrollTrigger: { trigger: q('.strip'), start: 'top bottom', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true },
          },
        )
        qa('.strip__item').forEach((el, i) => {
          gsap.fromTo(el.querySelector('img'), { yPercent: i % 2 ? -8 : 8 }, {
            yPercent: i % 2 ? 8 : -8, ease: 'none',
            scrollTrigger: { trigger: q('.strip'), start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })

      /* ---------- Process: horizontal pinned timeline (desktop) ---------- */
      mm.add('(min-width: 1000px)', () => {
        const section = q('.hproc')
        const track = q('.hproc__track')
        const stages = qa('.hstage')
        const ticks = qa('.hproc__tick')
        const bar = q('.hproc__bar i')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let current = -1
        const setActive = (i) => {
          if (i === current) return
          current = i
          stages.forEach((s, k) => s.classList.toggle('is-active', k === i))
          ticks.forEach((t, k) => t.classList.toggle('is-active', k <= i))
          q('.hproc__count').textContent = String(i + 1).padStart(2, '0')
        }
        setActive(0)
        const dist = () => track.scrollWidth - window.innerWidth
        const scroll = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: reduce ? true : 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar, { scaleX: self.progress })
              setActive(Math.min(stages.length - 1, Math.floor(self.progress * stages.length * 0.999 + 0.12)))
            },
          },
        })
        if (!reduce) {
          stages.forEach((s) => {
            const img = s.querySelector('.hstage__media img')
            gsap.fromTo(img, { xPercent: -10, scale: 1.2 }, {
              xPercent: 10, ease: 'none',
              scrollTrigger: { trigger: s, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
            })
          })
        }
      })

      /* ---------- Process: vertical timeline (mobile) ---------- */
      mm.add('(max-width: 999px)', () => {
        gsap.fromTo(q('.hproc__vline i'), { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: q('.hproc__track'), start: 'top 70%', end: 'bottom 70%', scrub: true },
        })
        qa('.hstage').forEach((s) => {
          ScrollTrigger.create({ trigger: s, start: 'top 70%', end: 'bottom 70%', toggleClass: 'is-active' })
        })
      })

      /* ---------- Masala shelf rising ---------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(qa('.shelf__item'), { yPercent: 40, rotate: (i) => (i % 2 ? 6 : -6) }, {
          yPercent: 0, rotate: 0, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: q('.shelf'), start: 'top bottom', end: 'center 60%', scrub: 0.6 },
        })
      })

      /* ---------- Certificates fan out (desktop) ---------- */
      mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = qa('.fan__card')
        const n = cards.length
        const spread = () => (q('.fan').clientWidth - cards[0].offsetWidth) / (n - 1)
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q('.trust'), start: 'top top', end: '+=120%', pin: true, scrub: 0.7, invalidateOnRefresh: true },
        })
        tl.fromTo(cards, { x: 0, y: (i) => i * -4, rotate: (i) => (i - n / 2) * 1.5 }, {
          x: (i) => (i - (n - 1) / 2) * spread(),
          y: (i) => Math.abs(i - (n - 1) / 2) * 26,
          rotate: (i) => (i - (n - 1) / 2) * 7,
          ease: 'power2.inOut',
          stagger: 0.02,
        }).fromTo(qa('.trust__list li'), { autoAlpha: 0.4 }, { autoAlpha: 1, stagger: 0.1, ease: 'none' }, 0)
      })
    },
    { scope: root },
  )

  const masalas = products.filter((p) => p.col === 'masala' || p.col === 'ground')
  const whole = products.filter((p) => p.col === 'whole')

  return (
    <div ref={root} className="home">
      {/* ================= HERO ================= */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__film" aria-hidden="true">
          <video poster="/media/video/hero-poster.webp" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__content wrap">
          <p className="hero__eyebrow">
            <span>Greenshadow Agri-Allied Pvt. Ltd.</span>
            <span>Thiruvananthapuram · Kerala · India</span>
          </p>
          <h1 id="hero-title" className="sr-only">
            From the centres of produce, ground in our own facility, to global markets.
          </h1>
          <div className="hero__chapters">
            {CHAPTERS.map((c) => (
              <div className="hero__chapter" key={c.kicker}>
                <p className="hero__kicker">{c.kicker}</p>
                <p className="hero__written" aria-hidden="true">
                  <Written lines={c.lines} />
                </p>
                <p className="hero__body">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="hero__foot">
            <div className="hero__ctas">
              <Button to="/products">Explore products</Button>
              <Button to="/contact" variant="ghost-light">Enquire for export</Button>
            </div>
            <div className="hero__scroll" aria-hidden="true">
              <span>Scroll</span>
              <i />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILM ================= */}
      <Film />

      {/* ================= INTRO ================= */}
      <section className="intro" aria-labelledby="intro-title">
        <div className="wrap">
          <Eyebrow index="01">Who we are</Eyebrow>
          <h2 id="intro-title" className="sr-only">Who we are</h2>
          <p className="intro__statement" data-scrub-words>
            Greenshadow Agri-Allied is a Kerala spice and agricultural-products company — built on its own land, with its
            own processing facility, and led by a promoter with more than fifteen years in the spice trade.
          </p>
        </div>

        <div className="strip" aria-label="Our sourcing network">
          <div className="strip__track">
            {STRIP.map((s, i) => (
              <figure key={s.name} className={`strip__item strip__item--${i % 3}`}>
                <div className="strip__img">
                  <Photo name={s.name} alt={s.alt} sizes="(min-width: 1000px) 26vw, 60vw" />
                </div>
                <figcaption>
                  <span>{String(i + 1).padStart(2, '0')}</span> {s.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="wrap intro__cols">
          <div data-reveal>
            <h3 className="h3">Sourced where it grows.</h3>
            <p>
              The company procures raw material directly from the centres of produce to maintain uniform taste and
              quality — drawing on relationships with farmers and producer communities across different regions of India.
            </p>
          </div>
          <ul className="ticks" data-reveal="stagger">
            {sourcing.slice(0, 4).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="intro__link" data-reveal>
            <TextLink to="/about">Our story</TextLink>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats wrap" aria-label="Greenshadow in numbers">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat__line" data-line />
            <p className="stat__num">
              {s.prefix && <span className="stat__affix">{s.prefix}</span>}
              <span data-count={s.value} data-from={s.plain ? s.value - 6 : 0}>
                {s.value}
              </span>
              {s.suffix && <span className="stat__affix">{s.suffix}</span>}
            </p>
            <p className="stat__label">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ================= PROCESS ================= */}
      <section className="hproc" aria-labelledby="proc-title">
        <div className="hproc__head wrap">
          <div>
            <Eyebrow index="02" tone="light">Process</Eyebrow>
            <h2 id="proc-title" className="h2">
              Eight stages, <em>farm gate to port.</em>
            </h2>
          </div>
          <div className="hproc__progress" aria-hidden="true">
            <span className="hproc__count">01</span>
            <span className="hproc__of">/ {String(process.length).padStart(2, '0')}</span>
            <div className="hproc__bar"><i /></div>
            <div className="hproc__ticks">
              {process.map((p) => (
                <span key={p.no} className="hproc__tick">{p.no}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="hproc__viewport">
          <div className="hproc__vline" aria-hidden="true"><i /></div>
          <ol className="hproc__track">
            {process.map((p) => (
              <li className="hstage" key={p.key}>
                <div className="hstage__media">
                  <Media src={p.img} alt={p.alt} sizes="(min-width: 1000px) 30vw, 90vw" />
                </div>
                <div className="hstage__text">
                  <span className="hstage__no">{p.no}</span>
                  <h3 className="hstage__title">{p.title}</h3>
                  <p className="hstage__short">{p.short}</p>
                  <p className="hstage__body">{p.body}</p>
                  <span className="tag">{p.check}</span>
                </div>
              </li>
            ))}
            <li className="hstage hstage--end">
              <p className="hstage__end">Every stage is preceded and followed by stringent quality checks.</p>
              <TextLink to="/process" className="tlink--light">See the full process</TextLink>
            </li>
          </ol>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="catalogue" aria-labelledby="cat-title">
        <div className="wrap catalogue__head">
          <Eyebrow index="03">Catalogue</Eyebrow>
          <h2 id="cat-title" className="h2" data-split>
            Whole spices, nuts and signature masalas.
          </h2>
          <p className="lead" data-reveal>
            Nineteen product lines — from Kerala black pepper and graded cardamom to ready-to-cook masala blends in 100 g
            retail packs.
          </p>
        </div>

        <div className="shelf wrap" aria-label="Greenshadow retail packs">
          {masalas.map((p) => (
            <TLink to="/products" className="shelf__item" key={p.slug}>
              <img className={productCls(p.slug)} src={productImg(p.slug)} alt={`Greenshadow ${p.name}, 100 g pack`} loading="lazy" decoding="async" />
              <span>{p.name}</span>
            </TLink>
          ))}
        </div>

        <div className="wrap">
          <HoverList items={whole} title="Whole spices & nuts" />
          <div className="catalogue__foot" data-reveal>
            <Button to="/products" variant="outline">Full catalogue</Button>
          </div>
        </div>
      </section>

      {/* ================= FACILITY / LOCATION ================= */}
      <section className="place" aria-labelledby="place-title">
        <div className="wrap place__grid">
          <div className="place__text">
            <Eyebrow index="04" tone="light">Facility</Eyebrow>
            <h2 id="place-title" className="h2" data-split>
              Own land. Own facility. Twenty-five kilometres from the sea.
            </h2>
            <p className="lead lead--light" data-reveal>
              The factory stands on the company’s own property in Anavoor, Thiruvananthapuram — with Vizhinjam International
              Seaport roughly 25 km away.
            </p>
            <ul className="status" data-reveal="stagger">
              {facilityStatus.map((s) => (
                <li key={s.area} className={`status__row is-${s.state}`}>
                  <span>{s.area}</span>
                  <span>{s.status}</span>
                </li>
              ))}
            </ul>
            <div data-reveal>
              <TextLink to="/facility" className="tlink--light">Inside the facility</TextLink>
            </div>
          </div>
          <RouteDiagram />
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="trust" aria-labelledby="trust-title">
        <div className="wrap trust__grid">
          <div className="trust__text">
            <Eyebrow index="05">Quality &amp; compliance</Eyebrow>
            <h2 id="trust-title" className="h2" data-split>
              Licensed, registered and export-ready.
            </h2>
            <ul className="trust__list">
              {certificates.map((c) => (
                <li key={c.slug}>
                  <span className="trust__short">{c.short}</span>
                  <span className="trust__name">{c.name}</span>
                  <span className="trust__num">{c.number}</span>
                </li>
              ))}
            </ul>
            <div className="trust__actions">
              <Button to="/certifications">View certificates</Button>
              <TextLink to="/quality">Our quality approach</TextLink>
            </div>
          </div>
          <div className="fan" aria-hidden="true">
            {certificates.map((c) => (
              <div className="fan__card" key={c.slug}>
                <img src={c.pages[0].thumb} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}
