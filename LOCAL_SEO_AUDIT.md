# NorthVault Studios — Local Codebase SEO Audit

- **Scope:** the local working tree on branch `website-refresh-new-images` (clean at `c87df36`). Production was not audited and is not assumed to match.
- **Method:** static review of `index.html`, `src/`, `public/` and the configs, plus a production build (`vite build`, output written outside the repo) served with `vite preview` and inspected in headless Chromium at 1440px and 375px. The Vite dev server was not used. The audit measured the same bundle that would ship.
- **Date:** 2026-11-13
- **Files modified:** none, except creating this report. Nothing was deployed.

**Caveat on hosting:** the repo has no `vercel.json`, `netlify.toml` or `_redirects`. `@vercel/speed-insights` suggests Vercel hosting, but that is an inference. Items marked *(host-dependent)* behave differently depending on where the site is served. The canonical domain is not in the code. This report assumes `https://northvaultstudios.com`, based on the contact email `hello@northvaultstudios.com`. Please confirm.

---

## 1. Executive summary

The site is a **single-page, client-rendered React app with one URL (`/`)**. Nearly all SEO signals are missing or weak:

- The raw HTML contains no content. Content appears only after JavaScript runs **and** a 1.5s intro splash finishes.
- There is no `robots.txt`, no `sitemap.xml`, no canonical tag, no JSON-LD and no `og:image`.
- Three finished pages (`About`, `Services`, `Contact`) exist in `src/pages/` but are **not routed**. `react-router-dom` is installed and unused.
- The nav uses `<button>` elements, so the rendered home page has **zero internal links**.
- First load transfers about **10.2 MB**. Of that, 6 MB is video and 4.1 MB is images.

The visible home-page copy is only about 200 words. It is well structured (one `<h1>`, sensible `<h2>` sections) but thin for search.

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 6 |
| Medium | 8 |
| Low | 7 |

---

## 2. Findings

### CRITICAL

#### C1. No server-visible content (client-only rendering) plus a delayed mount
- **Files:** `index.html:41-42`, `src/main.jsx`, `src/App.jsx:23-39`, `src/components/IntroSplash.jsx` (`SPLASH_MS = 1500`)
- **Evidence:**
  - Raw HTML body is `<div id="root"></div>` plus a script tag, with no `<noscript>` fallback.
  - `App.jsx` renders `<main>` only when `introComplete` is true, which happens after the splash exits.
  - In the browser at DOMContentLoaded plus 0.4s, `<main>` and `<h1>` were absent and the page had 44 characters of text (the splash).
  - Content only appears after about 1.9s or more.
- **Impact:**
  - Crawlers that do not execute JavaScript see an empty page. That includes most AI crawlers and link-preview bots.
  - Googlebot renders JavaScript, but indexing is delayed and the result is fragile.
  - The 1.5s mount delay adds directly to the time before any content is painted.
- **Fix:**
  1. Prerender or statically generate the routes at build time. Options are `vite-ssg`, `vite-plugin-prerender`, `react-snap`, or moving to Next.js or Astro.
  2. Render `<main>` immediately and show the splash as an **overlay** that unmounts after 1.5s. Do not gate the content behind it.
  3. Add a `<noscript>` block with the H1 and a short summary.

#### C2. `robots.txt` and `sitemap.xml` do not exist, and unknown URLs return 200 *(host-dependent)*
- **Files:** `public/` (neither file present), no hosting config
- **Evidence:** against the local preview server, `/robots.txt`, `/sitemap.xml`, `/about`, `/nonexistent` and a missing `.webp` all returned `200 text/html`, which is the SPA shell. Crawlers would read HTML where they expect directives, and every junk URL is a soft-200.
- **Impact:** no crawl directives, no sitemap discovery, and potential duplicate or soft-404 indexing of arbitrary paths.
- **Fix:**
  1. Add `public/robots.txt`:
     ```
     User-agent: *
     Allow: /
     Sitemap: https://northvaultstudios.com/sitemap.xml
     ```
  2. Add `public/sitemap.xml` listing the real indexable URLs, with `lastmod`.
  3. Add a real 404 route and make sure the host returns HTTP 404 for it.
  4. If on Vercel, static files in `public/` are served before rewrites, so adding the files is enough.

