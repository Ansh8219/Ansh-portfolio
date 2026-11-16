/**
 * Single source of truth for per-route SEO metadata.
 * Used by: the SSR prerender (head tags), the sitemap generator, and the
 * client-side <SeoManager/> that keeps <head> in sync during navigation.
 *
 * `ROUTES` lists ONLY real, indexable pages. The 404 page is separate so it
 * can never leak into the sitemap.
 */

import { SERVICE_PAGES } from '../content/serviceLanding.js'

export const ROUTES = [
  {
    path: '/',
    key: 'home',
    title: 'NorthVaultStudios | Digital Engineering & AI Solutions Studio',
    description:
      'Digital engineering and AI solutions studio. AI agents and RAG, software, web and mobile, cloud and DevOps, data and QA, plus brand and marketing.',
    ogDescription:
      'Digital engineering and AI solutions studio. We engineer what’s next.',
  },
  {
    path: '/about',
    key: 'about',
    title: 'About the Studio | NorthVaultStudios',
    description:
      'A multidisciplinary team of developers and creative professionals building AI and software products end to end, with brand and marketing under one roof.',
  },
  {
    path: '/approach',
    key: 'approach',
    title: 'Our Approach | NorthVaultStudios',
    description:
      'How a project runs with NorthVault Studios: listen, plan, design, build and launch, with one team from the first conversation to support after launch.',
  },
  {
    path: '/work',
    key: 'work',
    title: 'Our Work | NorthVaultStudios',
    description:
      'Selected work from NorthVault Studios: Befit, Dawat, Unifeast, Vyro and Bookyahook, with the apps, admin panels and backends behind them.',
  },
  {
    path: '/services',
    key: 'services',
    title: 'Our Services | NorthVaultStudios',
    description:
      'AI agents and intelligent systems, product engineering, web and mobile, cloud and DevOps, data and QA, brand, marketing and social media.',
  },
  {
    path: '/contact',
    key: 'contact',
    title: 'Contact | NorthVaultStudios',
    description:
      'Talk to NorthVault Studios about your product, brand or growth goals. Reply within 24 hours. NDA on request. Based in Chandigarh, India.',
  },
  ...SERVICE_PAGES.map((page) => ({
    path: `/services/${page.slug}`,
    key: `service-${page.key}`,
    title: page.metaTitle,
    description: page.metaDescription,
    service: page.slug,
  })),
  {
    path: '/privacy',
    key: 'privacy',
    title: 'Privacy Policy | NorthVaultStudios',
    description: 'What NorthVault Studios collects through this website, how it is used and how to ask us to change or delete it.',
  },
  {
    path: '/terms',
    key: 'terms',
    title: 'Terms of Use | NorthVaultStudios',
    description: 'The terms for using the NorthVault Studios website.',
  },
]

export const NOT_FOUND_ROUTE = {
  path: null,
  key: 'not-found',
  title: 'Page Not Found | NorthVaultStudios',
  description: 'The page you were looking for could not be found.',
  noindex: true,
}

/** Normalise "/about/" -> "/about" (but keep "/"). */
export function normalizePath(pathname = '/') {
  const withoutQuery = String(pathname).split(/[?#]/)[0] || '/'
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.replace(/\/+$/, '') || '/'
  }
  return withoutQuery
}

/** Metadata for a pathname; unknown paths get the noindex 404 metadata. */
export function getRouteMeta(pathname) {
  const path = normalizePath(pathname)
  return ROUTES.find((route) => route.path === path) ?? NOT_FOUND_ROUTE
}
