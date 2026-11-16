import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisContext } from '../context/LenisContext'
import { setLenisInstance } from '../utils/lenis'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    // Smooth scrolling libraries can feel jittery on mobile/touch because native
    // momentum + syncTouch can fight the browser compositor. Keep desktop smooth,
    // but fall back to native scrolling for coarse pointers / touch devices.
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const noHover = window.matchMedia('(hover: none)')
    if (coarsePointer.matches || noHover.matches) return

    const lenis = new Lenis({
      lerp: 0.16,
      duration: 1,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.1,
      // Driven by GSAP's ticker below, so scroll position and ScrollTrigger update in the same frame.
      autoRaf: false,
      // Prevent overscroll bounce from triggering extra work/layout during inertial scroll.
      overscroll: false,
    })

    lenisRef.current = lenis
    setLenisInstance(lenis)
    document.documentElement.classList.add('lenis-ready')

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    // No catch-up jumps after a slow frame: they read as lag in pinned sections.
    gsap.ticker.lagSmoothing(0)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    const onReducedMotionChange = (event) => {
      if (event.matches) {
        lenis.off('scroll', onScroll)
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenisRef.current = null
        setLenisInstance(null)
      }
    }
    reducedMotion.addEventListener('change', onReducedMotionChange)

    return () => {
      reducedMotion.removeEventListener('change', onReducedMotionChange)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      document.documentElement.classList.remove('lenis-ready')
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
