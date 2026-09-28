import { gsap, ScrollTrigger, useGSAP, splitWords, refreshOnImages } from './motion'

/*
 * Declarative scroll animations for a page root. Elements opt in with:
 *   data-split        headline words rise out of a mask on enter
 *   data-reveal       fade + rise on enter (data-reveal="stagger" staggers children)
 *   data-clip         image wipes open, inner img settles from 1.25 scale
 *   data-parallax=n   inner img drifts by n * 100% while in view
 *   data-scrub-words  words brighten one by one as you scroll
 *   data-count=n      number counts up when visible
 *   data-line         hairline draws in
 * Page heroes: data-hero-title / data-hero-media animate on mount.
 * With prefers-reduced-motion everything renders in its final state.
 */
export function usePageMotion(scope, deps = []) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      refreshOnImages(root)
      const q = (s) => [...root.querySelectorAll(s)]

      // split always (keeps a11y label), animate only with motion allowed
      q('[data-split], [data-hero-title]').forEach((el) => splitWords(el))

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('[data-hero-title]').forEach((el) => {
          gsap.fromTo(el.querySelectorAll('.w > span'), { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.06, delay: 0.25, clearProps: 'transform' })
        })
        q('[data-hero-media]').forEach((el) => {
          gsap.fromTo(el, { clipPath: 'inset(18% 8% 0% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: 0.3 })
          const img = el.querySelector('img')
          gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', delay: 0.3 })
          gsap.to(img, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
        })

        q('[data-split]').forEach((el) => {
          gsap.fromTo(el.querySelectorAll('.w > span'), { yPercent: 110, y: 0 }, {
            yPercent: 0,
            y: 0,
            clearProps: 'transform',
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.045,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        q('[data-reveal]').forEach((el) => {
          if (el.closest('[data-hero]') && !el.closest('[data-hero] [data-reveal-scroll]')) {
            gsap.fromTo(el, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, delay: 0.7 })
            return
          }
          const targets = el.dataset.reveal === 'stagger' ? el.children : el
          gsap.fromTo(targets, { y: 40, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        q('[data-clip]').forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
          const img = el.querySelector('img')
          if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
        })

        q('[data-parallax]').forEach((el) => {
          const amt = parseFloat(el.dataset.parallax) || 0.15
          const img = el.querySelector('img') || el
          gsap.fromTo(
            img,
            { yPercent: -amt * 50, scale: 1 + amt },
            { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })

        q('[data-scrub-words]').forEach((el) => {
          const words = splitWords(el)
          gsap.fromTo(
            words,
            { opacity: 0.16 },
            { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
          )
        })

        q('[data-line]').forEach((el) => {
          gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
        })
      })

      // counters run in both modes (reduced: jump to value)
      q('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const obj = { v: el.dataset.from ? parseFloat(el.dataset.from) : 0 }
        if (reduce) {
          el.textContent = end
          return
        }
        el.textContent = obj.v
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        })
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => mm.revert()
    },
    { scope, dependencies: deps },
  )
}
