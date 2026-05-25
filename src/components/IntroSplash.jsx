import { useEffect, useState, memo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { CINEMATIC_EASE } from '../motion/cinematic'

const SPLASH_MS = 1500
const EXIT_DURATION = 0.32

const brandWordStyle = {
  fontSize: 'clamp(4.25rem, 20vw, 14rem)',
  fontWeight: 900,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  minHeight: 'clamp(4.5rem, 22vw, 15rem)',
}

const accentGradient = {
  background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

/** Animate wrapper only — gradient text breaks if transform is on the text node itself */
const nvFromLeft = {
  hidden: { opacity: 0, x: -120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: CINEMATIC_EASE },
  },
}

const studiosFromTop = {
  hidden: { opacity: 0, y: -72 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: CINEMATIC_EASE, delay: 0.08 },
  },
}

function IntroSplash({ onComplete }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(performance.now())

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const duration = prefersReducedMotion ? 400 : SPLASH_MS
    startRef.current = performance.now()
    let rafId = 0

    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const remaining = Math.max(0, duration - elapsed)
      if (remaining > 0) {
        setProgress(elapsed / duration)
        rafId = requestAnimationFrame(tick)
      } else {
        setProgress(1)
      }
    }
    rafId = requestAnimationFrame(tick)

    const done = setTimeout(() => setVisible(false), duration)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(done)
    }
  }, [prefersReducedMotion])

  const percent = Math.round(progress * 100)
  const studiosColor = isLight ? '#0a0a0a' : '#ffffff'
  const mutedText = isLight ? 'rgba(10, 10, 10, 0.45)' : 'rgba(255, 255, 255, 0.4)'
  const percentMuted = isLight ? 'rgba(10, 10, 10, 0.55)' : 'rgba(255, 255, 255, 0.7)'
  const trackBg = isLight ? 'rgba(10, 10, 10, 0.1)' : 'rgba(255, 255, 255, 0.1)'

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="intro-splash"
          className={`intro-splash fixed inset-0 z-[200] flex flex-col ${
            isLight ? 'intro-splash--light bg-white' : 'intro-splash--dark bg-black'
          }`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : EXIT_DURATION, ease: CINEMATIC_EASE }}
          role="presentation"
          aria-hidden
        >
          <div className="relative z-[1] flex flex-1 items-center justify-center overflow-visible">
            {!prefersReducedMotion ? (
              <div className="section-pad site-shell flex w-full flex-col items-center justify-center overflow-visible px-3 text-center sm:px-4">
                <div
                  className="intro-splash__logo flex w-full max-w-[min(100%,52rem)] items-baseline justify-center gap-0 overflow-visible px-2 select-none"
                  style={brandWordStyle}
                >
                  <motion.div
                    className="inline-flex shrink-0 will-change-transform"
                    variants={nvFromLeft}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="font-black" style={accentGradient}>
                      NV
                    </span>
                  </motion.div>
                  <motion.div
                    className="inline-flex shrink-0 will-change-transform"
                    variants={studiosFromTop}
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="font-black" style={{ color: studiosColor }}>
                      Studios..
                    </span>
                  </motion.div>
                </div>
                <motion.p
                  className="mt-3 text-[10px] uppercase tracking-[0.4em] md:mt-4 md:text-xs"
                  style={{ color: mutedText }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35, ease: CINEMATIC_EASE }}
                >
                  NorthVaultStudios
                </motion.p>
              </div>
            ) : (
              <span
                className="intro-splash__logo select-none font-black"
                style={{ ...brandWordStyle, ...accentGradient }}
              >
                NVStudios..
              </span>
            )}
          </div>

          <div className="section-pad w-full pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <p className="intro-splash__loading-label mb-2 text-center text-[10px] font-bold uppercase tracking-[0.55em] text-[#ff6b00] md:text-xs">
              Loading
            </p>
            <p
              className={`intro-splash__percent text-center font-black tabular-nums leading-none ${
                isLight ? 'intro-splash__percent--light text-[#0a0a0a]' : 'text-white'
              }`}
              aria-live="polite"
              aria-label={`Loading ${percent} percent`}
            >
              {percent}
              <span className="text-[0.45em] font-bold" style={{ color: percentMuted }}>
                %
              </span>
            </p>
            <div
              className="mx-auto mt-4 h-[3px] max-w-md overflow-hidden rounded-full"
              style={{ backgroundColor: trackBg }}
            >
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8533]"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(IntroSplash)
