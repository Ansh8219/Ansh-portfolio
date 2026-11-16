# Phase 1 Implementation Report — Indexable Rendering, Routing & SEO Foundation

- **Scope:** local codebase only (`website-refresh-new-images`). Nothing was deployed, no assets were deleted, testimonials and business claims were not touched.
- **Date:** 2026-11-13
- **Based on:** [LOCAL_SEO_AUDIT.md](LOCAL_SEO_AUDIT.md) — findings C1, C2, H1, H2, H3, H4 (partly), M8.

---

## 0. Read this first

### 0.1 You must set `SITE_URL` before building
There is no verified production domain anywhere in the repo (the only hint is the email address `hello@northvaultstudios.com`), so **none is assumed**. `npm run build` now **fails with a clear message** unless `SITE_URL` is set to the production origin:

```bash
SITE_URL=https://<your-verified-domain> npm run build
```

Set it in the host's environment settings (or in `.env.production.local`, which `.gitignore` already covers). See `.env.example`. A plain `vite build` also refuses to run without it. `npm run dev` and `npm run preview` do not need it.

### 0.2 A second editor was working in the same working tree
While I worked, another process changed files in this repo and rebuilt the shared `dist/` (with `SITE_URL=https://example.com`):
- `Home.jsx`, `Navbar.jsx`, `scrollToSection.js`, `index.css`, `ErrorBoundary.jsx`, `CustomCursor.jsx`, `ToggleTheme.jsx`, `FeaturedWorkCarousel.jsx`, `ResponsivePicture.jsx`, `TestimonialsMarquee.jsx`, `About/Contact/Services.jsx`, plus new `DecorativeVideo.jsx`, `useContactForm.js` and `ACCESSIBILITY_FIX_REPORT.md` (an accessibility pass).

I did **not** revert or overwrite any of it. Where I needed the same file (`Navbar.jsx`, `App.jsx`, `index.html`, `ThemeContext.jsx`) I re-read it first and built on top of their changes with targeted edits. Their `handleAnchorNavigation` helper, mobile-menu keyboard/ARIA handling, skip link, `theme-color` meta and hero-CTA anchors are all preserved and verified working.

**The `dist/` currently in the repo is that other session's build (`example.com`). Do not deploy it.** Rebuild with the real `SITE_URL`.

Because of the shared-`dist` collisions, my final verification ran on an **isolated snapshot copy** of the working tree (same sources, same `npm run build`). See section 4.

---

## 1. What was implemented

