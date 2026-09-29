import { useRef, useState, useEffect } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, ScrollTrigger, useGSAP, introReady, onIntro } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { Photo, Media, Button, TextLink, Eyebrow, CtaBand } from '../components/ui'
import { TLink } from '../components/Transition'
import { stats, process, facilityStatus, sourcing } from '../data/company'
import { products, productImg } from '../data/products'
import { certificates } from '../data/certificates'
import RouteDiagram from '../components/RouteDiagram'
import HoverList from '../components/HoverList'

const STRIP = [
  { name: 'nutmeg-mace', alt: 'A smiling grower holds a leaf-lined basket of fresh nutmeg and mace', cap: 'Nutmeg & mace' },
  { name: 'farmer-inspect', alt: 'A farmer inspects ripening grain in the field', cap: 'At the field' },
  { name: 'elder-hills', alt: 'An elderly woman in the hills holds a string of beads', cap: 'Hill communities' },
  { name: 'turmeric-b', alt: 'A woman holds fresh turmeric beside a bowl of turmeric powder', cap: 'Turmeric' },
  { name: 'boatman-a', alt: 'An elderly boatman rows a traditional wooden boat', cap: 'Across regions' },
  { name: 'girl-green', alt: 'A young girl from a producer community', cap: 'Producer families' },
  { name: 'sack-weigh-a', alt: 'Raw spice poured from a jute sack at a weighing point', cap: 'Weighed at source' },
]

/* Brand film on a card tilted back in 3D; the Home timeline swings it upright
   to full bleed on scroll. Muted, streams only near the viewport and pauses
   off-screen; reduced-motion visitors get it flat with a play button. */
function Film() {
  const video = useRef(null)
  const [playing, setPlaying] = useState(false)
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
    return () => io.disconnect()
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
            <button type="button" className="film__toggle" onClick={toggle} aria-label={playing ? 'Pause film' : 'Play film'}>
              <span className={`film__icon ${playing ? 'is-playing' : ''}`} aria-hidden="true" />
              <span>{playing ? 'Pause' : 'Play'}</span>
            </button>
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

      /* ---------- HERO intro (all sizes) ---------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // held until the preloader lifts, so the reveal plays in view
        const intro = gsap.timeline({ delay: 0.15, paused: !introReady() })
        intro
          .fromTo(qa('.hero__line > span'), { yPercent: 115, y: 0 }, { yPercent: 0, y: 0, clearProps: 'transform', duration: 1.4, ease: 'expo.out', stagger: 0.09 })
          .fromTo(q('.hero__frame-in'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0.1)
          .fromTo(q('.hero__frame img'), { scale: 1.45 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0.1)
          .fromTo(qa('.hero__eyebrow > span, .hero__aside > *, .hero__scroll > *'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 1 }, 0.7)
        return onIntro(() => intro.play())
      })

      /* ---------- HERO pinned expansion (desktop) ---------- */
      mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q('.hero'), start: 'top top', end: '+=140%', pin: true, scrub: 0.6, anticipatePin: 1 },
        })
        tl.fromTo(q('.hero__frame'), { clipPath: 'inset(13% 5% 24% 63%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
          .fromTo(q('.hero__frame-in'), { scale: 1.18 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .to(q('.hero__shade'), { opacity: 1, duration: 0.6 }, 0.35)
          .to(q('.hero__line--1'), { xPercent: -30, autoAlpha: 0, duration: 0.6 }, 0)
          .to(q('.hero__line--2'), { xPercent: 25, autoAlpha: 0, duration: 0.6 }, 0.04)
          .to(q('.hero__line--3'), { xPercent: -20, autoAlpha: 0, duration: 0.6 }, 0.08)
          .to(qa('.hero__aside, .hero__eyebrow, .hero__scroll'), { autoAlpha: 0, duration: 0.3 }, 0)
          .fromTo(qa('.hero__reveal > *'), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.45 }, 0.55)
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
        <div className="hero__frame">
          <div className="hero__frame-in">
            <Photo name="hands-bowl" alt="A woman holds a small bowl of freshly sourced spice in her cupped hands" sizes="100vw" priority />
          </div>
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__content wrap">
          <p className="hero__eyebrow">
            <span>Greenshadow Agri-Allied Pvt. Ltd.</span>
            <span>Thiruvananthapuram · Kerala · India</span>
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line hero__line--1"><span>From the centres</span></span>{' '}
            <span className="hero__line hero__line--2"><span>of produce</span></span>{' '}
            <span className="hero__line hero__line--3"><span><em>to global</em> markets.</span></span>
          </h1>
          <div className="hero__aside">
            <p>
              Spices, nuts and masalas — sourced directly from growers, cleaned, graded and low-temperature ground in our
              own facility, about 25 km from Vizhinjam International Seaport.
            </p>
            <div className="hero__ctas">
              <Button to="/products">Explore products</Button>
              <Button to="/contact" variant="ghost-light">Enquire for export</Button>
            </div>
          </div>
          <div className="hero__scroll" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </div>
        <div className="hero__reveal wrap" aria-hidden="true">
          <p className="mono">Quality check · 01 of many</p>
          <p className="hero__reveal-text">
            The first quality check happens <em>at the point of procurement.</em>
          </p>
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
              <img src={productImg(p.slug)} alt={`Greenshadow ${p.name}, 100 g pack`} loading="lazy" decoding="async" />
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
