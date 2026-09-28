import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'

/* Schematic (not to scale) of the ~25 km link between the factory and Vizhinjam port. */
export default function RouteDiagram() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const path = ref.current.querySelector('.route__path')
      const len = path.getTotalLength()
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 } })
        tl.to(path, { strokeDashoffset: 0, ease: 'none' })
          .fromTo(ref.current.querySelectorAll('.route__node'), { scale: 0, transformOrigin: 'center' }, { scale: 1, stagger: 0.5, ease: 'back.out(2)' }, 0)
          .fromTo(ref.current.querySelectorAll('.route__label text'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.15 }, 0.2)
        const km = ref.current.querySelector('.route__km-num')
        const o = { v: 0 }
        tl.to(o, { v: 25, ease: 'none', onUpdate: () => (km.textContent = Math.round(o.v)) }, 0)
      })
    },
    { scope: ref },
  )

  return (
    <figure className="route" ref={ref}>
      <svg viewBox="0 0 600 560" role="img" aria-labelledby="route-t route-d">
        <title id="route-t">Factory to Vizhinjam International Seaport</title>
        <desc id="route-d">Schematic diagram, not to scale: the Greenshadow facility at Anavoor, Thiruvananthapuram lies approximately 25 kilometres from Vizhinjam International Seaport on the Arabian Sea.</desc>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity=".08" />
          </pattern>
          <pattern id="sea" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeOpacity=".16" />
          </pattern>
        </defs>
        <rect width="600" height="560" fill="url(#grid)" />
        {/* stylised coastline */}
        <path d="M0 330 C 60 350, 90 400, 130 420 S 200 470, 230 520 L 250 560 L 0 560 Z" fill="url(#sea)" />
        <path d="M0 330 C 60 350, 90 400, 130 420 S 200 470, 230 520 L 250 560" fill="none" stroke="currentColor" strokeOpacity=".45" />
        <text x="30" y="520" className="route__sea">Arabian Sea</text>

        <path className="route__path" d="M455 150 C 430 250, 330 260, 300 330 S 220 420, 190 452" fill="none" stroke="var(--gold)" strokeWidth="2.5" />

        <g className="route__node" transform="translate(455 150)">
          <circle r="22" fill="var(--gold)" fillOpacity=".15" className="route__pulse" />
          <circle r="8" fill="var(--gold)" />
        </g>
        <g className="route__node" transform="translate(190 452)">
          <circle r="22" fill="var(--olive)" fillOpacity=".18" className="route__pulse" />
          <rect x="-8" y="-8" width="16" height="16" fill="var(--olive)" />
        </g>

        <g className="route__label route__label--end" transform="translate(432 102)">
          <text className="route__k">Factory</text>
          <text className="route__v" y="22">Anavoor, Thiruvananthapuram</text>
        </g>
        <g className="route__label" transform="translate(222 470)">
          <text className="route__k">Port</text>
          <text className="route__v" y="22">Vizhinjam International Seaport</text>
        </g>
      </svg>
      <div className="route__km" aria-hidden="true">
        <span>≈</span>
        <span className="route__km-num">25</span>
        <span>km</span>
      </div>
      <figcaption className="mono">Schematic · not to scale</figcaption>
    </figure>
  )
}
