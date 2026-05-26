import { getLenisInstance } from './lenis'

export function scrollToSection(id, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return

  const lenis = getLenisInstance()
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 1 })
    return
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
