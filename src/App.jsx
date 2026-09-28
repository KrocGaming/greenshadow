import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { startSmoothScroll } from './lib/motion'
import { TransitionProvider } from './components/Transition'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'

const pages = {
  About: () => import('./pages/About'),
  Process: () => import('./pages/Process'),
  Facility: () => import('./pages/Facility'),
  Products: () => import('./pages/Products'),
  Markets: () => import('./pages/Markets'),
  Quality: () => import('./pages/Quality'),
  Certifications: () => import('./pages/Certifications'),
  Contact: () => import('./pages/Contact'),
  NotFound: () => import('./pages/NotFound'),
}
const About = lazy(pages.About)
const Process = lazy(pages.Process)
const Facility = lazy(pages.Facility)
const Products = lazy(pages.Products)
const Markets = lazy(pages.Markets)
const Quality = lazy(pages.Quality)
const Certifications = lazy(pages.Certifications)
const Contact = lazy(pages.Contact)
const NotFound = lazy(pages.NotFound)

export default function App() {
  const location = useLocation()

  useEffect(() => {
    startSmoothScroll()
    // warm the route chunks once the first page is idle, so transitions never wait
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500))
    idle(() => Object.values(pages).forEach((load) => load()))
  }, [])

  return (
    <TransitionProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page-fallback" aria-hidden="true" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/process" element={<Process />} />
            <Route path="/manufacturing" element={<Process />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/products" element={<Products />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/industries" element={<Markets />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </TransitionProvider>
  )
}
