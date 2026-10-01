import { createContext, useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, reducedMotion, scrollToTop, ScrollTrigger, getLenis } from '../lib/motion'

const TransitionCtx = createContext({ go: () => {} })

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const root = useRef(null)
  const busy = useRef(false)
  const first = useRef(true)
  const current = useRef(pathname)
  current.current = pathname

  const go = useCallback(
    (to) => {
      if (busy.current) return
      if (to === current.current) {
        const l = getLenis()
        l ? l.scrollTo(0, { duration: 1.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (reducedMotion() || !root.current) {
        navigate(to)
        return
      }
      busy.current = true
      const el = root.current
      gsap
        .timeline({ onComplete: () => navigate(to) })
        .set(el, { visibility: 'visible' })
        .fromTo(el.querySelector('.pt__panel'), { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
        .fromTo(el.querySelector('.pt__mark'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35 }, '-=0.25')
    },
    [navigate],
  )

  useLayoutEffect(() => {
    scrollToTop()
    if (first.current) {
      first.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
    const el = root.current
    if (!el || !busy.current) return
    const tl = gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.set(el, { visibility: 'hidden' })
          busy.current = false
          ScrollTrigger.refresh()
        },
      })
      .to(el.querySelector('.pt__mark'), { autoAlpha: 0, duration: 0.25 })
      .to(el.querySelector('.pt__panel'), { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '<0.05')
    return () => tl.progress(1)
  }, [pathname])

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <div className="pt" ref={root} aria-hidden="true">
        <div className="pt__panel">
          <img className="pt__mark" src="/media/brand/mark-160.webp" alt="" width="72" height="72" />
        </div>
      </div>
    </TransitionCtx.Provider>
  )
}

export const useTransition = () => useContext(TransitionCtx)

export function TLink({ to, children, className = '', activeClass, onClick, ...rest }) {
  const { go } = useTransition()
  const { pathname } = useLocation()
  const active = activeClass && (to === '/' ? pathname === '/' : pathname.startsWith(to))
  return (
    <a
      href={to}
      className={`${className}${active ? ` ${activeClass}` : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
