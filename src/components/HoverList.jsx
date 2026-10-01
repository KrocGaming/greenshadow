import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'
import { productImg, productCls } from '../data/products'
import { TLink } from './Transition'
import { Arrow } from './ui'

/* Typographic list; on fine pointers a product image follows the cursor. */
export default function HoverList({ items, title }) {
  const wrap = useRef(null)
  const float = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const el = wrap.current
    const f = float.current
    if (!el || !f || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(f, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(f, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [])

  return (
    <div className="hlist" ref={wrap} onPointerLeave={() => setActive(null)}>
      {title && <h3 className="hlist__title mono">{title}</h3>}
      <ul>
        {items.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setActive(p.slug)}>
            <TLink to="/products" className="hlist__row" onFocus={() => setActive(p.slug)} onBlur={() => setActive(null)}>
              <span className="hlist__i">{String(i + 1).padStart(2, '0')}</span>
              <img className={`hlist__thumb ${productCls(p.slug)}`} src={productImg(p.slug)} alt="" loading="lazy" decoding="async" />
              <span className="hlist__name">{p.name}</span>
              <span className="hlist__meta">{p.spec ?? p.format}</span>
              <Arrow />
            </TLink>
          </li>
        ))}
      </ul>
      <div className={`hlist__float ${active ? 'is-on' : ''}`} ref={float} aria-hidden="true">
        {items.map((p) => (
          <img key={p.slug} src={productImg(p.slug)} alt="" className={active === p.slug ? 'is-on' : ''} loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  )
}
