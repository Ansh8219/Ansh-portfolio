/**
 * The intro splash plays on every full page load / refresh (not on in-app route changes: it is mounted once).
 * `introWillPlay()` is decided once and cached, so the hero can delay its own entrance until the splash is done.
 * Reduced-motion visitors skip it.
 */
export const INTRO_MS = 1900 // ms until the doors start to open (the 'open' label in components/IntroSplash.jsx)
let decided = null

export function introWillPlay() {
  if (decided !== null) return decided
  if (typeof window === 'undefined') return false
  decided = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return decided
}
