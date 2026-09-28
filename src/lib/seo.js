import { useEffect } from 'react'

const SITE = 'https://greenshadowagri.com'
const BRAND = 'Greenshadow Agri-Allied'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo({ title, description, path = '/' }) {
  useEffect(() => {
    const full = title ? `${title} — ${BRAND}` : `${BRAND} — Spices, Nuts & Masalas from Kerala`
    document.title = full
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', SITE + path)
    let link = document.head.querySelector('link[rel="canonical"]')
    if (link) link.setAttribute('href', SITE + path)
  }, [title, description, path])
}
