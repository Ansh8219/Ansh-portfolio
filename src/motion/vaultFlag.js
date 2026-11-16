/**
 * Feature flag for the WebGL vault object.
 *
 * Resolution order (first match wins):
 *   1. ?vault=on | ?vault=off in the URL (also remembered in localStorage for later visits;
 *      ?vault=reset forgets it)
 *   2. a value remembered from a previous visit
 *   3. the build-time default VITE_VAULT_3D ("off" disables, anything else enables)
 *
 * Only ever called inside effects (never during render), so the server render and the first client
 * render are identical and hydration is unaffected.
 */
const STORAGE_KEY = 'nvs-vault'

export function readVaultFlag() {
  try {
    const param = new URLSearchParams(window.location.search).get('vault')
    if (param === 'on' || param === 'off') {
      try {
        localStorage.setItem(STORAGE_KEY, param)
      } catch {
        /* storage unavailable: the URL still decides for this page view */
      }
      return param === 'on'
    }
    if (param === 'reset') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
    } else {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'on' || saved === 'off') return saved === 'on'
    }
  } catch {
    /* fall through to the build-time default */
  }
  return import.meta.env.VITE_VAULT_3D !== 'off'
}

/**
 * Whether this device should load the WebGL scene at all. Phones, touch-first devices, reduced
 * motion and data-saver users get the static SVG visual instead (no three.js download).
 */
export function deviceAllows3D() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 900px)').matches) return false
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches) return false
  const connection = navigator.connection
  if (connection?.saveData) return false
  return true
}