---

### HIGH

#### H1. Only one URL. `About`, `Services` and `Contact` are orphaned and unrouted
- **Files:** `src/App.jsx:12,30-37` (renders `<Home />` only), `src/pages/{About,Services,Contact}.jsx`, `package.json` (`react-router-dom`), `README.md` (documents `/services`, `/about` and `/contact`, which do not exist)
- **Evidence:**
  - `Services.jsx:2,152` uses `<Link to="/contact">`, which would throw without a `<Router>`.
  - `Contact.jsx` ends in `alert(...)` with a `TODO`.
  - Anchor sections (`#services`, `#work`) are not separate URLs.
- **Impact:** the site can rank for one page only. There are no dedicated pages for "web development", "mobile app development" and so on. Those are the highest-intent queries for the six listed services.
- **Fix:** adopt `BrowserRouter` and prerendered routes (see C1). Suggested structure:
  - `/`
  - `/services/` plus one page per service (`/services/website-development/`, `/services/mobile-app-development/`, `/services/ui-ux-design/`, `/services/cloud-it-solutions/`, `/services/marketing-branding/`, `/services/social-media-management/`)
  - `/work/` and `/work/<project>/`
  - `/about/`
  - `/contact/`
- Decide on trailing-slash policy and apply it consistently.
- Decide whether `About`, `Services` and `Contact` are meant to be revived, or deleted so they stop drifting from `Home.jsx`. They duplicate the service data already in `Home.jsx` (`SERVICES`).

#### H2. No canonical URL or `og:url`
- **Files:** `index.html`
- **Fix:** add a per-route `<link rel="canonical" href="https://northvaultstudios.com/...">`. Use `react-helmet-async` or prerender-time injection so each route gets its own. Add a matching `og:url`.

#### H3. No structured data (JSON-LD)
- **Files:** none. A scan of `index.html` and `src/` found no JSON-LD.
- **Fix:** add:
  - `Organization` or `ProfessionalService`, with `name`, `url`, `logo`, `email`, `telephone` (+91 8219268903), `address` (Chandigarh, India), and `sameAs` (the LinkedIn and Instagram URLs already in `Footer.jsx`).
  - `WebSite`.
  - `Service` markup on the service pages.
  - `BreadcrumbList` on the inner pages.
- Do **not** add `Review` or `AggregateRating` markup based on the current testimonials (see M5).
- Do not add `FAQPage` markup for Google benefit. Google retired FAQ rich results in May 2026.
- Add a full street address if a public one exists. `ProfessionalService` or `LocalBusiness` is stronger with it.

#### H4. Nav and CTAs are `<button>`s, so there are no crawlable internal links
- **Files:** `src/components/Navbar.jsx:109-114,131-141,163-175`, `Home.jsx:743-762`
- **Evidence:** the rendered DOM's `<a href>` list contained only `mailto:`, `tel:`, LinkedIn, Instagram and `wa.me`. There were no internal links. The logo is also a button.
- **Fix:** once routes exist, use `<Link to>` or `<a href>` for nav, logo, footer and CTAs. Keep the smooth-scroll behaviour for same-page sections by using `<a href="#services">` with a click handler. Add a footer link list covering the services and key pages.

#### H5. Page weight and render-blocking assets
- **Evidence (desktop, local production build):**
  - About **10.2 MB** transferred on first load across 33 requests.
  - Images **4.1 MB**, media **5.96 MB**, fonts 0.17 MB.
- **Biggest items:**

  | File | Size | Note |
  |---|---|---|
  | `updated/who-we-are.mp4` | 4.4 MB | `preload="metadata"`, yet it downloaded in full on load because it is autoplay |
  | `updated/hero-character.png` | 2.0 MB | video poster and `<link rel=preload>`, still a PNG |
  | hero video (`Man_breathing_...mp4`) | 1.5 MB | `preload="auto"` |
  | `updated/hero-character-light.png` | 0.97 MB | preloaded but unused in the dark theme (browser warned) |

