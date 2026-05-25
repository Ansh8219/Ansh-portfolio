import { useEffect, useRef } from 'react'

// Throttle function to limit scroll handler execution
const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const useScrollVisibility = () => {
  const sectionsRef = useRef([])

  useEffect(() => {
    // Cache section elements once
    sectionsRef.current = document.querySelectorAll('section')
    
    const handleScroll = throttle(() => {
      const sections = sectionsRef.current
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      sections.forEach((section, index) => {
        // First section (hero) is always visible
        if (index === 0) {
          section.classList.add('visible')
          return
        }

        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        
        // Only show section when it's scrolled past the hero (100vh) and actually in viewport
        // Require at least 50% of section to be in viewport before showing
        const viewportThreshold = windowHeight * 0.5
        
        if (scrollY + viewportThreshold >= sectionTop && scrollY < sectionTop + sectionHeight) {
          section.classList.add('visible')
        } else if (scrollY < windowHeight) {
          // If scrolled back to top, hide all sections except hero
          section.classList.remove('visible')
        }
      })
    }, 16) // ~60fps throttling

    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
