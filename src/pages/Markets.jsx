import { useRef } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { useSeo } from '../lib/seo'
import { PageHero, Eyebrow, CtaBand, Photo } from '../components/ui'
import { markets, company } from '../data/company'

const FLOW = ['Source', 'Process', 'Pack', 'Export', 'Receive payment']

export default function Markets() {
  const root = useRef(null)
  useSeo({
    title: 'Markets',
    description: 'Greenshadow serves export buyers, domestic wholesale, retail and B2B customers. Focus export markets include the USA and the UAE, with registrations covering spices, cereals, cashew, fruits and vegetables.',
    path: '/markets',
  })
  usePageMotion(root)

  return (
    <div ref={root}>
      <PageHero
        index="E"
        label="Markets & industries"
        title={<>Where our spices <em>go.</em></>}
        lead="Export sales, domestic wholesale and retail, and B2B supply — backed by the registrations each channel requires."
        meta={[['Exporter type', 'Merchant cum manufacturer'], ['Focus markets', 'USA · UAE']]}
        image="turmeric-gateway"
        imageAlt="A woman lets turmeric powder fall into a bowl on a harbour wall, the Gateway of India behind her at sunset"
      />

      {/* Channels */}
      <section className="channels wrap" aria-labelledby="ch-title">
        <Eyebrow index="01">Channels</Eyebrow>
        <h2 id="ch-title" className="h2" data-split>Four ways to buy from Greenshadow.</h2>
        <ol className="channels__grid" data-reveal="stagger">
          {markets.channels.map((c, i) => (
            <li key={c.title}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Countries */}
      <section className="countries">
        <div className="wrap countries__grid">
          <div>
            <Eyebrow index="02" tone="light">Export markets</Eyebrow>
            <h2 className="h2" data-split>From Kerala to the world.</h2>
            <p className="lead lead--light" data-reveal>
              The USA and the UAE are the company’s focus export markets — Greenshadow has previously received export
              enquiries from buyers in the USA and Dubai. Its APEDA application lists seven destination countries.
            </p>
            <div className="countries__media" data-clip>
              <Photo name="boatman-b" alt="An elderly boatman rowing a traditional wooden boat" sizes="(min-width: 900px) 40vw, 90vw" />
            </div>
          </div>
          <ul className="countries__list">
            {markets.declared.map((c, i) => (
              <li key={c} className={markets.focus.includes(c) ? 'is-focus' : ''} data-reveal>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="countries__name">{c}</span>
                {markets.focus.includes(c) && <span className="countries__tag mono">Focus</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Business model */}
      <section className="flow wrap">
        <Eyebrow index="03">Business model</Eyebrow>
        <ol className="flow__list" data-reveal="stagger">
          {FLOW.map((f, i) => (
            <li key={f}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="flow__t">{f}</span>
            </li>
          ))}
        </ol>
        <p className="lead" data-reveal>
          Revenue comes from domestic sales, export sales and B2B supply. Greenshadow is registered as a {company.exporterCategory.toLowerCase()}.
        </p>
      </section>

      {/* Registered scope */}
      <section className="scope wrap" aria-labelledby="scope-title">
        <div className="scope__head">
          <Eyebrow index="04">Registered scope</Eyebrow>
          <h2 id="scope-title" className="h2" data-split>Product groups on record.</h2>
        </div>

        <div className="scope__grid">
          <div className="scope__block" data-reveal>
            <h3 className="mono">FSSAI food categories · wholesale & retail</h3>
            <ul>
              {markets.fssaiCategories.map((c) => (
                <li key={c.code}>
                  <span className="scope__code">{c.code}</span>
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="scope__block" data-reveal>
            <h3 className="mono">APEDA product groups (RCMC application)</h3>
            <ul>
              {markets.apedaGroups.map((g) => (
                <li key={g.group}>
                  <span className="scope__code">{g.group}</span>
                  <span>{g.items.join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="scope__block" data-reveal>
            <h3 className="mono">Export product lines · ITC(HS)</h3>
            <ul>
              {markets.hsLines.map((h) => (
                <li key={h.code}>
                  <span className="scope__code">{h.code}</span>
                  <span>{h.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title="Import from Kerala." body="Share your destination market, products and volumes and we will respond with availability and terms." image="girl-portrait" imageAlt="Portrait of a young girl from a producer community" />
    </div>
  )
}
