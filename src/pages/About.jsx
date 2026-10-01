import { useRef } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { PageHero, Photo, Eyebrow, CtaBand, TextLink } from '../components/ui'
import { founder, milestones, impact, company } from '../data/company'

const VALUES = [
  { t: 'Uniform taste & quality', b: 'Raw material is procured directly from the centres of produce so that every batch tastes the way it should.' },
  { t: 'Checked at every stage', b: 'Cleaning, sorting, grading, grinding and packing are each preceded and followed by stringent quality checks.' },
  { t: 'Closer to the grower', b: 'Direct sourcing relationships reduce intermediary layers and improve traceability.' },
  { t: 'Invest in infrastructure', b: 'Building our own facility on our own land, so the promise of quality is never compromised.' },
]

export default function About() {
  const root = useRef(null)
  useSeo({
    title: 'About',
    description: 'The story of Greenshadow Agri-Allied Private Limited — incorporated in 2020 in Thiruvananthapuram, Kerala, and led by a promoter with 15+ years in the spice sector.',
    path: '/about',
  })
  usePageMotion(root)

  useGSAP(
    () => {
      const years = root.current.querySelector('.ms__year-val')
      const rows = root.current.querySelectorAll('.ms__row')
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 55%',
          end: 'bottom 55%',
          toggleClass: 'is-active',
          onToggle: (self) => self.isActive && years && (years.textContent = row.dataset.year),
        })
      })
      gsap.fromTo(root.current.querySelector('.ms__line i'), { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: root.current.querySelector('.ms__list'), start: 'top 55%', end: 'bottom 55%', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="A"
        label="About Greenshadow"
        title={<>A spice company rooted in <em>Kerala.</em></>}
        lead="Greenshadow Agri-Allied Private Limited was incorporated on 5 June 2020 in Thiruvananthapuram to source, process and export spices, nuts and agricultural products."
        meta={[['Incorporated', '2020'], ['Based in', 'Anavoor'], ['Promoter experience', '15+ yrs']]}
        image="pepper-vines"
        imageAlt="Tall pepper vines climbing the trunks of a shaded plantation"
      />

      {/* Story */}
      <section className="story wrap">
        <div className="story__label">
          <Eyebrow index="01">Our story</Eyebrow>
        </div>
        <div className="story__body">
          <p className="story__lede" data-scrub-words>
            The business is not starting from zero. Greenshadow operates from its own land, its factory building is complete,
            and its major infrastructure is substantially in place.
          </p>
          <div className="story__cols">
            <div data-reveal>
              <h2 className="h3">Spices, agricultural products, processed food.</h2>
              <p>
                Greenshadow works across whole spices, nuts, ground spices and ready-to-cook masalas, with an
                export-oriented operation built around its own processing facility in Anavoor, Thiruvananthapuram.
              </p>
            </div>
            <div data-reveal>
              <h2 className="h3">From Kerala to global markets.</h2>
              <p>
                The company holds an Importer-Exporter Code since 2020, a Central FSSAI licence, customs and banking
                registrations for export, and has received export enquiries from buyers in the USA and Dubai.
              </p>
            </div>
          </div>
          <div className="story__images">
            <figure className="story__img story__img--a" data-clip>
              <Photo name="pepper-picker" alt="A woman reaches up into the leaves of a pepper vine to pick by hand" sizes="(min-width: 900px) 40vw, 90vw" />
            </figure>
            <figure className="story__img story__img--b" data-parallax="0.12">
              <Photo name="harvest-b" alt="A farmer carries a freshly cut sheaf through a tall green field" sizes="(min-width: 900px) 28vw, 70vw" />
            </figure>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="founder">
        <div className="wrap founder__grid">
          <div>
            <Eyebrow index="02" tone="light">Leadership</Eyebrow>
            <h2 className="founder__name" data-split>{founder.name}</h2>
            <p className="founder__role mono">{founder.role}</p>
          </div>
          <div className="founder__body">
            <p className="founder__exp" data-reveal>
              <span data-count="15">15</span>
              <span>+ years</span>
            </p>
            <p className="lead lead--light" data-reveal>
              A promoter with more than fifteen years in spices and agricultural products — bringing a farmer network across
              different regions of India, multilingual communication, and export business development experience.
            </p>
            <ul className="founder__list" data-reveal="stagger">
              {founder.strengths.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="ms wrap" aria-labelledby="ms-title">
        <div className="ms__aside">
          <Eyebrow index="03">Milestones</Eyebrow>
          <h2 id="ms-title" className="h2" data-split>
            Built step by step.
          </h2>
          <p className="ms__year" aria-hidden="true">
            <span className="ms__year-val">2020</span>
          </p>
        </div>
        <div className="ms__main">
          <div className="ms__line" aria-hidden="true"><i /></div>
          <ol className="ms__list">
            {milestones.map((m) => (
              <li className="ms__row" data-year={m.year} key={m.title}>
                <time className="mono">{m.date}</time>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
          <TextLink to="/certifications">See the certificates</TextLink>
        </div>
      </section>

      {/* Values */}
      <section className="values">
        <div className="wrap">
          <Eyebrow index="04">What we stand for</Eyebrow>
          <blockquote className="values__quote">
            <p data-split>“It is this no-compromise attitude towards quality that gives us the confidence to promise you the best and bring you the purest.”</p>
            <cite className="mono">— {company.short}, company brochure</cite>
          </blockquote>
          <ol className="values__grid" data-reveal="stagger">
            {VALUES.map((v, i) => (
              <li key={v.t}>
                <span className="values__i">{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.t}</h3>
                <p>{v.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Impact */}
      <section className="impact wrap">
        <div className="impact__media" data-clip>
          <Photo name="winnow-a" alt="A woman winnows seed in a bamboo tray against a blue-washed wall" sizes="(min-width: 900px) 40vw, 90vw" />
        </div>
        <div className="impact__text">
          <Eyebrow index="05">Local impact</Eyebrow>
          <h2 className="h2" data-split>Value added in Kerala.</h2>
          <p className="lead" data-reveal>
            Beyond the business case, Greenshadow aims to contribute to the rural economy around its facility.
          </p>
          <ul className="ticks" data-reveal="stagger">
            {impact.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Grow with Greenshadow." body="Trade enquiries, sourcing partnerships and export orders — we would like to hear from you." image="elder-tractor" imageAlt="An elderly grower with a long white beard stands beside a tractor" />
    </div>
  )
}
