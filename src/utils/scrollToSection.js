import { getLenisInstance } from './lenis'

export function scrollToSection(id, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return

  const lenis = getLenisInstance()
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 1, force: true })
    return
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

/**
 * Click handler for in-page anchors (`<a href="#id">`).
 * Plain left-clicks use the smooth scroller and keep the URL hash in sync;
 * modified or middle clicks fall through to the browser (new tab, copy link, etc.).
 * Returns true when the click was handled.
 */
export function handleAnchorNavigation(event, id, offset = 80) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false
  }
  event.preventDefault()
  scrollToSection(id, offset)
  window.history.replaceState(null, '', id === 'hero' ? window.location.pathname : `#${id}`)
  return true
}
