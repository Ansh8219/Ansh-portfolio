import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Registered once for the whole app. Safe during prerender: no DOM access happens here.
gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

/** useLayoutEffect warns on the server (prerender); this is a no-op effect there. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Breakpoint / preference conditions shared by every animated section. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  // Pinned and horizontal-scroll sequences only on roomy, hover-capable-sized screens.
  desktop: '(min-width: 1024px) and (min-height: 640px)',
  tablet: '(min-width: 768px)',
}

export const EASE = {
  out: 'power3.out',
  hero: 'expo.out',
  inOut: 'power2.inOut',
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Resolves when web fonts are ready (or after `timeout` ms) so text splits measure correctly. */
export function fontsReady(timeout = 1200) {
  if (typeof document === 'undefined') return Promise.resolve()
  return Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(timeout)])
}

/** Removes the pre-hydration "hide hero" class (see inline script in index.html). */
export function releaseIntroGuard() {
  if (typeof document !== 'undefined') document.documentElement.classList.remove('js-motion')
}

/**
 * Runs `build` inside gsap.context() + gsap.matchMedia() once fonts are ready.
 * - Reduced motion: `build` is never called, so final states stay visible.
 * - Everything created in `build` is reverted on unmount or when a media query stops matching.
 * - `build(conditions, scope)` may return a cleanup function.
 *
 * `releaseIntro: true` (hero only) also drops the CSS guard that hides the hero before JS runs.
 */
export function useSignalMotion(scopeRef, build, { releaseIntro = false, fontsTimeout = 1200 } = {}) {
  useIsoLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    let disposed = false
    let mm = null
    const ctx = gsap.context(() => {}, scope)

    fontsReady(fontsTimeout).then(() => {
      if (disposed) return
      ctx.add(() => {
        mm = gsap.matchMedia()
        mm.add(MQ, (mq) => {
          const conditions = mq.conditions
          if (!conditions.motion) return undefined
          return build(conditions, scope)
        })
      })
      if (releaseIntro) releaseIntroGuard()
    })

    return () => {
      disposed = true
      mm?.revert()
      ctx.revert()
    }
    // build is intentionally created once per mount; sections have no reactive animation inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * Calls `play(visibleElements)` once for each element, the first time it is on screen.
 * Based on real visibility (IntersectionObserver), not on scroll positions measured earlier, so a reveal can
 * never be left waiting at a stale position after fonts, images or accordions change the page height.
 * Returns a function that stops observing.
 */
export function whenVisible(elements, play) {
  const pending = new Set(Array.from(elements).filter(Boolean))
  if (!pending.size) return () => {}
  if (typeof window === 'undefined') return () => {}

  const fire = (hit) => {
    const fresh = hit.filter((el) => pending.delete(el))
    if (fresh.length) play(fresh)
    if (!pending.size) stop()
  }

  // Backup that does not depend on IntersectionObserver or on scroll positions measured earlier:
  // plain geometry, checked on load, shortly after, and on every scroll / resize.
  const check = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight
    fire([...pending].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < vh
    }))
  }

  let io = null
  if (typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((entries) => fire(entries.filter((e) => e.isIntersecting).map((e) => e.target)))
    pending.forEach((el) => io.observe(el))
  }
  const timers = [60, 400, 1200, 2500].map((ms) => window.setTimeout(check, ms))
  window.addEventListener('scroll', check, { passive: true })
  window.addEventListener('resize', check)

  function stop() {
    io?.disconnect()
    timers.forEach((t) => window.clearTimeout(t))
    window.removeEventListener('scroll', check)
    window.removeEventListener('resize', check)
  }
  return stop
}

/**
 * Headline reveal: lines rise out of a mask when the element scrolls into view.
 * autoSplit re-measures on resize, so lines never break one word per line after a width change.
 */
export function revealLines(el, { stagger = 0.08, duration = 1.05, delay = 0 } = {}) {
  if (!el) return null
  let shown = false
  let tween = null
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'sp-line',
    autoSplit: true,
    onSplit: (self) => {
      tween = gsap.from(self.lines, { yPercent: 110, duration, delay, ease: EASE.hero, stagger, paused: !shown })
      return tween
    },
  })
  const stop = whenVisible([el], () => {
    shown = true
    tween?.play()
  })
  const revert = split.revert.bind(split)
  split.revert = (...args) => {
    stop()
    return revert(...args)
  }
  return split
}

/** Scroll-fill: words go from dim to full, one after another, tied to scroll (single trigger). */
export function fillWords(el, { start = 'clamp(top 80%)', end = 'clamp(bottom 55%)', from = 0.18 } = {}) {
  if (!el) return null
  return SplitText.create(el, {
    type: 'words',
    wordsClass: 'sp-word',
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: from },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
        },
      ),
  })
}
