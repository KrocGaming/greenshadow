import { gsap, reducedMotion, releaseIntro, ScrollTrigger, getLenis } from './motion'
import { loadHeroFilm, wantsHeroFilm } from './heroFilm'

/*
 * First-load preloader. Markup + critical CSS live inline in index.html so it
 * paints immediately; this drives the counter from real load progress (fonts,
 * window load and, on the home page, the hero film download) and lifts it away
 * as a two-layer curtain, releasing the page intro animations mid-lift. On the
 * home page it stays up until the film is fully downloaded. Repeat visits in a
 * session get a shorter run.
 */
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// the wait is told as the product's own journey; each line shows from its percentage on
const STEPS = [
  [0, 'Gathering the harvest'],
  [22, 'Cleaning & sorting'],
  [44, 'Grading by hand'],
  [64, 'Grinding at low temperature'],
  [84, 'Sealing the pack'],
  [100, 'Ready to serve'],
]
// never hold the page for ever on a failing connection; the film then finishes loading behind the poster
const FILM_PATIENCE = 25000

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
  const step = q('.ld__step span')
  const state = { p: 0 }
  let shown = 0
  const render = () => {
    num.textContent = String(Math.round(state.p)).padStart(3, '0')
    bar.style.transform = `scaleX(${state.p / 100})`
    const at = STEPS.findLastIndex(([from]) => state.p >= from)
    if (at !== shown) {
      shown = at
      gsap.fromTo(step, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'expo.out', overwrite: true, onStart: () => (step.textContent = STEPS[at][1]) })
    }
  }

  const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
  const tasks = [loaded, document.fonts?.ready ?? Promise.resolve()]
  let settled = 0
  tasks.forEach((t) => t.then(() => (settled += 1)))

  // on the home page the film is the bulk of the wait, so it drives most of the counter
  const film = wantsHeroFilm()
  let filmAt = 0
  const filmDone = film ? loadHeroFilm((p) => (filmAt = p)).catch(() => {}) : Promise.resolve()
  if (!film) q('.ld__note').textContent = 'Loading photographs'

  // creep toward a ceiling that rises as real work finishes
  const minTime = seen ? 0.6 : 2
  const began = performance.now()
  const creep = () => {
    const paced = 88 * gsap.parseEase('power2.out')(Math.min(1, (performance.now() - began) / (minTime * 1000)))
    const real = settled / tasks.length
    const ceiling = film ? 8 + real * 12 + filmAt * 68 : 60 + real * 28
    const target = Math.min(paced, ceiling)
    if (target > state.p) state.p += (target - state.p) * 0.14
    render()
  }
  gsap.ticker.add(creep)

  Promise.all([
    Promise.race([Promise.all(tasks), wait(7000)]),
    Promise.race([filmDone, wait(FILM_PATIENCE)]),
    wait(minTime * 1000),
  ]).then(() => {
    gsap.ticker.remove(creep)
    gsap.to(state, { p: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render, onComplete: exit })
  })

  function exit() {
    const text = [...el.querySelectorAll('.ld__word span, .ld__meta span'), num]
    // hand transforms from the CSS entrance animations over to GSAP
    gsap.set([...text, q('.ld__mark'), q('.ld__status')], { animation: 'none' })
    gsap
      .timeline({ onComplete: finish })
      .to(text, {
        yPercent: -110,
        duration: 0.6,
        ease: 'expo.in',
        stagger: 0.015,
      })
      .to(q('.ld__status'), { autoAlpha: 0, y: -12, duration: 0.45, ease: 'power2.in' }, 0)
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
