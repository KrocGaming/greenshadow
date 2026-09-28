import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageMotion } from '../lib/usePageMotion'
import { useSeo } from '../lib/seo'
import { PageHero, Eyebrow, Arrow, Photo } from '../components/ui'
import { contact, company } from '../data/company'
import { products } from '../data/products'

export default function Contact() {
  const root = useRef(null)
  const [params] = useSearchParams()
  const pre = products.find((p) => p.slug === params.get('product'))
  const [sent, setSent] = useState(false)
  useSeo({
    title: 'Contact',
    description: 'Contact Greenshadow Agri-Allied Private Limited, Kanjiyode, Anavoor P.O., Thiruvananthapuram, Kerala 695124. Phone +91 62381 39578 · sajingreenshadow@gmail.com.',
    path: '/contact',
  })
  usePageMotion(root)

  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k) => (f.get(k) || '').toString().trim()
    const subject = `Enquiry: ${get('product') || 'General'} — ${get('company') || get('name')}`
    const body = [
      `Name: ${get('name')}`,
      `Company: ${get('company')}`,
      `Email: ${get('email')}`,
      `Phone: ${get('phone')}`,
      `Country: ${get('country')}`,
      `Enquiry type: ${get('type')}`,
      `Product: ${get('product')}`,
      `Quantity: ${get('qty')}`,
      '',
      get('message'),
    ].join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div ref={root}>
      <PageHero
        index="H"
        label="Contact"
        title={<>Let’s talk <em>spices.</em></>}
        lead="Trade enquiries, export orders, sourcing partnerships and facility visits — reach the Greenshadow team directly."
      />

      <section className="contact wrap">
        <div className="contact__info">
          <Eyebrow index="01">Direct</Eyebrow>
          <ul className="contact__list">
            <li data-reveal>
              <span className="mono">Customer care</span>
              <a href={contact.phoneHref} className="contact__big">{contact.phone}</a>
            </li>
            <li data-reveal>
              <span className="mono">Email</span>
              <a href={`mailto:${contact.email}`} className="contact__big contact__big--sm">{contact.email}</a>
            </li>
            <li data-reveal>
              <span className="mono">Registered office & factory</span>
              <address>
                {company.name}
                <br />
                {contact.addressLines.map((l) => (
                  <span key={l}>
                    {l}
                    <br />
                  </span>
                ))}
              </address>
              <a className="tlink" href={contact.mapsHref} target="_blank" rel="noreferrer">
                <span>Open in Google Maps</span>
                <Arrow />
              </a>
            </li>
            <li data-reveal>
              <span className="mono">Managing Director</span>
              <p>{contact.person}</p>
            </li>
          </ul>
          <div className="contact__media" data-clip>
            <Photo name="girl-green" alt="A young girl from a producer community looks down thoughtfully" sizes="(min-width: 900px) 40vw, 90vw" />
          </div>
        </div>

        <div className="contact__formwrap">
          <Eyebrow index="02">Enquiry form</Eyebrow>
          <form className="form" onSubmit={submit} data-reveal>
            <div className="form__row">
              <label className="field">
                <span>Name *</span>
                <input name="name" required autoComplete="name" />
              </label>
              <label className="field">
                <span>Company</span>
                <input name="company" autoComplete="organization" />
              </label>
            </div>
            <div className="form__row">
              <label className="field">
                <span>Email *</span>
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label className="field">
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
            </div>
            <div className="form__row">
              <label className="field">
                <span>Country</span>
                <input name="country" autoComplete="country-name" />
              </label>
              <label className="field">
                <span>Enquiry type</span>
                <select name="type" defaultValue="Export order">
                  <option>Export order</option>
                  <option>Domestic wholesale</option>
                  <option>B2B supply</option>
                  <option>Sourcing partnership</option>
                  <option>Facility visit</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <div className="form__row">
              <label className="field">
                <span>Product</span>
                <select name="product" defaultValue={pre?.name ?? ''}>
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.slug}>{p.name}</option>
                  ))}
                  <option>Other / multiple</option>
                </select>
              </label>
              <label className="field">
                <span>Quantity</span>
                <input name="qty" placeholder="e.g. 1 MT / month" />
              </label>
            </div>
            <label className="field">
              <span>Message *</span>
              <textarea name="message" rows={5} required />
            </label>
            <div className="form__foot">
              <button className="btn btn--solid" type="submit">
                <span className="btn__label" data-text="Send enquiry">
                  <span>Send enquiry</span>
                </span>
                <span className="btn__icon">
                  <Arrow />
                </span>
              </button>
              <p className="form__note" role="status">
                {sent
                  ? `Your email app should now open with the enquiry filled in. If it doesn't, write to ${contact.email}.`
                  : 'Submitting opens your email app with the enquiry pre-filled.'}
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
