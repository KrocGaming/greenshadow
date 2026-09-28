import { useCallback, useRef, useState } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { useSeo } from '../lib/seo'
import { gsap } from '../lib/motion'
import { PageHero, Eyebrow, CtaBand } from '../components/ui'
import CertViewer from '../components/CertViewer'
import { certificates, declared } from '../data/certificates'

function tilt(e) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget.querySelector('.ccard__paper')
  const r = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6, ease: 'power3.out' })
}
function untilt(e) {
  gsap.to(e.currentTarget.querySelector('.ccard__paper'), { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'expo.out' })
}

export default function Certifications() {
  const root = useRef(null)
  const [open, setOpen] = useState(null)
  const trigger = useRef(null)
  useSeo({
    title: 'Certifications',
    description: 'Certificates and registrations held by Greenshadow Agri-Allied Private Limited: FSSAI Central Licence, Importer-Exporter Code, APEDA RCMC application, Udyam (MSME), ICEGATE, SBI AD code and Certificate of Incorporation.',
    path: '/certifications',
  })
  usePageMotion(root)

  const show = (i, e) => {
    trigger.current = e?.currentTarget ?? null
    setOpen(i)
  }
  const close = useCallback(() => setOpen(null), [])
  const nav = useCallback((d) => setOpen((o) => (o + d + certificates.length) % certificates.length), [])

  return (
    <div ref={root}>
      <PageHero
        index="G"
        label="Certifications & registrations"
        title={<>Licensed. Registered. <em>Export-ready.</em></>}
        lead="Every certificate below is reproduced from the original document. Select any certificate to view it in full."
        meta={[['Documents', String(certificates.length).padStart(2, '0')], ['FSSAI valid to', 'Dec 2026'], ['Exporting since', 'IEC 2020']]}
      />

      {/* Index */}
      <section className="cindex wrap" aria-labelledby="cindex-title">
        <Eyebrow index="01">Register</Eyebrow>
        <h2 id="cindex-title" className="sr-only">Certificate register</h2>
        <table className="cindex__table">
          <caption className="sr-only">Certificates and registrations held by Greenshadow Agri-Allied Private Limited</caption>
          <thead>
            <tr>
              <th scope="col">Certificate</th>
              <th scope="col">Issued by</th>
              <th scope="col">Number</th>
              <th scope="col">Issued</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c, i) => (
              <tr key={c.slug} data-reveal>
                <th scope="row" className="cindex__name">
                  <button onClick={(e) => show(i, e)}>
                    <em className="mono">{c.short}</em>
                    {c.name}
                  </button>
                </th>
                <td className="cindex__body">{c.body}</td>
                <td className="mono">{c.number}</td>
                <td className="mono">{c.issued}</td>
                <td>
                  <span className={`pill ${c.expires ? 'pill--valid' : ''}`}>{c.expires ? `Valid to ${c.expires}` : c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Showcase */}
      <section className="cshow wrap" aria-labelledby="cshow-title">
        <Eyebrow index="02">Showcase</Eyebrow>
        <h2 id="cshow-title" className="h2" data-split>The documents.</h2>
        <ul className="cgrid">
          {certificates.map((c, i) => (
            <li key={c.slug} className="ccard" data-reveal>
              <button className="ccard__btn" onClick={(e) => show(i, e)} onPointerMove={tilt} onPointerLeave={untilt} aria-label={`View ${c.name} in full`}>
                <span className="ccard__mat">
                  <span className="ccard__paper">
                    <img src={c.pages[0].thumb} alt={`Preview of ${c.name}`} loading="lazy" decoding="async" />
                  </span>
                  <span className="ccard__view">
                    View certificate
                    {c.pages.length > 1 && <small>{c.pages.length} pages</small>}
                  </span>
                </span>
              </button>
              <div className="ccard__info">
                <p className="mono ccard__kind">{c.kind}</p>
                <h3 className="ccard__name">{c.name}</h3>
                <p className="ccard__body">{c.body}</p>
                <dl className="ccard__dl">
                  <div>
                    <dt>{c.numberLabel ?? 'Number'}</dt>
                    <dd>{c.number}</dd>
                  </div>
                  <div>
                    <dt>{c.issuedLabel ?? 'Issued'}</dt>
                    <dd>{c.issued}</dd>
                  </div>
                  {c.expires && (
                    <div>
                      <dt>Valid until</dt>
                      <dd>{c.expires}</dd>
                    </div>
                  )}
                </dl>
                <p className="ccard__scope">{c.scope}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cnote wrap">
        <div data-reveal>
          <h2 className="mono">About these documents</h2>
          <p>
            Previews are rendered from the original certificates without alteration to their content. Personal and banking
            details — such as identity numbers, residential addresses and bank account numbers — are withheld from
            publication; the SBI letter shows its account line redacted, and only the relevant pages of the FSSAI licence and
            APEDA application are shown.
          </p>
        </div>
        <div data-reveal>
          <h2 className="mono">Also stated in company literature</h2>
          <p>
            The Greenshadow brochure lists {declared.name} certification, Certificate No. {declared.number} ({declared.marks}).
          </p>
        </div>
      </section>

      <CtaBand title="Need documents for onboarding?" body="Buyers and partners can request copies of registrations for vendor onboarding and due diligence." image="hands-bowl" imageAlt="Hands holding a small bowl of spice" />

      {open !== null && <CertViewer certs={certificates} index={open} onClose={close} onNav={nav} returnFocus={trigger.current} />}
    </div>
  )
}
