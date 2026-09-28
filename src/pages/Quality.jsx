import { useRef } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { useSeo } from '../lib/seo'
import { PageHero, Eyebrow, CtaBand, Photo, Button } from '../components/ui'
import { careTips } from '../data/company'
import { declared } from '../data/certificates'

const CHECKS = [
  { t: 'At procurement', b: 'The very first quality check takes place at the time of procuring raw materials.' },
  { t: 'At plant intake', b: 'A second check is made when the materials enter the plant.' },
  { t: 'Around every stage', b: 'Cleaning, sorting, grading, low-temperature grinding and packaging are each preceded and followed by stringent quality checks.' },
]

// Conditions of the FSSAI Central Licence (fssai latest .pdf, page 6)
const FSSAI = [
  'Maintain sanitary and hygienic standards and worker hygiene as specified in Schedule 4.',
  'Maintain daily records of production, raw-material utilisation and sales.',
  'Ensure the source and standards of raw material used are of optimum quality.',
  'Test for relevant chemical and microbiological contaminants through own or NABL-accredited / FSSAI-recognised labs, at least once in six months.',
  'Employ at least one qualified technical person to supervise the production process.',
  'Buy and sell food products only from or to licensed / registered vendors, and keep records.',
]

export default function Quality() {
  const root = useRef(null)
  useSeo({
    title: 'Quality',
    description: 'Quality at Greenshadow: checks at procurement and plant intake, before and after every processing stage, and operation under an FSSAI Central Licence.',
    path: '/quality',
  })
  usePageMotion(root)

  return (
    <div ref={root}>
      <PageHero
        index="F"
        label="Quality"
        title={<>Quality, checked at <em>every stage.</em></>}
        lead="Quality is not a final inspection at Greenshadow — it starts where the spice is bought and continues through every step until it is sealed in the pack."
        image="grain-check-c"
        imageAlt="Grain streaming from one hand to another during inspection"
      />

      <section className="qphil wrap">
        <Eyebrow index="01">Philosophy</Eyebrow>
        <p className="qphil__text" data-scrub-words>
          Our promise of quality drives us to invest in more and more advanced infrastructure — so that what we bring to you
          is never compromised.
        </p>
      </section>

      <section className="qchecks wrap">
        <div className="qchecks__media" data-parallax="0.12">
          <Photo name="sack-weigh-b" alt="Raw spice being emptied from a sack at a weighing point" sizes="(min-width: 900px) 40vw, 90vw" />
        </div>
        <div>
          <Eyebrow index="02">Checkpoints</Eyebrow>
          <h2 className="h2" data-split>Three layers of control.</h2>
          <ol className="qchecks__list">
            {CHECKS.map((c, i) => (
              <li key={c.t} data-reveal>
                <span className="qchecks__i">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{c.t}</h3>
                  <p>{c.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="qreg">
        <div className="wrap qreg__grid">
          <div>
            <Eyebrow index="03" tone="light">Regulatory framework</Eyebrow>
            <h2 className="h2" data-split>Operating under an FSSAI Central Licence.</h2>
            <p className="lead lead--light" data-reveal>
              Licence No. 11325999000928, valid to 10 December 2026. As a licence holder, Greenshadow operates under
              conditions that include:
            </p>
            <div className="qreg__actions" data-reveal>
              <Button to="/certifications">View the licence</Button>
            </div>
          </div>
          <ol className="qreg__list">
            {FSSAI.map((f, i) => (
              <li key={f} data-reveal>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <p>{f}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap">
          <p className="qreg__iso" data-reveal>
            <span className="mono">Also stated in company literature</span>
            {declared.name} · Certificate No. {declared.number} · {declared.marks}
          </p>
        </div>
      </section>

      <section className="care wrap" aria-labelledby="care-title">
        <div className="care__head">
          <Eyebrow index="04">From our brochure</Eyebrow>
          <h2 id="care-title" className="h2" data-split>Keeping spices at their best.</h2>
        </div>
        <ol className="care__grid" data-reveal="stagger">
          {careTips.map((c, i) => (
            <li key={c.title}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand title="Talk quality with us." body="Questions about grades, specifications or documentation? Contact us before you order." image="turmeric-b" imageAlt="A woman sprinkles turmeric powder beside a bowl of fresh turmeric" />
    </div>
  )
}
