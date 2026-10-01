import { reducedMotion } from './motion'

/*
 * The home hero film, downloaded once into memory so scroll-scrubbing never
 * waits on the network. The preloader starts the download and holds the page
 * until it lands; Home picks up the same download for its <video>.
 */
const ROUGH_SIZE = 3e6 // only used when the server sends no Content-Length

let job = null
let progress = 0
const watchers = new Set()
const report = (p) => {
  progress = p
  watchers.forEach((fn) => fn(p))
}

export const heroFilmUrl = () =>
  `/media/video/hero-${window.matchMedia('(max-aspect-ratio: 3/4)').matches ? 'tall' : 'wide'}.mp4`

/* Only the home page plays the film, and not for reduced-motion visitors. */
export const wantsHeroFilm = () => window.location.pathname === '/' && !reducedMotion()

/* Resolves to an object URL for the whole file. `onProgress` gets 0–1 as it downloads. */
export function loadHeroFilm(onProgress) {
  if (onProgress) {
    watchers.add(onProgress)
    onProgress(progress)
  }
  if (!job) {
    job = (async () => {
      const res = await fetch(heroFilmUrl())
      if (!res.ok) throw new Error(`hero film: ${res.status}`)
      let blob
      if (res.body) {
        const total = Number(res.headers.get('content-length')) || 0
        const reader = res.body.getReader()
        const chunks = []
        let got = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          got += value.length
          report(total ? got / total : Math.min(0.95, got / ROUGH_SIZE))
        }
        blob = new Blob(chunks, { type: 'video/mp4' })
      } else {
        blob = await res.blob()
      }
      report(1)
      return URL.createObjectURL(blob)
    })()
    // a failed download may be retried by the next caller
    job.catch(() => (job = null))
  }
  return job
}
