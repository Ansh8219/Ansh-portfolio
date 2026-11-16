import { memo, useCallback, useEffect, useRef } from 'react'
import { INTRO_MS, introWillPlay } from '../../utils/intro'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import VaultPoster from './VaultPoster'
import { handleAnchorNavigation } from '../../utils/scrollToSection'
import { gsap, EASE, useSignalMotion } from '../../motion/signal'

/**
 * Hero. Giant two-line headline bottom-left, the 3D object top-right inside a measured
 * "figure" (rings, crosshair, live pointer coordinates), intro copy and actions bottom-right.
 * The prerendered HTML is the final, readable state; the entrance plays once on the client.
 *
 * Not pinned: the hero scrolls away normally. The headline has no entrance; on scroll its two lines
 * glide apart (left / right) and the copy lifts away. The rings scroll with the page and the 3D
 * object (driven by VaultStage) rises at exactly page speed, so they stay in lockstep.
 */
function HeroAtlas() {
  const rootRef = useRef(null)
  const xRef = useRef(null)
  const yRef = useRef(null)
  const scrollToWork = useCallback((event) => handleAnchorNavigation(event, 'work'), [])

  // Live pointer coordinates in the figure labels (text only, throttled to animation frames).
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    let raf = 0
    let px = 0.52
    let py = 0.33
    const write = () => {
      raf = 0
      if (xRef.current) xRef.current.textContent = px.toFixed(2)
      if (yRef.current) yRef.current.textContent = py.toFixed(2)
    }
    const onMove = (event) => {
      px = event.clientX / window.innerWidth
      py = event.clientY / window.innerHeight
      if (!raf) raf = requestAnimationFrame(write)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useSignalMotion(
    rootRef,
    (_conditions, scope) => {
      const q = gsap.utils.selector(scope)
      const h1 = q('[data-h1]')[0]
      const rest = q('[data-intro]').filter((el) => el !== h1)
      const rings = q('[data-ring]')
      const axes = q('[data-axis]')
      const poster = q('[data-poster]')
      const aside = q('.at-hero__aside')

      // The hero is NOT pinned: it scrolls away like any section. Everything below is scrubbed
      // against that natural scroll (first screen height), transform/opacity only.
      const range = { trigger: scope, start: 'top top', end: 'bottom top', invalidateOnRefresh: true }

      // Headline: no entrance, it simply sits there. On scroll the two lines glide apart
      // (line 1 left, line 2 right, at different distances); plain transforms, so it stays crisp.
      const l1 = q('.at-hero__l1')[0]
      const l2 = q('.at-hero__l2')[0]
      const exit = gsap
        .timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...range, start: 'top top', end: '75% top', scrub: 0.6 } })
        .to(l1, { x: () => -window.innerWidth * 0.07 }, 0)
        .to(l2, { x: () => window.innerWidth * 0.16 }, 0)

      // inline start states, so releasing the pre-hydration CSS guard causes no flash
      gsap.set(h1, { autoAlpha: 1 })
      gsap.set(rest, { autoAlpha: 0, y: 24 })
      gsap.set(rings, { autoAlpha: 0, scale: 0.85 })
      gsap.set(axes, { scaleX: 0 })
      gsap.set(poster, { autoAlpha: 0, y: 30 })

      // when the intro splash is playing, wait for it to lift before the hero builds up
      const tl = gsap.timeline({ defaults: { ease: EASE.out }, delay: introWillPlay() ? (INTRO_MS + 150) / 1000 : 0 })
      tl.to(rings, { autoAlpha: 1, scale: 1, duration: 1.6, ease: EASE.hero, stagger: 0.12 }, 0)
        .to(axes, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', stagger: 0.1 }, 0.1)
        .to(poster, { autoAlpha: 1, y: 0, duration: 1.4, ease: EASE.hero }, 0.35)
        .to(rest, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.4)

      // intro copy + buttons ease up and out sooner than the page scrolls
      const asideOut = gsap.to(aside, {
        y: -70,
        autoAlpha: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { ...range, start: 'top top', end: '45% top', scrub: 0.5 },
      })
      return () => {
        tl.kill()
        ;[exit, asideOut].forEach((t) => {
          t?.scrollTrigger?.kill()
          t?.kill()
        })
      }
    },
    { releaseIntro: true },
  )

  return (
    <section id="hero" ref={rootRef} className="at-hero" aria-label="Ansh introduction">
      <div className="at-hero__figure" data-figure aria-hidden="true">
        <span className="at-hero__ring at-hero__ring--outer" data-ring />
        <span className="at-hero__ring at-hero__ring--inner" data-ring />
        <span className="at-hero__dots" data-ring />
        <span className="at-hero__axis at-hero__axis--h" data-axis />
        <span className="at-hero__axis at-hero__axis--v" data-axis />
        <span className="at-hero__coord at-hero__coord--y">
          y <span ref={yRef}>0.33</span>
        </span>
        <span className="at-hero__coord at-hero__coord--x">
          x <span ref={xRef}>0.52</span>
        </span>
        <span className="at-hero__fig">
          <span className="at-label__mark" />
          Fig. 01 · AI unit
        </span>
        <div className="at-hero__object" data-poster>
          <VaultPoster variant="hero" className="at-poster--hero" />
        </div>
      </div>

      <div className="at-hero__headline" data-headline>
        <h1 className="at-hero__h1" data-h1 data-intro>
          <span className="at-hero__l1">I Engineer</span> <span className="at-hero__l2">What’s Next.</span>
        </h1>
      </div>

      <div className="at-hero__aside">
        <p className="at-hero__lead" data-intro>
          I’m Ansh, a full stack, AI and DevOps engineer with 4+ years of experience. I design system architecture
          and build Python backends, React and Flutter apps, and the cloud infrastructure that runs them.
        </p>
        <div className="at-hero__cta" data-intro>
          <a href="#work" onClick={scrollToWork} className="at-btn at-btn--arrow">
            <span>View my work</span>
            <span className="at-btn__cell" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </a>
          <Link to="/contact" className="at-btn at-btn--ghost">
            Hire me
          </Link>
        </div>
      </div>

      <div className="at-hero__foot" data-intro>
        <span>Fig. 01 · Full stack &amp; AI</span>
        <span>4+ years</span>
      </div>
    </section>
  )
}

export default memo(HeroAtlas)
