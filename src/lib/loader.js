import { gsap, reducedMotion, releaseIntro, ScrollTrigger, getLenis } from './motion'

/*
 * First-load preloader. Markup + critical CSS live inline in index.html so it
 * paints immediately; this drives the counter from real load progress (fonts,
 * window load) and lifts it away as a two-layer curtain, releasing the page
 * intro animations mid-lift. Repeat visits in a session get a shorter run.
 */
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function runLoader() {
  const el = document.getElementById('loader')
  const html = document.documentElement
  if (!el) {
    releaseIntro()
    return
  }

  const finish = () => {
    el.remove()
    html.classList.remove('ld-on')
    getLenis()?.start()
    ScrollTrigger.refresh()
  }

  if (reducedMotion()) {
    releaseIntro()
    gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.15, onComplete: finish })
    return
  }

  let seen = false
  try {
    seen = sessionStorage.getItem('gs-loaded') === '1'
    sessionStorage.setItem('gs-loaded', '1')
  } catch {
    /* storage blocked: treat as first visit */
  }

  const q = (s) => el.querySelector(s)
  const num = q('.ld__num')
  const bar = q('.ld__bar i')
  const state = { p: 0 }
  const render = () => {
    num.textContent = String(Math.round(state.p)).padStart(3, '0')
    bar.style.transform = `scaleX(${state.p / 100})`
  }

  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
  const tasks = [loaded, document.fonts?.ready ?? Promise.resolve()]
  let settled = 0
  tasks.forEach((t) => t.then(() => (settled += 1)))

  // creep toward a ceiling that rises as real tasks finish
  const minTime = seen ? 0.6 : 2
  const creep = gsap.to(state, {
    p: 88,
    duration: minTime,
    ease: 'power2.out',
    onUpdate: () => {
      const ceiling = 60 + (settled / tasks.length) * 28
      if (state.p > ceiling) state.p = ceiling
      render()
    },
  })

  Promise.all([Promise.race([Promise.all(tasks), wait(7000)]), wait(minTime * 1000)]).then(() => {
    creep.kill()
    gsap.to(state, { p: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render, onComplete: exit })
  })

  function exit() {
    const text = [...el.querySelectorAll('.ld__word span, .ld__meta span'), num]
    // hand transforms from the CSS entrance animations over to GSAP
    gsap.set([...text, q('.ld__mark')], { animation: 'none' })
    gsap
      .timeline({ onComplete: finish })
      .to(text, {
        yPercent: -110,
        duration: 0.6,
        ease: 'expo.in',
        stagger: 0.015,
      })
      .to(q('.ld__mark'), { scale: 0.5, rotate: 25, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, 0)
      .to(q('.ld__bar'), { scaleX: 0, transformOrigin: 'right center', duration: 0.5, ease: 'expo.in' }, 0.05)
      .fromTo(
        q('.ld__panel--ink'),
        { yPercent: 0, borderRadius: '0 0 0 0' },
        { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 18vh 18vh', duration: 1.15, ease: 'expo.inOut' },
        '-=0.1',
      )
      .fromTo(
        q('.ld__panel--forest'),
        { yPercent: 0, borderRadius: '0 0 0 0' },
        { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 18vh 18vh', duration: 1.15, ease: 'expo.inOut' },
        '<0.14',
      )
      .call(releaseIntro, null, '<0.3')
  }
}
