import { useRef } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, useGSAP } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { PageHero, Photo, Eyebrow, CtaBand } from '../components/ui'
import RouteDiagram from '../components/RouteDiagram'
import { facilityStatus, advantages } from '../data/company'

const BUILT = [
  { t: 'Land', s: 'done' },
  { t: 'Factory', s: 'done' },
  { t: 'Infrastructure', s: 'done' },
  { t: 'Certifications', s: 'done' },
  { t: 'Machinery', s: 'progress' },
  { t: 'Operations', s: 'next' },
]

export default function Facility() {
  const root = useRef(null)
  useSeo({
    title: 'Facility',
    description: 'Greenshadow’s processing facility stands on its own land in Anavoor, Thiruvananthapuram — about 25 km from Vizhinjam International Seaport, with factory development substantially complete.',
    path: '/facility',
  })
  usePageMotion(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = root.current.querySelectorAll('.built__item')
        gsap.fromTo(items, { autoAlpha: 0.15 }, {
          autoAlpha: 1, stagger: 0.25, ease: 'none',
          scrollTrigger: { trigger: root.current.querySelector('.built'), start: 'top 75%', end: 'bottom 60%', scrub: true },
        })
        gsap.fromTo(root.current.querySelector('.built__bar i'), { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: root.current.querySelector('.built'), start: 'top 75%', end: 'bottom 60%', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <PageHero
        index="C"
        label="Facility & infrastructure"
        title={<>Own land. <em>Own facility.</em></>}
        lead="Factory development is substantially complete and the company is approaching commercial operational readiness, with the formal launch targeted for September 2026."
        meta={[['Location', 'Anavoor, TVM'], ['To Vizhinjam', '≈25 km'], ['Rent', 'None']]}
        image="sack-weigh-a"
        imageAlt="A worker pours raw spice from a jute sack beside a digital weighing scale inside a processing shed"
      />

      {/* Built progression */}
      <section className="built wrap" aria-labelledby="built-title">
        <Eyebrow index="01">Not starting from zero</Eyebrow>
        <h2 id="built-title" className="h2" data-split>
          What has already been built.
        </h2>
        <div className="built__bar" aria-hidden="true"><i /></div>
        <ol className="built__list">
          {BUILT.map((b, i) => (
            <li className={`built__item is-${b.s}`} key={b.t}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="built__t">{b.t}</span>
              <span className="built__s mono">{b.s === 'done' ? 'In place' : b.s === 'progress' ? 'Installing' : 'Launching'}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Status */}
      <section className="fstatus">
        <div className="wrap fstatus__grid">
          <div className="fstatus__media" data-clip>
            <Photo name="sack-weigh-b" alt="Raw spice poured from a jute sack at the weighing point" sizes="(min-width: 900px) 42vw, 90vw" />
          </div>
          <div>
            <Eyebrow index="02" tone="light">Current status</Eyebrow>
            <h2 className="h2" data-split>Approaching operational readiness.</h2>
            <table className="ftable">
              <caption className="sr-only">Facility development status</caption>
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {facilityStatus.map((s) => (
                  <tr key={s.area} className={`is-${s.state}`}>
                    <th scope="row">{s.area}</th>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="floc wrap">
        <div className="floc__text">
          <Eyebrow index="03">Location</Eyebrow>
          <h2 className="h2" data-split>Twenty-five kilometres to the port.</h2>
          <p className="lead" data-reveal>
            The factory is located approximately 25 km from Vizhinjam International Seaport — giving access to international
            shipping infrastructure with a shorter inland distance to port.
          </p>
          <p className="floc__quote" data-reveal>
            Own facility + strategic proximity to Vizhinjam = lower structural operating burden and a potential export-logistics advantage.
          </p>
        </div>
        <div className="floc__map">
          <RouteDiagram />
        </div>
      </section>

      {/* Advantages */}
      <section className="adv">
        <div className="wrap">
          <Eyebrow index="04" tone="light">Structural advantages</Eyebrow>
          <ol className="adv__list">
            {advantages.map((a, i) => (
              <li key={a.title} data-reveal>
                <span className="adv__i">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="adv__t">{a.title}</h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Visit the facility." body="Anavoor, Thiruvananthapuram, Kerala. Get in touch to arrange a visit or discuss a sourcing partnership." image="truck-loading" imageAlt="Sacks being loaded onto a truck" />
    </div>
  )
}
