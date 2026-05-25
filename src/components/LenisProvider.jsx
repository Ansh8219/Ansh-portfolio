import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { LenisContext } from '../context/LenisContext'
import { setLenisInstance } from '../utils/lenis'

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const lenis = new Lenis({
      lerp: 0.14,
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.1,
      autoRaf: true,
      overscroll: true,
    })

    lenisRef.current = lenis
    setLenisInstance(lenis)
    document.documentElement.classList.add('lenis-ready')

    const onReducedMotionChange = (event) => {
      if (event.matches) {
        lenis.destroy()
        lenisRef.current = null
        setLenisInstance(null)
      }
    }
    reducedMotion.addEventListener('change', onReducedMotionChange)

    return () => {
      reducedMotion.removeEventListener('change', onReducedMotionChange)
      document.documentElement.classList.remove('lenis-ready')
      lenis.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
