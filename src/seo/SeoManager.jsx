import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_NAME } from './site.js'
import { getRouteMeta } from './routes.js'
import { canonicalFor } from './head.js'

/* eslint-disable no-undef */
// Injected by vite.config.js (`define`). Empty during `vite dev` when SITE_URL is unset.
const CONFIGURED_SITE_URL = typeof __SITE_URL__ === 'string' ? __SITE_URL__ : ''
/* eslint-enable no-undef */

function upsert(selector, create, setAttrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  setAttrs(el)
}

function setMeta(attr, key, content) {
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement('meta')
      el.setAttribute(attr, key)
      return el
    },
    (el) => el.setAttribute('content', content),
  )
}

function removeMeta(attr, key) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove()
}

/**
 * Keep <head> in sync with the current route during client-side navigation.
 * On first load this is a no-op in practice: the prerendered HTML already
 * contains identical tags. In `vite dev` (no prerender) it creates them.
 */
function applySeo(meta, siteUrl) {
  const canonical = canonicalFor(meta, siteUrl)
  const ogDescription = meta.ogDescription ?? meta.description

  document.title = meta.title
  setMeta('name', 'description', meta.description)

  if (meta.noindex) setMeta('name', 'robots', 'noindex, follow')
  else removeMeta('name', 'robots')

  if (canonical) {
    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      },
      (el) => el.setAttribute('href', canonical),
    )
    setMeta('property', 'og:url', canonical)
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove()
    removeMeta('property', 'og:url')
  }

  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:title', meta.title)
  setMeta('property', 'og:description', ogDescription)
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', meta.title)
  setMeta('name', 'twitter:description', ogDescription)
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const siteUrl = CONFIGURED_SITE_URL || window.location.origin
    applySeo(getRouteMeta(pathname), siteUrl)
  }, [pathname])

  return null
}
