import { useRef, useState } from 'react'
import { usePageMotion } from '../lib/usePageMotion'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { useSeo } from '../lib/seo'
import { PageHero, Eyebrow, CtaBand, Arrow, TextLink } from '../components/ui'
import { TLink } from '../components/Transition'
import { products, collections, productImg } from '../data/products'

export default function Products() {
  const root = useRef(null)
  const grid = useRef(null)
  const [filter, setFilter] = useState('all')
  useSeo({
    title: 'Products',
    description: 'Greenshadow catalogue: black pepper, white pepper, cardamom (8, 7 & 6 bold), chukku, clove, cinnamon, star anise, nutmace, cashew nuts, chilli, coriander and turmeric powder, and garam, fish, chicken and meat masala.',
    path: '/products',
  })
  usePageMotion(root)

  const list = filter === 'all' ? products : products.filter((p) => p.col === filter)

  useGSAP(
    () => {
      const cards = grid.current.querySelectorAll('.pcard')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(cards, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() })
    },
    { scope: grid, dependencies: [filter] },
  )

  const count = (id) => (id === 'all' ? products.length : products.filter((p) => p.col === id).length)

  return (
    <div ref={root}>
      <PageHero
        index="D"
        label="Products"
        title={<>The <em>catalogue.</em></>}
        lead="Whole spices and nuts, ground spices, masala blends and beverages — as listed in the Greenshadow product brochure."
        meta={[['Product lines', String(products.length)], ['Retail pack', '100 g'], ['Cardamom', '8 · 7 · 6 Bold']]}
      />

      <section className="catalog wrap" aria-labelledby="catalog-title">
        <h2 id="catalog-title" className="sr-only">Product list</h2>
        <div className="filters" role="group" aria-label="Filter products">
          {[{ id: 'all', label: 'All products' }, ...collections].map((c) => (
            <button key={c.id} className={`filter ${filter === c.id ? 'is-on' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
              <sup>{count(c.id)}</sup>
            </button>
          ))}
        </div>

        <ul className="pgrid" ref={grid}>
          {list.map((p, i) => (
            <li className="pcard" key={p.slug}>
              <article>
                <div className="pcard__media">
                  <img src={productImg(p.slug)} alt={`${p.name}${p.spec?.startsWith('Pack') ? ' — Greenshadow retail pack' : ''}`} loading="lazy" decoding="async" />
                  <span className="pcard__i mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="pcard__body">
                  <p className="pcard__cat mono">{collections.find((c) => c.id === p.col)?.label}</p>
                  <h3 className="pcard__name">{p.name}</h3>
                  <p className="pcard__desc">{p.desc}</p>
                  <dl className="pcard__spec">
                    <div>
                      <dt>Format</dt>
                      <dd>{p.format}</dd>
                    </div>
                    {p.spec && (
                      <div>
                        <dt>{p.spec.split(':')[0]}</dt>
                        <dd>{p.spec.split(':')[1].trim()}</dd>
                      </div>
                    )}
                  </dl>
                  <ul className="pcard__uses" aria-label="Typical uses">
                    {p.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                  <TLink to={`/contact?product=${p.slug}`} className="pcard__cta" aria-label={`Enquire about ${p.name}`}>
                    <span>Enquire</span>
                    <Arrow />
                  </TLink>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="preg wrap">
        <div>
          <Eyebrow index="02">Beyond the catalogue</Eyebrow>
          <h2 className="h2" data-split>Registered to trade more.</h2>
        </div>
        <div className="preg__body" data-reveal>
          <p className="lead">
            Greenshadow’s FSSAI licence and APEDA application also cover cereals and rice, cashew kernels, fresh fruits and
            vegetables, walnuts and dried vegetables — along with export product lines for coriander and clove oleoresins.
          </p>
          <TextLink to="/markets">Markets & registered product groups</TextLink>
        </div>
      </section>

      <CtaBand title="Need a quote?" body="Tell us the product, grade and quantity you are looking for — for domestic trade or export." image="spice-bowl" imageAlt="Ground spice heaped in a decorated bowl" />
    </div>
  )
}
