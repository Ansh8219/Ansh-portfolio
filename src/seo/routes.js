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
    title: 'Ansh | Full Stack, AI & DevOps Engineer',
    description:
      'Portfolio of Ansh, a full stack, AI and DevOps engineer with 4+ years of experience: system architecture, Python backends (Django, FastAPI), React, Flutter and cloud infrastructure.',
    ogDescription:
      'Full stack, AI and DevOps engineer. I engineer what’s next.',
  },
  {
    path: '/about',
    key: 'about',
    title: 'About Ansh | Full Stack, AI & DevOps Engineer',
    description:
      'Ansh is a full stack, AI and DevOps engineer with 4+ years of experience building software products end to end.',
  },
  {
    path: '/approach',
    key: 'approach',
    title: 'My Approach | Ansh',
    description:
      'How a project runs with Ansh: listen, plan, design, build and launch, with one engineer from the first conversation to support after launch.',
  },
  {
    path: '/work',
    key: 'work',
    title: 'Work | Ansh',
    description:
      'Selected work by Ansh: Befit, Dawat, Unifeast, Vyro and Bookyahook, with the apps, admin panels and backends behind them.',
  },
  {
    path: '/services',
    key: 'services',
    title: 'Expertise | Ansh',
    description:
      'AI development, system architecture, Python backends, React and Flutter apps, cloud and DevOps, and full stack product delivery.',
  },
  {
    path: '/contact',
    key: 'contact',
    title: 'Contact | Ansh',
    description:
      'Talk to Ansh about your product, backend, app or infrastructure. Email ansh.dev721@gmail.com or call +91 8219698580. NDA on request.',
  },
  {
    path: '/resume',
    key: 'resume',
    title: 'Resume | Ansh, Full Stack, AI & DevOps Engineer',
    description:
      'Resume of Ansh: 4+ years of experience in system architecture, Python backends (Django, FastAPI), React, Flutter, AI and cloud DevOps. Skills, experience and selected projects.',
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
    title: 'Privacy Policy | Ansh',
    description: 'What Ansh collects through this website, how it is used and how to ask for it to be changed or delete it.',
  },
  {
    path: '/terms',
    key: 'terms',
    title: 'Terms of Use | Ansh',
    description: 'The terms for using the Ansh website.',
  },
]

export const NOT_FOUND_ROUTE = {
  path: null,
  key: 'not-found',
  title: 'Page Not Found | Ansh',
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
