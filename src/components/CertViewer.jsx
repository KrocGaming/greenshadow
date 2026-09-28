import { useEffect, useRef, useState } from 'react'
import { gsap, lockScroll, reducedMotion } from '../lib/motion'
import { Arrow } from './ui'

export function certFields(c) {
  return [
    [c.numberLabel ?? 'Number', c.number],
    ['Standard', c.standard],
    ['Issued by', c.body],
    [c.issuedLabel ?? 'Issued', c.issued],
    ['Valid until', c.expires],
    ['Status', c.status],
    ...(c.extra ?? []),
  ].filter(([, v]) => v)
}

export default function CertViewer({ certs, index, onClose, onNav, returnFocus }) {
  const c = certs[index]
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(false)
  const root = useRef(null)
  const closeBtn = useRef(null)

  useEffect(() => {
    setPage(0)
    setZoom(false)
  }, [index])

  // open / close lifecycle
  useEffect(() => {
    lockScroll(true)
    const el = root.current
    closeBtn.current?.focus({ preventScroll: true })
    if (!reducedMotion()) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(el.querySelector('.cv__doc'), { y: 60, scale: 0.94 }, { y: 0, scale: 1, duration: 0.9, ease: 'expo.out' })
    }
    const trigger = returnFocus
    return () => {
      lockScroll(false)
      trigger?.focus?.({ preventScroll: true })
    }
  }, [returnFocus])

  // animate content change
  useEffect(() => {
    if (reducedMotion()) return
    const el = root.current
    gsap.fromTo(el.querySelectorAll('.cv__side > *'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'expo.out' })
    gsap.fromTo(el.querySelector('.cv__doc img'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
  }, [index, page])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNav(1)
      else if (e.key === 'ArrowLeft') onNav(-1)
      else if (e.key === 'Tab') {
        const f = [...root.current.querySelectorAll('button, a[href]')].filter((n) => !n.disabled)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNav])

  const pg = c.pages[page]

  return (
    <div className="cv" ref={root} role="dialog" aria-modal="true" aria-labelledby="cv-title" data-lenis-prevent>
      <div className="cv__bar">
        <span className="mono">
          {String(index + 1).padStart(2, '0')} / {String(certs.length).padStart(2, '0')} — Certificate viewer
        </span>
        <div className="cv__nav">
          <button className="cv__btn" onClick={() => onNav(-1)} aria-label="Previous certificate">
            <Arrow dir="left" />
          </button>
          <button className="cv__btn" onClick={() => onNav(1)} aria-label="Next certificate">
            <Arrow />
          </button>
          <button className="cv__btn cv__close" ref={closeBtn} onClick={onClose} aria-label="Close viewer">
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="cv__body">
        <div className={`cv__stage ${zoom ? 'is-zoom' : ''}`}>
          <button className="cv__doc" onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Fit document to screen' : 'Zoom document to full width'}>
            <img src={pg.full} alt={`${c.name}${c.pageLabels ? ` — ${c.pageLabels[page]}` : ''}, issued to Greenshadow Agri-Allied Private Limited`} />
          </button>
          <span className="cv__hint mono">{zoom ? 'Click to fit' : 'Click to zoom'}</span>
        </div>

        <aside className="cv__side">
          <p className="mono cv__kind">{c.kind}</p>
          <h2 id="cv-title" className="cv__title">{c.name}</h2>
          <p className="cv__desc">{c.description}</p>
          {c.pages.length > 1 && (
            <div className="cv__pages" role="group" aria-label="Document pages">
              {c.pages.map((p, i) => (
                <button key={p.thumb} className={i === page ? 'is-on' : ''} aria-pressed={i === page} onClick={() => setPage(i)}>
                  <img src={p.thumb} alt="" />
                  <span className="mono">{c.pageLabels?.[i] ?? `Page ${i + 1}`}</span>
                </button>
              ))}
            </div>
          )}
          <dl className="cv__dl">
            {certFields(c).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt>Scope</dt>
              <dd>{c.scope}</dd>
            </div>
          </dl>
          {c.note && <p className="cv__note mono">{c.note}</p>}
          <a className="cv__open" href={pg.full} target="_blank" rel="noreferrer">
            Open image in new tab ↗
          </a>
        </aside>
      </div>
    </div>
  )
}
