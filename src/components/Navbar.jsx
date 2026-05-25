import { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import ToggleTheme from './ToggleTheme'
import BrandLogo from './BrandLogo'
import { scrollToSection } from '../utils/scrollToSection'
import { getLenisInstance } from '../utils/lenis'
import { useTheme } from '../context/ThemeContext'
import { CINEMATIC_EASE } from '../motion/cinematic'

const NAV_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'who-we-are' },
  { label: 'Contact', id: 'contact' },
]

const SCROLL_THRESHOLD = 28

const barTransition = { duration: 0.5, ease: CINEMATIC_EASE }

const Navbar = memo(() => {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const lenis = getLenisInstance()
      const scrollY = lenis?.scroll ?? window.scrollY
      setIsScrolled(scrollY > SCROLL_THRESHOLD)
    }
    update()
    const lenis = getLenisInstance()
    if (lenis) {
      lenis.on('scroll', update)
      return () => lenis.off('scroll', update)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const lenis = getLenisInstance()
    if (isMobileOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const scrollTo = useCallback((id) => {
    setIsMobileOpen(false)
    scrollToSection(id, 80)
  }, [])

  const navLinkClass =
    isScrolled || isLight
      ? 'text-[var(--text-primary)] hover:text-[#ff6b00]'
      : 'text-white/90 hover:text-[#ff6b00]'

  const logoOnDark = !isScrolled && !isLight

  const themeToggleClass =
    isScrolled || isLight
      ? ''
      : 'border-white/25 text-white hover:border-[#ff6b00] hover:text-[#ff6b00]'

  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <motion.div
        className="pointer-events-auto mx-auto flex w-full max-w-[1600px] flex-col"
        initial={false}
        animate={{
          maxWidth: isScrolled ? 720 : 1600,
          marginTop: isScrolled ? 8 : 0,
          paddingLeft: isScrolled ? 12 : 12,
          paddingRight: isScrolled ? 12 : 12,
        }}
        transition={barTransition}
        style={{ width: '100%' }}
      >
        <motion.div
          className="flex w-full items-center justify-between overflow-hidden"
          initial={false}
          animate={{
            borderRadius: isScrolled ? 9999 : 0,
            backgroundColor: isScrolled ? 'var(--nav-bar-scrolled)' : 'transparent',
            boxShadow: isScrolled ? 'var(--nav-bar-shadow)' : 'none',
            paddingTop: isScrolled ? 12 : 20,
            paddingBottom: isScrolled ? 12 : 20,
            paddingLeft: isScrolled ? 24 : 0,
            paddingRight: isScrolled ? 24 : 0,
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
          }}
          transition={barTransition}
        >
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="flex shrink-0 items-center focus:outline-none"
            aria-label="NorthVaultStudios home"
          >
            <BrandLogo compact={isScrolled} onDark={logoOnDark} />
          </button>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${navLinkClass}`}
              >
                {link.label}
              </button>
            ))}
            <ToggleTheme className={themeToggleClass} />
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <ToggleTheme className={themeToggleClass} />
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`min-h-11 min-w-11 px-2 text-xs uppercase tracking-widest transition-colors duration-300 ${navLinkClass}`}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </motion.div>

        {isMobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`pointer-events-auto mt-2 flex flex-col gap-4 overflow-hidden px-6 pb-6 pt-5 md:hidden border border-[var(--glass-border)] bg-[var(--bg-primary)]/95 shadow-lg backdrop-blur-xl ${
              isScrolled ? 'rounded-3xl' : 'rounded-none border-t'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="min-h-11 py-2 text-left text-sm uppercase tracking-[0.15em] text-[var(--text-primary)]"
              >
                {link.label}
              </button>
            ))}
          </motion.nav>
        )}
      </motion.div>
    </header>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
