import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ToggleTheme from './ToggleTheme'
import BrandLogo from './BrandLogo'
import VaultPoster from './atlas/VaultPoster'
import { MAILTO } from './BrandedEmail'
import { handleAnchorNavigation } from '../utils/scrollToSection'
import { getLenisInstance } from '../utils/lenis'
import { useActiveSection } from '../hooks/useActiveSection'
import { NAV_LINKS, SOCIAL_LINKS } from '../content/site'
import { useStudioTime } from '../hooks/useStudioTime'

// `to` is the real route; `hash` deep-links to a home page section ("Work" has no page of its own).
const linkTarget = (link) => (link.hash ? { pathname: link.to, hash: `#${link.hash}` } : link.to)

const SCROLL_THRESHOLD = 24
const HIDE_AFTER = 160 // px scrolled before the bar is allowed to slide away

/** Home page sections, in order, with the marker shown in the bar while each is in view. */
const HOME_SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'who-we-are', label: 'About' },
  { id: 'services', label: 'Approach' },
  { id: 'work', label: 'Work' },
  { id: 'one-team', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
const HOME_IDS = HOME_SECTIONS.map((s) => s.id)
const PAGE_LABELS = { '/work': 'Work', '/about': 'About', '/approach': 'Approach', '/services': 'Services', '/contact': 'Contact', '/resume': 'Resume', '/privacy': 'Privacy', '/terms': 'Terms' }

// Menu artwork per link: one of the vault's three states (our own procedural visual).
const MENU_VARIANT = { services: 'services', work: 'hero', 'who-we-are': 'hero', contact: 'door' }

const pad = (n) => String(n).padStart(2, '0')

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastYRef = useRef(0)
  const headerRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuVariant, setMenuVariant] = useState('hero')
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const activeId = useActiveSection(HOME_IDS, 'hero', pathname)
  const time = useStudioTime()
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const progressRef = useRef(null)

  const sectionIndex = onHome ? Math.max(0, HOME_IDS.indexOf(activeId)) : -1
  const marker = onHome
    ? { num: pad(sectionIndex), label: HOME_SECTIONS[sectionIndex].label }
    : { num: '—', label: PAGE_LABELS[pathname.replace(/\/+$/, '') || '/'] ?? (pathname.startsWith('/services/') ? 'Services' : 'Page') }

  const isLinkActive = (link) => (onHome ? activeId === link.id : !link.hash && link.to === pathname)

  // scrolled state + page progress line (transform only, written directly to the element)
  useEffect(() => {
    let rafId = 0
    const update = () => {
      rafId = 0
      const lenis = getLenisInstance()
      const scrollY = lenis?.scroll ?? window.scrollY
      const next = scrollY > SCROLL_THRESHOLD
      setIsScrolled((prev) => (prev === next ? prev : next))
      // hide while scrolling down (past the first screenful), show on any upward scroll or near the top
      const delta = scrollY - lastYRef.current
      if (scrollY < HIDE_AFTER) setIsHidden(false)
      else if (delta > 6) {
        // A mouse click leaves focus on the clicked nav link/button (and SPA navigation keeps it
        // there), which would exempt the bar from hiding via :focus-within. Only real keyboard focus
        // (:focus-visible) should keep it open, so drop any other focus inside the bar.
        const active = document.activeElement
        if (active && active !== document.body && headerRef.current?.contains(active) && !active.matches(':focus-visible')) active.blur()
        setIsHidden(true)
      }
      else if (delta < -6) setIsHidden(false)
      if (Math.abs(delta) > 6 || scrollY < HIDE_AFTER) lastYRef.current = scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const lenis = getLenisInstance()
    lenis?.on('scroll', schedule)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      lenis?.off('scroll', schedule)
    }
  }, [pathname])

  // lock scroll while the menu is open
  useEffect(() => {
    const lenis = getLenisInstance()
    if (isMenuOpen) {
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
  }, [isMenuOpen])

  // menu: focus the first link, Escape closes, Tab stays inside the dialog
  useEffect(() => {
    if (!isMenuOpen) return undefined
    const menu = menuRef.current
    menu?.querySelector('a')?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !menu) return
      const focusable = [menuButtonRef.current, ...menu.querySelectorAll('a, button')].filter(Boolean)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  useEffect(() => setIsMenuOpen(false), [pathname])

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), [])

  // Plain clicks on a section of the current page use the smooth in-page scroller.
  const handleNavClick = useCallback(
    (event, sectionId) => {
      if (sectionId && pathname === '/') {
        if (handleAnchorNavigation(event, sectionId)) setIsMenuOpen(false)
        return
      }
      if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        setIsMenuOpen(false)
      }
    },
    [pathname],
  )

  return (
    <header ref={headerRef} className={`at-nav${isScrolled ? ' is-scrolled' : ''}${isHidden && !isMenuOpen ? ' is-hidden' : ''}${isMenuOpen ? ' is-open' : ''}`}>
      <div className="at-nav__bar">
        <div className="at-nav__left">
          <Link to="/" onClick={(event) => handleNavClick(event, 'hero')} className="at-nav__logo" aria-label="Ansh home">
            <BrandLogo />
          </Link>
          <p className="at-nav__marker" aria-hidden="true">
            <span className="at-nav__marker-num">{marker.num}</span>
            <span>{marker.label}</span>
            <span className="at-nav__progress">
              <span ref={progressRef} />
            </span>
          </p>
        </div>

        <div className="at-nav__tools">
          <p className="at-nav__time" aria-hidden={!time || undefined}>
            {time ? (
              <>
                Chandigarh <time>{time}</time>
              </>
            ) : null}
          </p>
          <ToggleTheme className="at-nav__theme" />
          <Link to="/contact" onClick={(event) => handleNavClick(event)} className="at-btn at-btn--sm at-nav__cta">
            Start a project
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            className="at-nav__menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
          >
            <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
            <span className={`at-nav__burger${isMenuOpen ? ' is-x' : ''}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="site-menu" ref={menuRef} className="at-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <nav className="at-menu__nav" aria-label="Primary">
            <ol className="at-menu__list">
              {NAV_LINKS.map((link, index) => (
                <li key={link.id}>
                  <Link
                    to={linkTarget(link)}
                    onClick={(event) => handleNavClick(event, link.hash)}
                    onMouseEnter={() => setMenuVariant(MENU_VARIANT[link.id] ?? 'hero')}
                    onFocus={() => setMenuVariant(MENU_VARIANT[link.id] ?? 'hero')}
                    className="at-menu__link"
                    style={{ '--i': index }}
                    aria-current={isLinkActive(link) ? (onHome ? 'location' : 'page') : undefined}
                  >
                    <span className="at-menu__num" aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="at-menu__art" aria-hidden="true">
            <VaultPoster variant={menuVariant} />
            <span className="at-menu__fig">Fig. — {menuVariant === 'door' ? 'AI unit, waving' : 'AI unit'}</span>
          </div>

          <div className="at-menu__foot">
            <a href={MAILTO}>ansh.dev721@gmail.com</a>
            <span>Chandigarh / Mohali, India</span>
            <span className="at-menu__social">
              {SOCIAL_LINKS.map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              ))}
            </span>
          </div>
        </div>
      ) : null}
    </header>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
