import { memo, useRef } from 'react'
import { gsap, useIsoLayoutEffect } from '../motion/signal'

/**
 * First-load intro: the classic name (orange "Ansh" from the left, white ".dev" from the top) sits bottom-left
 * while a counter runs to 100, an orange seam lights up across the middle, then the screen splits open along a horizontal line (top half up, bottom half down) like vault shutters and the page is revealed behind it.
 * Client-only (App mounts it after hydration). Click anywhere to speed it up. ~2.7s in total; the hero starts
 * building in as the doors begin to open (see INTRO_MS in utils/intro.js).
 */
function IntroSplash({ onComplete }) {
  const rootRef = useRef(null)

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const q = gsap.utils.selector(root)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const counter = { v: 0 }
    const countEl = q('[data-count]')[0]

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => onComplete?.(),
      })

      gsap.set(q('[data-fade]'), { autoAlpha: 0, y: 12 })
      gsap.set(q('[data-bar]'), { scaleX: 0 })
      gsap.set(q('[data-seam]'), { scaleX: 0, autoAlpha: 1 })
      gsap.set(q('[data-nv]'), { autoAlpha: 0, x: -120 })
      gsap.set(q('[data-st]'), { autoAlpha: 0, y: -72 })

      tl.to(q('[data-nv]'), { autoAlpha: 1, x: 0, duration: 0.85 }, 0.15)
        .to(q('[data-st]'), { autoAlpha: 1, y: 0, duration: 0.85 }, 0.25)
        .to(q('[data-fade]'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.3)
        .to(counter, {
          v: 100,
          duration: 1.55,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countEl) countEl.textContent = String(Math.round(counter.v))
          },
        }, 0.2)
        .to(q('[data-bar]'), { scaleX: 1, duration: 1.55, ease: 'power2.inOut' }, 0.2)
        // the seam lights up across the middle: the vault is about to open
        .to(q('[data-seam]'), { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, 1.5)
        // name and chrome leave first, then the halves part
        .to(q('[data-name]'), { yPercent: 18, duration: 0.6, ease: 'power2.in' }, 1.9)
        .to(q('[data-content]'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 1.95)
        .addLabel('open', 1.95)
        .to(q('[data-door="t"]'), { yPercent: -101, duration: 0.95, ease: 'expo.inOut' }, 'open')
        .to(q('[data-door="b"]'), { yPercent: 101, duration: 0.95, ease: 'expo.inOut' }, 'open')
        .to(q('[data-seam]'), { autoAlpha: 0, duration: 0.4 }, 'open+=0.35')

      const speedUp = () => tl.timeScale(4)
      root.addEventListener('click', speedUp)
      root.addEventListener('touchstart', speedUp, { passive: true })
    }, root)

    return () => {
      ctx.revert()
      document.body.style.overflow = prevOverflow
    }
    // runs once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className="nv-intro" role="presentation" aria-hidden="true">
      <div className="nv-intro__door nv-intro__door--t" data-door="t" />
      <div className="nv-intro__door nv-intro__door--b" data-door="b" />
      <span className="nv-intro__seam" data-seam />

      <div className="nv-intro__content" data-content>
        <p className="nv-intro__corner nv-intro__corner--tl" data-fade>
          <span className="nv-intro__dot" />
          Ansh · Portfolio
        </p>
        <p className="nv-intro__corner nv-intro__corner--tr" data-fade>
          Full Stack · AI · DevOps
        </p>

        <h1 className="nv-intro__name" data-name aria-hidden="true">
          <span className="nv-intro__nv" data-nv>
            Ansh
          </span>
          <span className="nv-intro__st" data-st>
            .dev
          </span>
        </h1>

        <div className="nv-intro__load" data-fade>
          <p className="nv-intro__label">Loading</p>
          <p className="nv-intro__count">
            <b data-count>0</b>
            <span>%</span>
          </p>
        </div>
        <span className="nv-intro__bar">
          <i data-bar />
        </span>
      </div>
    </div>
  )
}

export default memo(IntroSplash)