- **Files:** `index.html:30-33`, `src/pages/Home.jsx:310-319,784-794`, `src/App.jsx:21-23`
- **Impact:** poor LCP and mobile data cost. LCP is a ranking signal via Core Web Vitals.
- **Fix:**
  1. Convert `hero-character*.png` and `who-we-are.png` to WebP or AVIF at the displayed size. A reduction of 80% or more is typical.
  2. Set `preload="none"` on the `who-we-are` video and load it when it nears the viewport. Compress the MP4s and consider a poster image.
  3. Preload only the actual LCP image. Remove the preloads for `hero-character-light.png`, `homePageImage.webp` and `websitedev_icon.webp`.
  4. Use `srcset` and `sizes` properly. `ResponsivePicture.jsx` accepts `sizes` but never emits a `srcset`, so `sizes` does nothing.
  5. Consider not autoplaying the hero video on mobile or when `prefers-reduced-data` is set.

#### H6. Content images have empty `alt`
- **Files:** `FeaturedWorkCarousel.jsx:82,115`, `ServicesBento.jsx:63,161`, `ServicesShowcase.jsx:108,553`, `lightswind/trusted-users.tsx:36`
- **Evidence:** all 15 `<img>` elements on the home page render with `alt=""`.
- **Impact:** the service and project images carry meaning (project screenshots, service illustrations) and are lost to image search and accessibility tools. Decorative images may keep `alt=""`.
- **Fix:** give the project and service images descriptive `alt` text (for example "Befit sports booking app dashboard on mobile"). Avatar images can stay empty if they remain decorative. Also note the hero `<video>` has no accessible name, but it is correctly `aria-hidden`. The `who-we-are` video has an `aria-label`, which is good.

---

### MEDIUM

#### M1. Title and description are generic and the description is too long
- **Files:** `index.html:9,23`
- **Evidence:**
  - Title is "NorthVaultStudios - Shaping the Future of Digital Experiences" (about 62 characters). It is brand-heavy with no service or location keyword.
  - Description is about 175 characters, which will be truncated in results (aim for about 150-160).
  - The same title and description would apply to every future route.
- **Fix:** for example, title "Web, App & Branding Studio in Chandigarh | NorthVaultStudios" and a description of about 150 characters naming the services. Write a unique pair per route. Set them per route (Helmet or prerender). The brand is spelled "NorthVaultStudios" in meta tags and "NorthVault Studios" elsewhere, so pick one form for the structured data `name`.

#### M2. Open Graph and Twitter metadata incomplete
- **Files:** `index.html:12-20`
- **Evidence:** there is no `og:image`, `og:url`, `og:locale` or `twitter:image`. `twitter:card` is `summary_large_image`, but with no image the card will not render properly. The tags are also written as `property="twitter:..."` where `name="twitter:..."` is the standard.
- **Fix:** add a 1200x630 share image and reference it in both sets. Add `og:url`, `og:locale` (`en_IN`) and `twitter:image:alt`. Switch the Twitter tags to `name=`. Make these per route.

#### M3. Heading structure is sound but can be improved
- **Files:** `HeroContent.jsx:32`, `HandwriteAccent.jsx` (`as="h2"`), `Home.jsx` and the section components
- **Evidence:**
  - Exactly one `<h1>` ("Your Vision, Our Expertise."). This is good.
  - `<h2>` sections: Who We Are, Our Services, Our Stack, Featured Work, Why Choose Us, What Our Clients Say, Let's Build Something.
  - The h1 and h2 text are brand slogans and carry no service keywords.
  - At 1440px only **one** service `<h3>` was in the DOM (the active one). At 375px all six were present. So the desktop layout does not render the other service names and descriptions. Verify in `ServicesShowcase.jsx`.
  - Several `<h3>` read as empty in my measurement. They are likely hidden until the GSAP reveal runs (the measurement used `innerText`). This is unconfirmed, so check that the text is present in the DOM before the reveal.
- **Fix:** keep the single H1 but add a keyword-bearing line near it (the lead paragraph could name the services). Render all service text in the DOM at every breakpoint and hide it visually if needed. Confirm the `<h3>` text exists in the DOM prior to animation.

