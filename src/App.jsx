import { useState, useCallback, useEffect } from 'react'
import { preloadImages } from './utils/preloadImages'
import { SITE_PRELOAD_PATHS } from './constants/siteImages'
import { motion } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import WhatsAppButton from './components/WhatsAppButton'
import IntroSplash from './components/IntroSplash'
import Home from './pages/Home'
import { CINEMATIC_EASE } from './motion/cinematic'

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  useEffect(() => {
    preloadImages(SITE_PRELOAD_PATHS, { priority: 'high' })
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {!introComplete && <IntroSplash onComplete={handleIntroComplete} />}
        {introComplete && (
          <motion.div
            className="page-root relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: CINEMATIC_EASE }}
          >
            <Navbar />
            <main>
              <Home />
            </main>
            <Footer />
            <WhatsAppButton />
          </motion.div>
        )}
        <SpeedInsights />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
