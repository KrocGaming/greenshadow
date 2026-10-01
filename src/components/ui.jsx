import { useRef, useEffect } from 'react'
import { TLink } from './Transition'
import { gsap } from '../lib/motion'
import { isMockup } from '../data/products'

/* Where the subject sits in photos that are off-centre, so cover crops keep it. */
const FOCUS = {
  'boatman-a': '62% 50%',
  'chilli-girl-b': '55% 30%',
  'elder-tractor': '74% 40%',
  'grain-heap': '50% 30%',
  'harvest-a': '38% 50%',
  'spice-bowl-hills': '68% 55%',
  'truck-loading': '50% 30%',
  'turmeric-farmer-a': '62% 38%',
  'turmeric-gateway': '48% 38%',
}

/* Responsive photo from /media/photos (800w + 1600w WebP). */
export function Photo({ name, alt, sizes = '100vw', priority = false, className = '', ...rest }) {
  const base = `/media/photos/${name}`
  return (
    <img
      className={className}
      src={`${base}-800.webp`}
      srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={FOCUS[name] && { objectPosition: FOCUS[name] }}
      {...rest}
    />
  )
}

/* Resolves "product:slug" or a photo name. */
export function Media({ src, alt, sizes, className, priority }) {
  if (src.startsWith('product:')) {
    const slug = src.slice(8)
    const mock = isMockup(slug)
    return <img className={`${className ?? ''} is-product ${mock ? 'is-mockup' : ''}`} src={`/media/products/${slug}${mock ? '-wide' : ''}.webp`} alt={alt} loading="lazy" decoding="async" />
  }
  return <Photo name={src} alt={alt} sizes={sizes} className={className} priority={priority} />
}

export function Arrow({ dir = 'right' }) {
  return (
    <svg className={`arrow arrow--${dir}`} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}

/* Magnetic pull toward the pointer (fine pointers only). */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return ref
}

export function Button({ to, href, children, variant = 'solid', magnetic = true, className = '', ...rest }) {
  const ref = useMagnetic(0.25)
  const cls = `btn btn--${variant} ${className}`
  const inner = (
    <>
      <span className="btn__label" data-text={typeof children === 'string' ? children : undefined}>
        <span>{children}</span>
      </span>
      <span className="btn__icon">
        <Arrow />
      </span>
    </>
  )
  return (
    <span className="btn-wrap" ref={magnetic ? ref : undefined}>
      {to ? (
        <TLink to={to} className={cls} {...rest}>
          {inner}
        </TLink>
      ) : (
        <a href={href} className={cls} {...rest}>
          {inner}
        </a>
      )}
    </span>
  )
}

export function TextLink({ to, children, className = '' }) {
  return (
    <TLink to={to} className={`tlink ${className}`}>
      <span>{children}</span>
      <Arrow />
    </TLink>
  )
}

export function Eyebrow({ index, children, tone }) {
  return (
    <p className={`eyebrow ${tone ? `eyebrow--${tone}` : ''}`} data-reveal>
      {index && <span className="eyebrow__i">{index}</span>}
      <span className="eyebrow__t">{children}</span>
    </p>
  )
}

/* Interior page hero — editorial headline + optional image band. */
export function PageHero({ index, label, title, lead, image, imageAlt, tone = 'dark', meta }) {
  return (
    <header className={`phero phero--${tone}`} data-hero>
      <div className="wrap phero__top">
        <Eyebrow index={index} tone={tone === 'dark' ? 'light' : undefined}>
          {label}
        </Eyebrow>
        <h1 className="phero__title" data-hero-title>
          {title}
        </h1>
        <div className="phero__foot">
          {lead && (
            <p className="phero__lead" data-reveal>
              {lead}
            </p>
          )}
          {meta && (
            <dl className="phero__meta" data-reveal>
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      {image && (
        <div className="phero__media" data-hero-media>
          <Media src={image} alt={imageAlt} sizes="100vw" priority />
        </div>
      )}
    </header>
  )
}

export function CtaBand({ title = 'Source with Greenshadow.', body, image = 'harvest-a', imageAlt = 'A farmer carries a harvested sheaf across a green field' }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta__media" data-parallax="0.18">
        <Photo name={image} alt={imageAlt} sizes="100vw" />
      </div>
      <div className="wrap cta__inner">
        <Eyebrow tone="light">Enquiries · Trade · Export</Eyebrow>
        <h2 id="cta-title" className="cta__title" data-split>
          {title}
        </h2>
        <p className="cta__body" data-reveal>
          {body ?? 'Whole spices, nuts and masalas for domestic trade and export. Tell us what you need and we will get back to you.'}
        </p>
        <div className="cta__actions" data-reveal>
          <Button to="/contact">Enquire now</Button>
          <Button to="/products" variant="ghost-light">
            View catalogue
          </Button>
        </div>
      </div>
    </section>
  )
}
