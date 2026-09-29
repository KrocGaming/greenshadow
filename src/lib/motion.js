import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'power3.out', duration: 1 })

export const EASE = 'expo.out'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  if (document.documentElement.classList.contains('ld-on')) lenis.stop() // preloader restarts it
  return lenis
}

export const getLenis = () => lenis

/* Intro gate: page-entry animations wait until the preloader starts lifting. */
let introDone = false
const introWaiters = new Set()
export const introReady = () => introDone
export function onIntro(fn) {
  if (introDone) {
    fn()
    return () => {}
  }
  introWaiters.add(fn)
  return () => introWaiters.delete(fn)
}
export function releaseIntro() {
  if (introDone) return
  introDone = true
  introWaiters.forEach((fn) => fn())
  introWaiters.clear()
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.classList.toggle('is-locked', locked)
}

/* Refresh ScrollTrigger once images inside a root have loaded (layout shifts). */
export function refreshOnImages(root) {
  if (!root) return
  const imgs = [...root.querySelectorAll('img')].filter((i) => !i.complete)
  let pending = imgs.length
  if (!pending) return
  const done = () => {
    pending -= 1
    if (pending <= 0) ScrollTrigger.refresh()
  }
  imgs.forEach((i) => {
    i.addEventListener('load', done, { once: true })
    i.addEventListener('error', done, { once: true })
  })
}

/* Split text into masked lines of words for line-by-line reveals. */
function splitNode(node) {
  ;[...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment()
      n.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return
        if (!t.trim()) return frag.append(' ')
        const w = document.createElement('span')
        w.className = 'w'
        w.setAttribute('aria-hidden', 'true')
        const i = document.createElement('span')
        i.textContent = t
        w.append(i)
        frag.append(w)
      })
      n.replaceWith(frag)
    } else if (n.nodeType === 1 && !n.classList.contains('w')) {
      splitNode(n)
    }
  })
}

/* Wraps every word (inside nested inline elements too) in a mask span. */
export function splitWords(el) {
  if (!el) return []
  if (!el.dataset.split) {
    el.dataset.split = '1'
    const label = el.textContent.replace(/\s+/g, ' ').trim()
    splitNode(el)
    const sr = document.createElement('span')
    sr.className = 'sr-only'
    sr.textContent = label
    el.prepend(sr)
  }
  return el.querySelectorAll('.w > span')
}

export { gsap, ScrollTrigger, useGSAP }
