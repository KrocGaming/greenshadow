import { useRef } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { PageHero, Media, Eyebrow, CtaBand } from '../components/ui'
import { process } from '../data/company'

const TECH = [
  { t: 'Cleaning, drying & testing machinery', b: 'Raw material is cleaned, dried and tested with the help of special machines.' },
  { t: 'Low-temperature grinding', b: 'Spices are ground into the finished product through several stages at low temperature.' },
  { t: 'State-of-the-art packaging', b: 'Finished products are packed and sealed to protect aroma, colour and freshness.' },
  { t: 'Fully automatic line', b: 'Fully automatic machines are being installed for the processing line.' },
]

const CYCLE = ['Farmer / supplier', 'Raw-material purchase', 'Processing', 'Packaging', 'Export', 'Buyer payment']

export default function Process() {
  const root = useRef(null)
  useSeo({
    title: 'Process',
    description: 'How Greenshadow processes spices: direct procurement, intake inspection, cleaning, drying and testing, sorting and grading, low-temperature grinding, packaging and dispatch.',
    path: '/process',
  })
  usePageMotion(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1000px)', () => {
        const frames = root.current.querySelectorAll('.swap__frame')
        const counter = root.current.querySelector('.swap__count')
        const steps = root.current.querySelectorAll('.swap__step')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const show = (i) => {
          frames.forEach((f, k) => {
            const on = k === i
            f.classList.toggle('is-on', on)
            if (!reduce && on) gsap.fromTo(f, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut', overwrite: true })
            if (!reduce && on) gsap.fromTo(f.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out', overwrite: true })
          })
          counter.textContent = process[i].no
        }
        steps.forEach((s, i) => {
          ScrollTrigger.create({
            trigger: s,
            start: 'top 55%',
            end: 'bottom 55%',
            toggleClass: 'is-active',
            onEnter: () => show(i),
            onEnterBack: () => show(i),
          })
        })
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(root.current.querySelector('.qc__line i'), { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: root.current.querySelector('.qc'), start: 'top 70%', end: 'bottom 70%', scrub: true },
        })
        gsap.fromTo(root.current.querySelectorAll('.qc__node'), { scale: 0 }, {
          scale: 1, stagger: 0.12, ease: 'back.out(2)',
          scrollTrigger: { trigger: root.current.querySelector('.qc'), start: 'top 70%', end: 'bottom 70%', scrub: true },
        })
        gsap.fromTo(root.current.querySelectorAll('.cycle__item'), { autoAlpha: 0, x: -30 }, {
          autoAlpha: 1, x: 0, stagger: 0.12, duration: 0.9,
          scrollTrigger: { trigger: root.current.querySelector('.cycle'), start: 'top 75%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="B"
        label="Process"
        title={<>From raw harvest to <em>finished spice.</em></>}
        lead="An eight-stage flow documented from procurement to dispatch — every stage preceded and followed by stringent quality checks."
        meta={[['Stages', '08'], ['Quality checks', 'Every stage'], ['Grinding', 'Low-temp']]}
        image="turmeric-farmer-a"
        imageAlt="A farmer bends to tend turmeric plants growing in rows of dark soil"
      />

      {/* Sticky swap */}
      <section className="swap wrap" aria-label="Processing stages">
        <div className="swap__media" aria-hidden="true">
          <div className="swap__stage">
            {process.map((p, i) => (
              <div className={`swap__frame ${i === 0 ? 'is-on' : ''}`} key={p.key}>
                <Media src={p.img} alt="" sizes="45vw" />
              </div>
            ))}
            <span className="swap__count">01</span>
          </div>
        </div>
        <ol className="swap__steps">
          {process.map((p) => (
            <li className="swap__step" key={p.key}>
              <div className="swap__inline">
                <Media src={p.img} alt={p.alt} sizes="90vw" />
              </div>
              <span className="swap__no">{p.no}</span>
              <h2 className="swap__title">{p.title}</h2>
              <p className="swap__short mono">{p.short}</p>
              <p className="swap__body">{p.body}</p>
              <span className="tag">{p.check}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* QC rail */}
      <section className="qc">
        <div className="wrap">
          <Eyebrow index="02" tone="light">Quality gates</Eyebrow>
          <h2 className="h2" data-split>
            Checked going in. <em className="on-dark">Checked coming out.</em>
          </h2>
          <div className="qc__rail">
            <div className="qc__line" aria-hidden="true"><i /></div>
            <ol className="qc__nodes">
              {process.map((p) => (
                <li className="qc__node" key={p.key}>
                  <span className="qc__dot" aria-hidden="true" />
                  <span className="mono">{p.no}</span>
                  <span className="qc__t">{p.title}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="lead lead--light" data-reveal>
            The very first quality check takes place at the time of procuring raw materials, the next when the materials
            enter the plant. Cleaning, sorting, grading, low-temperature grinding and packaging are all preceded and
            followed by stringent quality checks.
          </p>
        </div>
      </section>

      {/* Technology */}
      <section className="tech wrap">
        <div className="tech__head">
          <Eyebrow index="03">Technology</Eyebrow>
          <h2 className="h2" data-split>Machinery built for purity.</h2>
        </div>
        <ol className="tech__grid" data-reveal="stagger">
          {TECH.map((t, i) => (
            <li key={t.t}>
              <span className="tech__i">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t.t}</h3>
              <p>{t.b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cycle */}
      <section className="cycle wrap">
        <div className="cycle__head">
          <Eyebrow index="04">The operating cycle</Eyebrow>
          <h2 className="h2" data-split>Source. Process. Pack. Export.</h2>
          <p className="lead" data-reveal>
            Raw materials are purchased in advance to keep production and export cycles running without interruption.
          </p>
        </div>
        <ol className="cycle__list">
          {CYCLE.map((c, i) => (
            <li className="cycle__item" key={c}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="cycle__t">{c}</span>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand title="See the finished product." body="Explore whole spices, nuts, ground spices and masala blends from the Greenshadow catalogue." image="chilli-girl-b" imageAlt="A smiling girl holds up a thick garland of fresh red chillies" />
    </div>
  )
}
