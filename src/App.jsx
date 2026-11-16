import { useCallback, useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import WhatsAppButton from './components/WhatsAppButton'
import PageTransition from './components/signal/PageTransition'
import IntroSplash from './components/IntroSplash'
import { introWillPlay } from './utils/intro'
import { ScrollTrigger, useIsoLayoutEffect } from './motion/signal'
import VaultStage from './components/atlas/VaultStage'
import SeoManager from './seo/SeoManager'
import Home from './pages/Home'
import About from './pages/About'
import Approach from './pages/Approach'
import Services from './pages/Services'
import Work from './pages/Work'
import ServiceDetail from './pages/ServiceDetail'
import Legal from './pages/Legal'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { scrollToSection } from './utils/scrollToSection'
import { getLenisInstance } from './utils/lenis'

/**
 * Client-side navigation scroll handling:
 * - `/path#id`  -> smooth-scroll to that section once the page is ready
 * - new path    -> reset to top
 * Does nothing on the very first load without a hash.
 */
function RouteScroll() {
  const { pathname, hash } = useLocation()
  const lastPathRef = useRef(pathname)

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      lastPathRef.current = pathname
      // A freshly mounted page is still laying out (images, pinned/scroll-driven sections),
      // so the first scroll can land short. Scroll once early, then correct after layout settles.
      const timers = [120, 900].map((delay) =>
        window.setTimeout(() => {
          const el = document.getElementById(id)
          if (!el) return
          if (Math.abs(el.getBoundingClientRect().top - 80) > 24) scrollToSection(id, 80)
        }, delay),
      )
      return () => timers.forEach((timer) => window.clearTimeout(timer))
    }

    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
    return undefined
  }, [pathname, hash])

  return null
}

function App() {
  const { pathname } = useLocation()
  // The splash is client-only (set before first paint), so the prerendered HTML stays the readable final page.
  const [showIntro, setShowIntro] = useState(false)
  useIsoLayoutEffect(() => {
    if (introWillPlay()) setShowIntro(true)
  }, [])
  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    // the splash locked scrolling (changing the scrollbar width): re-measure every scroll trigger
    window.requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {showIntro && <IntroSplash onComplete={handleIntroDone} />}
        <SeoManager />
        {/* The intro splash is gone: the hero plays its own entrance (see HeroSignal), and the
            prerendered HTML is always the final, readable state. */}
        <div className="page-root relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          {/* Fixed WebGL layer (feature-flagged, desktop only); empty on the server and on first render. */}
          <VaultStage />
          {/* Moves focus directly instead of changing the URL hash, so the router's
              hash-scroll handling never fights with it. The href is the no-JS fallback. */}
          <a
            href="#main"
            className="skip-link"
            onClick={(event) => {
              event.preventDefault()
              document.getElementById('main')?.focus()
            }}
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" tabIndex={-1} className={pathname === '/' ? undefined : 'is-opaque'}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/approach" element={<Approach />} />
              <Route path="/work" element={<Work />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/privacy" element={<Legal doc="privacy" />} />
              <Route path="/terms" element={<Legal doc="terms" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <PageTransition />
        </div>
        <RouteScroll />
        <SpeedInsights />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