#### M4. Unused large assets are shipped (about 52 MB in `dist`)
- **Files:** `public/`
- **Evidence:** 26 files in `public/` are not referenced anywhere in `src/` or `index.html`. They include `mainPage.mp4` (20.8 MB), `hero_video.mp4` (5.7 MB), `Video.mp4` (5.7 MB), `homePageImage2-5.jpg` (about 7.3 MB), `updated/who-we-are.png` (1.9 MB), `dark_theme_logo.png` (0.9 MB), and the `why-*.jpg`, `hero-prop-*.jpg` and old `ourServices` icons. Everything in `public/` is copied into the build. These files are also directly crawlable by URL.
- **Fix:** delete or move unused files out of `public/`. Keep the originals elsewhere if needed.

#### M5. Testimonials and trust signals look like placeholder content
- **Files:** `Home.jsx:225-` (names such as "Sarah Johnson, CEO, TechStart Inc."), `HeroContent.jsx:4-9` (Unsplash stock avatars), `HeroContent.jsx:46` ("Trusted by 250 clients")
- **Evidence:** this is my reading of the code, not a verified fact. Please confirm.
- **Impact:** if these are not genuine, it is a trust and E-E-A-T problem and a policy risk if marked up as reviews. The Unsplash avatars are also hot-linked from a third-party domain.
- **Fix:** replace with real, attributable testimonials or remove. Self-host any avatars. Do not mark up unverified reviews.

#### M6. Preloading non-existent `.webp` files
- **Files:** `src/utils/preloadImages.js`, `src/App.jsx:21-23`, `src/constants/siteImages.js`
- **Evidence:** `preloadImages` defaults to `includeWebp: true` and requests a `.webp` sibling for every `.jpg`. The `service-*.webp` files do not exist (the preview server returned 200 with `text/html`; a real host would return 404). The component-level `preferWebp={false}` flags avoid this for the rendered `<picture>` elements, so only the preload requests are wasted.
- **Fix:** generate real WebP/AVIF versions and use them, or set `includeWebp: false`.

#### M7. Contact forms do not submit anywhere
- **Files:** `Home.jsx:646-650` (shows a success message and discards the data), `Contact.jsx:20-26` (`alert` and a `TODO`)
- **Impact:** not an SEO ranking issue, but leads are silently lost on the page that is meant to convert organic traffic.
- **Fix:** wire to a form backend or an email service, add error handling, and track conversions.

#### M8. No 404 page and no route-level error handling
- **Files:** `src/App.jsx`, `ErrorBoundary.jsx`
- **Fix:** add a branded 404 route, plus `noindex` for it. Make the host return a true 404 status.

---

### LOW

- **L1. Meta keywords** (`index.html:10`) is ignored by Google. Remove it or leave it, with no ranking benefit either way.
- **L2. Favicon and icons.** `index.html:5` uses `mainPage.png` (500x500) as the favicon. `public/favicon.svg` is unused. Add an SVG icon, a 180px `apple-touch-icon`, `theme-color` and a web manifest.
- **L3. Theme flash.** `ThemeContext.jsx` sets the `dark`/`light` class in `useEffect`, after first paint. Add a small inline script in `<head>` to set the class early.
- **L4. Fonts.** Three Google Font families with many weights are loaded via a render-blocking stylesheet (`index.html:26-28`). `display=swap` is set. Consider self-hosting and trimming weights.
- **L5. Unused dependencies.** `three`, `ogl`, `animejs` and `lightswind` are in `package.json` but did not appear in the production chunks. Remove if truly unused. The `src/components/lightswind/` folder holds about 130 unreferenced component files.
- **L6. Tap targets.** Footer and contact social icons render at about 18-20px, below the 44px recommended target. Navigation buttons are fine (`min-h-11`).
- **L7. Small text.** The "One studio for web, apps..." line uses `whitespace-nowrap` with `clamp(0.7rem, ...)`, which gives about 11px on phones. Check legibility.

---

## 3. Checklist results

