import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from './Transition'
import { Arrow, useMagnetic } from './ui'
import { gsap, lockScroll, reducedMotion } from '../lib/motion'
import { contact } from '../data/company'

export const NAV = [
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/facility', label: 'Facility' },
  { to: '/products', label: 'Products' },
  { to: '/markets', label: 'Markets' },
  { to: '/quality', label: 'Quality' },
  { to: '/certifications', label: 'Certifications' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  const menu = useRef(null)
  const toggle = useRef(null)
  const cta = useMagnetic(0.2)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setCompact(y > 40)
      setHidden(y > 400 && y > last + 2)
      if (y < last - 2) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const el = menu.current
    if (!el) return
    lockScroll(open)
    if (open) {
      gsap.set(el, { visibility: 'visible' })
      if (!reducedMotion()) {
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
        gsap.fromTo(el.querySelectorAll('.mmenu__link span'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.3 })
        gsap.fromTo(el.querySelectorAll('.mmenu__foot > *'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.08, delay: 0.55 })
      }
      el.querySelector('a')?.focus({ preventScroll: true })
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    } else if (el.style.visibility === 'visible') {
      if (reducedMotion()) gsap.set(el, { visibility: 'hidden' })
      else gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) })
      toggle.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
      <header className={`nav ${compact ? 'is-compact' : ''} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__inner">
          <TLink to="/" className="nav__logo" aria-label="Greenshadow Agri-Allied — home">
            <img src="/media/brand/mark-160.webp" alt="" width="40" height="40" />
            <span className="nav__word">
              <strong>GREENSHADOW</strong>
              <small>Agri-Allied Pvt. Ltd.</small>
            </span>
          </TLink>
          <nav className="nav__links" aria-label="Primary">
            {NAV.map((n) => (
              <TLink key={n.to} to={n.to} className="nav__link" activeClass="is-active">
                {n.label}
              </TLink>
            ))}
          </nav>
          <span className="nav__cta-wrap" ref={cta}>
            <TLink to="/contact" className="nav__cta" activeClass="is-active">
              Enquire now <Arrow />
            </TLink>
          </span>
          <button
            ref={toggle}
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className="mmenu" ref={menu} role="dialog" aria-modal="true" aria-label="Site menu" inert={!open}>
        <nav className="mmenu__nav" aria-label="Mobile">
          {[{ to: '/', label: 'Home' }, ...NAV, { to: '/contact', label: 'Contact' }].map((n, i) => (
            <TLink key={n.to} to={n.to} className="mmenu__link" activeClass="is-active">
              <em>{String(i + 1).padStart(2, '0')}</em>
              <span>{n.label}</span>
            </TLink>
          ))}
        </nav>
        <div className="mmenu__foot">
          <a href={contact.phoneHref}>{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <p>Thiruvananthapuram, Kerala</p>
        </div>
      </div>
    </>
  )
}
