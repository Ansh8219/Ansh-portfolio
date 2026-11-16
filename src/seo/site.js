/**
 * Central SEO / site configuration (pure data + helpers, no framework imports,
 * so it can be used from the browser bundle, the SSR bundle and Node scripts).
 *
 * The production origin is NOT hard-coded here. It is supplied through the
 * `SITE_URL` environment variable (see `.env.example`) and validated by
 * `normalizeSiteUrl`. Builds fail if it is missing, so a wrong or guessed
 * domain can never end up in canonicals, the sitemap or JSON-LD.
 */

export const SITE_NAME = 'NorthVaultStudios'

/**
 * Business facts used in JSON-LD. Every value below already appears on the
 * live pages in this repo (Footer.jsx, BrandedEmail.jsx, Home.jsx contact
 * section, WhatsAppButton.jsx). Nothing here is invented — if a fact is not in
 * the UI (street address, founding date, rating…) it is deliberately omitted.
 */
export const ORGANIZATION = {
  name: SITE_NAME,
  email: 'hello@northvaultstudios.com',
  telephone: '+918219268903',
  addressLocality: 'Chandigarh',
  addressCountry: 'IN',
  logoPath: '/NorthVaultStudios_icon.png',
  sameAs: [
    'https://www.linkedin.com/company/northvaultstudios/',
    'https://www.instagram.com/northvaultstudios/',
  ],
}

/**
 * Validate and normalise the site origin.
 * Accepts only an http(s) origin (no path/query/hash); strips a trailing slash.
 * @param {string} raw
 * @returns {string} e.g. "https://example.com"
 */
export function normalizeSiteUrl(raw) {
  let url
  try {
    url = new URL(String(raw).trim())
  } catch {
    throw new Error(`SITE_URL is not a valid absolute URL: "${raw}"`)
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL must start with https:// (or http:// for local testing), got "${raw}"`)
  }
  if ((url.pathname !== '/' && url.pathname !== '') || url.search || url.hash) {
    throw new Error(`SITE_URL must be an origin only (no path, query or hash), got "${raw}"`)
  }
  return url.origin
}

/**
 * Absolute URL for a site path. "/" -> "https://example.com/",
 * "/about" -> "https://example.com/about".
 */
export function absoluteUrl(siteUrl, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${clean}`
}
