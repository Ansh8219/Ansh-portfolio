import { ORGANIZATION, SITE_NAME, absoluteUrl } from './site.js'
import { ROUTES } from './routes.js'
import { getServicePage } from '../content/serviceLanding.js'

/** Escape text for use inside an HTML attribute / text node. */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Canonical URL for a route, or null for the 404 page (it has no canonical). */
export function canonicalFor(meta, siteUrl) {
  return meta.path ? absoluteUrl(siteUrl, meta.path) : null
}

/** Organization + WebSite structured data (@graph). */
export function buildJsonLd(siteUrl) {
  const orgId = `${absoluteUrl(siteUrl, '/')}#organization`
  const siteId = `${absoluteUrl(siteUrl, '/')}#website`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: ORGANIZATION.name,
        url: absoluteUrl(siteUrl, '/'),
        logo: absoluteUrl(siteUrl, ORGANIZATION.logoPath),
        email: ORGANIZATION.email,
        telephone: ORGANIZATION.telephone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: ORGANIZATION.addressLocality,
          addressCountry: ORGANIZATION.addressCountry,
        },
        sameAs: ORGANIZATION.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: absoluteUrl(siteUrl, '/'),
        name: SITE_NAME,
        publisher: { '@id': orgId },
      },
    ],
  }
}

/** Service + FAQPage + BreadcrumbList data for a /services/<slug> page (null for other routes). */
export function buildServiceJsonLd(meta, siteUrl) {
  const page = meta.service ? getServicePage(meta.service) : null
  if (!page) return null
  const url = absoluteUrl(siteUrl, meta.path)
  const orgId = `${absoluteUrl(siteUrl, '/')}#organization`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.name,
        serviceType: page.h1,
        description: page.metaDescription,
        url,
        provider: { '@id': orgId },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(siteUrl, '/') },
          { '@type': 'ListItem', position: 2, name: 'Services', item: absoluteUrl(siteUrl, '/services') },
          { '@type': 'ListItem', position: 3, name: page.name, item: url },
        ],
      },
    ],
  }
}

/** JSON for a <script type="application/ld+json"> — "<" escaped so it can't close the tag. */
function jsonLdScript(siteUrl) {
  const json = JSON.stringify(buildJsonLd(siteUrl)).replace(/</g, '\\u003c')
  return `<script type="application/ld+json" data-seo="jsonld">${json}</script>`
}

/**
 * Every SEO-relevant <head> tag for a route, as an HTML string.
 * Injected at build time into the prerendered page (replaces <!--seo-head-->).
 */
export function buildHeadHtml(meta, siteUrl) {
  const canonical = canonicalFor(meta, siteUrl)
  const ogDescription = meta.ogDescription ?? meta.description
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  ]
  if (meta.noindex) lines.push('<meta name="robots" content="noindex, follow" />')
  if (canonical) lines.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`)
  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`,
  )
  if (canonical) lines.push(`<meta property="og:url" content="${escapeHtml(canonical)}" />`)
  if (siteUrl) {
    const image = `${siteUrl}/og-cover.jpg`
    lines.push(
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="Ansh portfolio, an AI unit illustration with an orange glow" />`,
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    )
  }
  lines.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`,
  )
  lines.push(jsonLdScript(siteUrl))
  const serviceLd = buildServiceJsonLd(meta, siteUrl)
  if (serviceLd) {
    lines.push(`<script type="application/ld+json" data-seo="jsonld-service">${JSON.stringify(serviceLd).replace(/</g, '\\u003c')}</script>`)
  }
  return lines.join('\n    ')
}

/** sitemap.xml — only real public routes, absolute canonical URLs, no duplicates. */
export function buildSitemapXml(siteUrl) {
  const seen = new Set()
  const urls = []
  for (const route of ROUTES) {
    const loc = absoluteUrl(siteUrl, route.path)
    if (seen.has(loc)) continue
    seen.add(loc)
    urls.push(`  <url>\n    <loc>${escapeHtml(loc)}</loc>\n  </url>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

/** robots.txt — allow everything, point to the sitemap. */
export function buildRobotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}\n`
}