| # | Area | Status | Notes |
|---|---|---|---|
| 1 | Technical SEO | **Fail** | C1, C2, H1 |
| 2 | Titles / meta descriptions | Partial | Exists, but one site-wide, generic, description too long (M1) |
| 3 | H1/H2 structure | **Pass, with notes** | One H1, logical H2s; slogan-only text (M3) |
| 4 | Canonical URLs | **Fail** | None (H2) |
| 5 | sitemap.xml | **Fail** | Missing (C2) |
| 6 | robots.txt | **Fail** | Missing (C2) |
| 7 | JSON-LD | **Fail** | None (H3) |
| 8 | Open Graph / Twitter | Partial | Text tags only; no image, no URL (M2) |
| 9 | Image alt | **Fail** | All content images empty (H6) |
| 10 | Internal linking | **Fail** | Zero internal links (H4) |
| 11 | URL structure | **Fail** | Single URL, hash anchors only (H1) |
| 12 | Mobile responsiveness | **Pass** | No horizontal overflow at 375px (scrollWidth = 375); viewport meta correct; layouts adapt; small tap/text issues (L6, L7) |
| 13 | Performance | **Fail** | About 10.2 MB first load (H5, M4) |
| 14 | Rendering / routing | **Fail** | C1, H1, M8 |
| 15 | International SEO | Partial | See section 4 |

---

## 4. International SEO readiness

- The site is a single English-language version, so `hreflang` is not needed today.
- `<html lang="en">` is set (`index.html:2`). Consider `en-IN`, since the business is based in Chandigarh and uses an Indian phone number.
- There is no multi-region content, no `hreflang` and no language switcher. This is fine for now.
- If a second locale is planned, choose a URL scheme now (`/en/`, `/hi/`). Doing so later means rewriting every canonical and sitemap entry.
- Local signals are present but not machine-readable: "Chandigarh, India" and +91 8219268903 appear in the footer and contact section. Put them in JSON-LD (H3). Google Business Profile status was not checked.
- The Featured Work copy mentions Dubai venues. If the target market includes the UAE, consider dedicated content for it.

---

## 5. Implementation priorities

**Phase 1 — Make the site indexable (do first; everything else depends on it)**
1. C1: prerender or SSR, plus remove the content gate behind the splash. Add `<noscript>`.
2. H1: introduce routing and revive or rewrite the About, Services and Contact pages.
3. C2: add `robots.txt` and `sitemap.xml`, plus a real 404.
4. H2: per-route canonical, title, description and `og:url`.

**Phase 2 — Signals and links**
5. H3: JSON-LD (`Organization` / `ProfessionalService`, `WebSite`, `Service`, `BreadcrumbList`).
6. H4: replace nav, logo and CTA buttons with real links and add a footer link list.
7. M2: share image and complete OG/Twitter tags.
8. H6: descriptive alt text on content images.
9. M1, M3: rewrite titles, descriptions and keyword-bearing headings and copy.

**Phase 3 — Performance**
10. H5: compress hero images and video, fix preloads, add `srcset`.
11. M4, M6: remove the unused 40+ MB of assets and the wasted `.webp` preloads.
12. L3, L4: theme-flash script, font loading.

**Phase 4 — Trust and cleanup**
13. M5: replace the placeholder testimonials and stock avatars.
14. M7: make the contact forms work.
15. L1, L2, L5, L6, L7: housekeeping.

**How to verify after fixes:**
- `curl` the built page and confirm the H1 and body text are in the raw HTML.
- Fetch `/robots.txt` and `/sitemap.xml` and confirm they are not HTML.
- Check that an unknown URL returns HTTP 404.
- Validate the JSON-LD with the Rich Results Test.
- Run Lighthouse on mobile and compare LCP and total bytes against the baseline above (about 10.2 MB).

---

## 6. Limits of this audit

- Production was not fetched, by design.
- Core Web Vitals were not measured with Lighthouse or CrUX. Page-weight figures come from response `content-length` headers on a local server, and real-world timings will differ.
- The `@vercel/speed-insights` script 404'd locally. That is expected outside Vercel and is not a finding.
- Whether the testimonials and the "250 clients" claim are genuine is unverified (M5).
- Google Search Console, Google Business Profile and backlink data were not available or used.
- The desktop-only service `<h3>` behaviour (M3) and the empty-`<h3>` reading were observed in a headless browser and not traced through every component.