| # | Requirement | Result |
|---|---|---|
| 1 | Meaningful content + H1 in initial HTML | Every route is prerendered to static HTML at build time. Raw HTML (no JS) has the H1, `<main>` content, nav links, head tags and JSON-LD. Home: 1,996 words in raw HTML (was an empty `<div id="root">`). |
| 1 | Splash no longer blocks rendering | Page content always renders; the splash is a full-screen overlay on top, and the page fades in when it exits. Same sequence and timing as before. |
| 2 | Routes `/`, `/about`, `/services`, `/contact` | Real React Router routes; each is a real static file (`about/index.html`, …). |
| 2 | Semantic anchor navigation | Header, mobile menu and logo are real `<a href>` (router `<Link>`). Hero CTAs are real `#anchor` links (the other session's change, kept). |
| 2 | 404 page | `NotFound` page; prerendered to `dist/404.html` with `noindex`; static hosts serve it with HTTP 404. |
| 3 | `robots.txt` | Generated at build: `User-agent: * / Allow: /` + absolute `Sitemap:` line. |
| 4 | `sitemap.xml` | Generated from the same route table: 4 public routes, absolute canonical URLs, no duplicates, no 404/utility URLs. |
| 5 | Canonicals | One unique `<link rel="canonical">` per page (+ `og:url`). The 404 page has none. Origin comes from one place (`SITE_URL`). |
| 6 | JSON-LD | `Organization` + `WebSite` in a single `@graph` on every page. |

---

## 2. Changed files

### 2.1 New files
| File | Purpose |
|---|---|
| `src/seo/site.js` | Central config: site name, organization facts, `normalizeSiteUrl` (validates the origin), `absoluteUrl`. No domain hard-coded. |
| `src/seo/routes.js` | **Single source of truth** for route paths, titles, descriptions, the 404 meta. Drives head tags, sitemap and client updates. |
| `src/seo/head.js` | Builds head HTML (title, description, canonical, OG, Twitter, JSON-LD), `sitemap.xml`, `robots.txt`. |
| `src/seo/SeoManager.jsx` | Keeps `<head>` in sync on client-side navigation (title, description, canonical, og:*, twitter:*, noindex). |
| `src/entry-server.jsx` | SSR entry (`renderToString` + `StaticRouter`), used only at build time. |
| `src/pages/NotFound.jsx` | 404 page in the existing visual style (single H1, links home/services/contact). |
| `scripts/prerender.mjs` | Post-build step: renders each route, injects head tags, writes HTML files, `robots.txt`, `sitemap.xml`; removes the SSR intermediate. |
| `.env.example` | Documents `SITE_URL`. |
| `PHASE_1_IMPLEMENTATION_REPORT.md` | This report. |

### 2.2 Modified files (mine)
| File | Change |
|---|---|
| `package.json` | `build` = client build → SSR build → prerender. No new dependencies. |
| `vite.config.js` | Requires/validates `SITE_URL` for builds; exposes it as `__SITE_URL__`; SSR bundle config (`ssr.noExternal`); `manualChunks` only for the client build. Existing options kept. |
| `index.html` | Per-page tags removed and replaced by a `<!--seo-head-->` placeholder; `#root` holds `<!--app-html-->`; `<noscript>` style so no-JS visitors aren't stuck behind the splash. Fonts, preloads, `theme-color`, keywords, author unchanged. |
| `src/main.jsx` | `BrowserRouter`; `hydrateRoot` when prerendered markup exists, `createRoot` otherwise (dev). |
| `src/App.jsx` | Routes + `SeoManager`; content always mounted, splash as overlay; route-change scroll handling (`RouteScroll`: top on navigation, smooth scroll to `#hash`, retry after layout settles). Kept the other session's skip link. |
| `src/components/Navbar.jsx` | Links now point at real routes via `<Link>`; scroll-spy highlight kept on the home page, `aria-current` = `location` on home / `page` elsewhere; in-page scroll for the logo and "Work" when already on `/`; modified/middle clicks fall through to the browser. Kept all of the other session's keyboard/ARIA work. |
| `src/hooks/useActiveSection.js` | Optional `resetKey` so the observer re-binds per route. |
| `src/context/ThemeContext.jsx` | Starts as `dark` and applies the saved theme before first paint (hydration-safe); persists only on toggle; storage access wrapped in try/catch. Kept the other session's `theme-color` update. |
| `src/hooks/useMediaQuery.js` | Rewritten with `useSyncExternalStore` + server snapshot `false` (see 3.5). |
| `src/components/IntroSplash.jsx` | Reduced-motion branch applies after hydration (see 3.6). |
| `src/components/HeroContent.jsx` | Added `{' '}` between the two H1 spans so text extraction reads "Your Vision, Our Expertise." (was "Your Vision,Our Expertise."). Not visible. |
| `src/components/lightswind/trusted-users.tsx` | `<p>` → `<div>` (invalid `<div>`-in-`<p>` broke hydration) and colour set to `text-primary` to keep the exact original look (see 3.7). |
| `README.md` | Documents `SITE_URL` and the prerender build. |

---

## 3. Implementation decisions

1. **Build-time prerender, no framework migration.** Vite + React 18 + `react-router-dom` were already in place. Adding `react-dom/server` rendering in a small post-build script is the least disruptive route: no Next/Astro migration, no new dependency, no runtime server. Output is static files that work on any static host.
2. **Hydrate, don't replace.** The client hydrates the prerendered markup, so there is no content flash and the existing GSAP/Framer animations run exactly as before (their initial hidden states are applied client-side, under the splash).
3. **Splash as overlay, not a gate.** The splash is in the HTML too, so visitors see it before JS loads; content sits underneath with opacity 0 until the splash exits (then the original 0.55s fade). Crawlers see all content in the DOM. A `<noscript>` rule hides the splash for no-JS visitors.
4. **One metadata table drives everything.** `src/seo/routes.js` feeds head tags, sitemap and client updates, so canonical, sitemap and page can't drift apart. Route lists never include the 404.
5. **`SITE_URL` is required, never defaulted.** A wrong domain in canonicals/sitemap is worse than a failed build. It is validated (http(s) origin only, no path/query/hash).
6. **JSON-LD uses only facts already shown on the site:** name `NorthVaultStudios`, email `hello@northvaultstudios.com`, phone `+918219268903`, `addressLocality: Chandigarh`, `addressCountry: IN`, LinkedIn + Instagram `sameAs`, and the existing `NorthVaultStudios_icon.png` (500×500 brand mark) as `logo`. Not included: street address, founding date, ratings, reviews, description, opening hours. The Instagram `sameAs` is the clean profile URL (the tracking parameters from the footer link were dropped).
7. **Titles/descriptions.** Home keeps its existing title/description verbatim. The three new pages got unique ones written from their on-page copy (no new claims). Rewriting the home messaging is Phase 2 (audit M1).
8. **Nav destinations.** Services/About/Contact go to their routes. "Work" has no page, so it deep-links to `/#work`. On the home page the nav still scroll-spies the sections.
9. **Hydration-safety fixes were needed.** Prerendering exposed server/client differences that were invisible in a client-only app (3.5–3.7 below). Fixed at the root, with the smallest possible edits.
10. **Hosting-neutral.** No `vercel.json`/`netlify.toml` was added because the host isn't confirmed.

### 3.5 `useMediaQuery` (affects every phone visitor)
`ServicesShowcase` and others choose different markup for `max-width: 767px`. The server can't know the viewport, so phones would have mismatched on the home page. The hook now returns `false` for the server/hydration render and the real value immediately after (client-side navigations read the real value on first render — no flicker).

### 3.6 `IntroSplash` reduced motion
Server markup is the full-motion splash; a reduced-motion visitor's first client render took a different branch → structural hydration mismatch. The preference now applies right after hydration.

### 3.7 `TrustedUsers`
`CountUp` renders a `<div>` inside a `<p>`: invalid HTML, and browsers close the `<p>` early, so the server DOM differs from React's tree. Changed to `<div>`. A global rule `.hero-readable p { color: var(--text-primary) }` had been brightening that line, so the colour is now set explicitly to the same value; the component is only used in the hero.

---

## 4. Tests

**Environment:** isolated snapshot of the working tree built with `npm run build` (both normal production mode and a development-React build for hydration diagnostics), `SITE_URL=https://nvs-test.invalid` (deliberately fake). Served by a small static-host emulator (real files only, `/x` → `x/index.html`, otherwise `404.html` with HTTP 404) — `vite preview` can't be used for 404 checks because it falls back to `index.html`. Headless Chromium via Playwright; raw HTML fetched without JS. An unmodified build of `HEAD` was used as the visual baseline.

| Area | Result |
|---|---|
| `npm run build` without `SITE_URL` | **Fails fast** with an explanatory message; no output written. |
| `npm run build` with `SITE_URL` | **Passes** — 7 files written (4 routes, `404.html`, `robots.txt`, `sitemap.xml`). |
| Raw HTML, 4 routes (no JS) | Exactly one `<h1>`, `<main>` content, unique title, description, one canonical = own URL, `og:url` = canonical, Twitter tags, no `noindex`, valid JSON-LD (Organization + WebSite, absolute URLs), no template placeholders left. |
| `robots.txt` | `200 text/plain`, not HTML, valid directives, absolute `Sitemap:` line. |
| `sitemap.xml` | `200 application/xml`, not HTML; exactly the 4 routes, absolute, no duplicates; every `<loc>` equals that page's canonical; no 404/robots URLs. |
| Unknown URLs (`/nope`, `/about/x`, `/robots`, `/sitemap`, `/sitemap.xml.bak`, `/index.php`, `/services/website-development`) | All **HTTP 404**, Not Found page with one H1, `noindex`, no canonical, no sitemap/robots content. |
| Navigation links | Header has real hrefs `/`, `/services`, `/#work`, `/about`, `/contact`; mobile menu same. Click-through: URL, title, canonical and single H1 update; `aria-current` correct; scroll resets to top; Back/Forward work; "Work" scrolls to `#work` on home and from `/about`; Ctrl+click opens the real URL in a new tab; mobile tap navigates and closes the menu. |
| Hydration/console | **0 warnings/errors** with the development React runtime across 5 routes × 3 viewports (1440 / 820 / 375). Also 0 in a production build. |
| Light theme visitor | Saved `light` applied after hydration and **not overwritten**; no hydration warnings. |
| JS disabled | Splash hidden, content and H1 visible. |
| Mobile 375px | No horizontal overflow on any of the 4 routes. |
| Visual vs original `HEAD` | After the splash, desktop hero is **pixel-identical** (0 differing pixels) and mobile 0.07% (218 px), with video regions hidden in both so the other session's video changes don't confound it. Splash look is identical (layout, colours, type); only the animation phase differs. |

**Counts:** raw-HTML/SEO suite 89/90; browser suite 61/61; hydration matrix 15/15 clean (normal motion).
**The one miss:** `/contact` has 77 words in `<main>` against a threshold I set myself (80). It's a genuine, short contact page (form + details), not a rendering fault. Thin-content treatment is a content decision for Phase 2.

I also ran `npm run build` directly in the repo early on (all 7 files written); that output was subsequently overwritten by the other session's build, which is why the final verification used a snapshot.

---

## 5. Remaining issues

**Before deploying**
- Set `SITE_URL` (0.1). Rebuild — the repo's `dist/` is stale (0.2).
- **Confirm the host serves `about/index.html` at `/about` (no redirect to `/about/`) and serves `404.html` with status 404.** Most static hosts do; some need a setting (e.g. Vercel `cleanUrls`/`trailingSlash: false`). I didn't add host config because the host isn't verified. If the host redirects to trailing slashes, the canonical (`/about`) would conflict — check after the first deploy.
- Run the same checks on the real domain once live (robots, sitemap, canonicals, 404 status). Submit the sitemap in Search Console.

**Known, intentionally out of Phase 1**
- `og:image` / `twitter:image` still missing, so large-image cards won't render (audit M2).
- Home title/description are unchanged from before (audit M1). Content images still have `alt=""` (H6). No footer link list (the header nav carries the internal links). Page weight / video / image optimisation (H5), unused asset cleanup (M4), placeholder testimonials (M5) — untouched, as instructed.
- Contact forms still don't send anywhere (audit M7); the other session appears to be working on `useContactForm.js`.
- Desktop layouts render only the active service's text in the DOM (audit M3), so the prerendered desktop HTML lists one service in detail.
- `/services` partly repeats the home page's services content; `/about` and `/contact` are short. Dedicated per-service pages remain a Phase 2+ opportunity.
- `sitemap.xml` has no `lastmod` (none is tracked; I didn't invent one).
- A light-theme visitor sees the dark splash for a few frames before JS applies their theme (an inline theme script would fix it — audit L3).
- Footer's `new Date().getFullYear()` could cause a one-time text mismatch only if a visitor loads a build across New Year.

**Noticed, not changed**
- `DecorativeVideo.jsx` (other session): for reduced-motion visitors React logs a dev-only "Extra attributes from the server: autoplay" warning. It's attribute-only, not structural; the same post-hydration gating used in `IntroSplash` would silence it.
- Existing dev warning: `fetchPriority` should be lowercase `fetchpriority` for React 18 (`ResponsivePicture.jsx`, `trusted-users.tsx`).
- React Router prints v7 "future flag" notices in dev; enabling `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` on both routers would silence them.
- `npm run preview` falls back to `index.html` for unknown URLs (unlike a real host); documented in the README.

---

## 6. How to reproduce

```bash
SITE_URL=https://example.test npm run build   # use a throwaway origin for local checks
ls dist dist/about                            # index.html, about/, services/, contact/, 404.html, robots.txt, sitemap.xml
grep -o '<h1[^>]*>.*</h1>' dist/about/index.html | head -1
grep -o 'rel="canonical" href="[^"]*"' dist/*/index.html dist/index.html
cat dist/robots.txt dist/sitemap.xml
```

For 404 behaviour use a static host (or an emulator that returns `404.html` with status 404), not `npm run preview`.
