import { memo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, useIsoLayoutEffect } from '../../motion/signal'

/**
 * Route change wipe: three colour strips cover the new page and slide off, one after another.
 * Transform only. Skipped on first load and under prefers-reduced-motion. The overlay is
 * aria-hidden and never takes pointer events, so navigation is never blocked.
 */
function PageTransition() {
  const { pathname } = useLocation()
  const rootRef = useRef(null)
  const lastPath = useRef(pathname)

  useIsoLayoutEffect(() => {
    if (lastPath.current === pathname) return undefined
    lastPath.current = pathname

    const root = rootRef.current
    if (!root) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const strips = root.querySelectorAll('[data-strip]')
    gsap.set(root, { visibility: 'visible' })
    gsap.set(strips, { yPercent: 0 })
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { visibility: 'hidden' })
      },
    })
    tl.to(strips, { yPercent: -101, duration: 0.85, ease: 'expo.inOut', stagger: { each: 0.1, from: 'end' }, delay: 0.05 })

    return () => {
      tl.kill()
      gsap.set(root, { visibility: 'hidden' })
    }
  }, [pathname])

  return (
    <div ref={rootRef} className="at-wipe" aria-hidden="true">
      <span className="at-wipe__strip at-wipe__strip--accent" data-strip />
      <span className="at-wipe__strip" data-strip />
    </div>
  )
}

export default memo(PageTransition)
