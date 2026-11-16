import { memo, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { MAILTO } from './BrandedEmail'
import { NAV_LINKS, SOCIAL_LINKS } from '../content/site'
import { getLenisInstance } from '../utils/lenis'
import { useStudioTime } from '../hooks/useStudioTime'
import { gsap, SplitText } from '../motion/signal'

const WORDS = ['Engineer.', 'Build.', 'Launch.', 'Scale.']

/**
 * Footer = the contact section (on the home page it carries id="contact", so "Contact" in the nav
 * and the section counter land here). Big call to action, email, navigation, studio details and a
 * giant word that cycles through what the studio does.
 *
 * Entrance (client only, motion allowed): when the footer comes into view, the glow fades up, the
 * heading lines rise out of a mask, the rule draws across, the details follow, and the big word
 * starts cycling. The server-rendered HTML is the final, readable state.
 */
const Footer = () => {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const time = useStudioTime()
  const rootRef = useRef(null)
  const ctaRef = useRef(null)
  const wordRef = useRef(null)
  const wrapRef = useRef(null)
  const [reveal, setReveal] = useState(false)

  // Footer reveal: on desktop the footer is fixed to the bottom, BEHIND the page, and this in-flow
  // wrapper (same height) leaves the gap at the end of the page, so the last section slides up and
  // uncovers it. Only when the footer fits the viewport; otherwise (phones, short screens, reduced
  // motion, no JS) it is a normal footer at the end of the page.
  useEffect(() => {
    const wrap = wrapRef.current
    const footer = rootRef.current
    if (!wrap || !footer) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia('(min-width: 900px)')
    const measure = () => {
      // offsetHeight is layout height (transforms, e.g. the cycling word, never count). In reveal mode
      // the footer has min-height 100svh, so it only exceeds the viewport when its content really does.
      const h = footer.offsetHeight
      setReveal(!reduced.matches && wide.matches && h > 0 && h <= window.innerHeight + 1)
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(footer)
    window.addEventListener('resize', measure)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  // the fixed footer is only shown while the gap at the end of the page is on screen
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !reveal) return undefined
    const observer = new IntersectionObserver(([entry]) => wrap.classList.toggle('is-on', entry.isIntersecting), { threshold: 0 })
    observer.observe(wrap)
    return () => {
      observer.disconnect()
      wrap.classList.remove('is-on')
    }
  }, [reveal])

  // entrance, replayed each time the footer comes into view from above
  // (not in reveal mode: there the footer is simply uncovered, fully drawn)
  useEffect(() => {
    const root = rootRef.current
    if (!root || reveal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const q = gsap.utils.selector(root)
    let split = null
    let tl = null
    const ctx = gsap.context(() => {
      split = SplitText.create(ctaRef.current, { type: 'lines', mask: 'lines', linesClass: 'at-line' })
      gsap.set(split.lines, { yPercent: 110 })
      gsap.set(q('[data-glow]'), { autoAlpha: 0, scale: 0.8 })
      gsap.set(q('[data-rule]'), { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(q('[data-rise]'), { autoAlpha: 0, y: 26 })
      gsap.set(wordRef.current, { yPercent: 105 })
    }, root)

    const play = () => {
      tl?.kill()
      tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(q('[data-glow]'), { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
        .to(split.lines, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.1)
        .to(q('[data-rule]'), { scaleX: 1, duration: 1.3, ease: 'expo.inOut' }, 0.35)
        .to(q('[data-rise]'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.5)
        .to(wordRef.current, { yPercent: 0, duration: 1.2 }, 0.75)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play()
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      tl?.kill()
      ctx.revert()
      split?.revert()
    }
  }, [reveal])

  // the big word cycles while it is on screen
  useEffect(() => {
    const el = wordRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let index = 0
    let timer = 0
    let tween = null
    const next = () => {
      tween = gsap.to(el, {
        yPercent: -105,
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => {
          index = (index + 1) % WORDS.length
          el.textContent = WORDS[index]
          tween = gsap.fromTo(el, { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' })
        },
      })
    }
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer)
      if (entry.isIntersecting) timer = window.setInterval(next, 2600)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
      tween?.kill()
    }
  }, [])

  const backToTop = () => {
    const lenis = getLenisInstance()
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={wrapRef} id={onHome ? 'contact' : undefined} className={`at-footer-wrap${reveal ? ' is-reveal' : ''}`}>
    <footer ref={rootRef} className="at-footer" aria-labelledby="footer-cta">
      <span className="at-footer__glow" data-glow aria-hidden="true" />
      <div className="at-wrap">
        <div className="at-footer__bar" data-rise>
          <p className="at-label">
            <span className="at-label__mark" aria-hidden="true" />
            Contact
          </p>
          <p className="at-footer__time" aria-hidden={!time || undefined}>
            {time ? (
              <>
                Chandigarh <time>{time}</time>
              </>
            ) : null}
          </p>
        </div>

        <h2 id="footer-cta" ref={ctaRef} className="at-footer__cta">
          Got a project
          <br />
          in mind?
        </h2>

        <span className="at-footer__rule" data-rule aria-hidden="true" />

        <div className="at-footer__grid">
          <div className="at-footer__contact" data-rise>
            <a href={MAILTO} className="at-footer__email">
              hello@northvaultstudios.com
            </a>
            <Link to="/contact" className="at-arrow-link">
              Start a project
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <nav aria-label="Footer" className="at-footer__nav" data-rise>
            <Link to="/">Home</Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.id} to={link.hash ? { pathname: link.to, hash: `#${link.hash}` } : link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="at-footer__info" data-rise>
            <p>
              NorthVault Studios
              <br />
              Digital Engineering &amp; AI Solutions Studio
              <br />
              Chandigarh, India
            </p>
            <p>
              <a href="tel:+918219268903">+91 8219268903</a>
            </p>
            <p>Reply within 24h · NDA on request</p>
            <p className="at-footer__social">
              {SOCIAL_LINKS.map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              ))}
            </p>
          </div>
        </div>

        <div className="at-footer__base">
          <p className="at-footer__word" aria-hidden="true">
            <span ref={wordRef}>{WORDS[0]}</span>
          </p>
          <div className="at-footer__legal" data-rise>
            <button type="button" onClick={backToTop} className="at-footer__top">
              Back to top <ArrowUp aria-hidden="true" size={14} />
            </button>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <span>&copy; {new Date().getFullYear()} NorthVault Studios</span>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}

export default memo(Footer)
