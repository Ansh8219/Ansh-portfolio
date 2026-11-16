/**
 * Build-time prerender (run by `npm run build` after the client + SSR builds).
 *
 * For every public route it renders the real React app to HTML, injects the
 * per-route SEO <head> tags (title, description, canonical, OG/Twitter, JSON-LD)
 * into the client build's index.html template, and writes a static file:
 *
 *   /          -> dist/index.html
 *   /about     -> dist/about/index.html
 *   /services  -> dist/services/index.html
 *   /contact   -> dist/contact/index.html
 *   (unknown)  -> dist/404.html          (noindex; static hosts serve it with a 404 status)
 *
 * It also writes dist/robots.txt and dist/sitemap.xml from the same route table.
 * The client then *hydrates* this markup (src/main.jsx), so nothing visual changes.
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'
import { normalizeSiteUrl } from '../src/seo/site.js'
import { NOT_FOUND_ROUTE, ROUTES } from '../src/seo/routes.js'
import { buildHeadHtml, buildRobotsTxt, buildSitemapXml } from '../src/seo/head.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const rawSiteUrl = loadEnv('production', root, '').SITE_URL?.trim()
if (!rawSiteUrl) {
  console.error('[prerender] SITE_URL is not set — refusing to generate canonicals/sitemap with a guessed domain.')
  process.exit(1)
}
const siteUrl = normalizeSiteUrl(rawSiteUrl)

const templatePath = path.join(distDir, 'index.html')
const serverEntry = path.join(ssrDir, 'entry-server.js')
if (!existsSync(templatePath) || !existsSync(serverEntry)) {
  console.error('[prerender] Missing dist/index.html or dist-ssr/entry-server.js — run the client and SSR builds first.')
  process.exit(1)
}

const template = await readFile(templatePath, 'utf8')
for (const token of ['<!--seo-head-->', '<!--app-html-->']) {
  if (!template.includes(token)) {
    console.error(`[prerender] Template is missing the ${token} placeholder.`)
    process.exit(1)
  }
}

const { render } = await import(pathToFileURL(serverEntry).href)

// GSAP reveal/animation code uses useLayoutEffect, which React warns about on the server.
// Those effects are intentionally client-only (they just set initial animation states), so
// the warning is expected. Suppress only that one message (and count it); keep all others.
let layoutEffectWarnings = 0
const originalConsoleError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('useLayoutEffect does nothing on the server')) {
    layoutEffectWarnings += 1
    return
  }
  originalConsoleError(...args)
}

function renderPage(meta, urlPath) {
  const appHtml = render(urlPath)
  // Function replacers: the HTML contains "$" sequences that String.replace would treat specially.
  return template
    .replace('<!--seo-head-->', () => buildHeadHtml(meta, siteUrl))
    .replace('<!--app-html-->', () => appHtml)
}

const written = []

for (const route of ROUTES) {
  const html = renderPage(route, route.path)
  const file = route.path === '/' ? 'index.html' : path.join(route.path.slice(1), 'index.html')
  const target = path.join(distDir, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html)
  written.push(path.relative(root, target))
}

// Any path that is not a real route renders the NotFound page; use a path that cannot match.
await writeFile(path.join(distDir, '404.html'), renderPage(NOT_FOUND_ROUTE, '/404'))
written.push('dist/404.html')

await writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(siteUrl))
await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(siteUrl))
written.push('dist/robots.txt', 'dist/sitemap.xml')

// The SSR bundle is only a build intermediate.
await rm(ssrDir, { recursive: true, force: true })

console.error = originalConsoleError
console.log(`[prerender] site url: ${siteUrl}`)
console.log(`[prerender] (suppressed ${layoutEffectWarnings} expected useLayoutEffect-on-server warnings)`)
for (const file of written) console.log(`[prerender] wrote ${file}`)
