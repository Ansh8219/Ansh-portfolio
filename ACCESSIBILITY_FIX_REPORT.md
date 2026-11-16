# Accessibility & Interaction Fix Report

Scope: improvement pass driven by the Web Interface Guidelines audit. No redesign. Orange `#ff6b00`, logo, dark/light theme, layouts and copy are unchanged (the only copy edits are the form feedback messages and `...` → `…`). Nothing was deployed. No dependencies were added. `src/components/lightswind/` was not modified by this pass.

## Important context: a second process was editing this tree

While this pass ran, another process changed the same working tree: it added SSR prerendering and SEO (`vite.config.js`, `package.json`, `src/main.jsx`, `src/entry-server.jsx`, `src/seo/`, `scripts/prerender.mjs`, `src/pages/NotFound.jsx`, `.env.example`), turned `/about`, `/services` and `/contact` into live routes, and edited `App.jsx`, `Navbar.jsx`, `useActiveSection.js`, `useMediaQuery.js`, `ThemeContext.jsx`, `HeroContent.jsx` and **`src/components/lightswind/trusted-users.tsx`**. Those edits are not part of this pass. Its `App.jsx` rewrite overwrote my skip link once; I re-applied it on top of their version. `Navbar.jsx` ended up as a merge of both efforts (their route `<Link>`s, my mobile-menu accessibility). Review `git diff` with that in mind. The `trusted-users.tsx` change is from the other process, not from me.

## Files changed by this pass

| File | Change |
|---|---|
| `index.html` | `theme-color` meta |
| `src/App.jsx` | Skip link, `<main id="main" tabIndex={-1}>` |
| `src/context/ThemeContext.jsx` | Keeps `theme-color` meta in sync with the theme |
| `src/components/Navbar.jsx` | Semantic links, mobile menu a11y (see below) |
| `src/components/DecorativeVideo.jsx` (new) | Reduced-motion-aware, viewport-aware looping video |
| `src/hooks/useContactForm.js` (new) | Shared, honest form submission logic |
| `src/pages/Home.jsx` | Form, hero CTAs, videos, tools tabs, section labels, icons |
| `src/pages/Contact.jsx` | Same form fixes, `alert()` removed, `transition-all` removed |
| `src/pages/About.jsx`, `src/pages/Services.jsx` | `transition-all` → specific properties |
| `src/components/FeaturedWorkCarousel.jsx` | Tabs keyboard support, live region, anchor CTA |
| `src/components/TestimonialsMarquee.jsx` | Duplicate loop cards hidden from assistive tech |
| `src/components/ToggleTheme.jsx` | `aria-label` can't be overridden by props; injected `<style>` removed; icons `aria-hidden` |
| `src/components/CustomCursor.jsx` | Rewritten: transform-only, rAF, no per-move React state |
| `src/components/ErrorBoundary.jsx` | "Go Home" is a link; buttons typed |
| `src/components/ResponsivePicture.jsx` | `fetchPriority` → `fetchpriority` (React 18 DOM attribute) |
| `src/utils/scrollToSection.js` | `handleAnchorNavigation()` helper; `force: true` so scrolling works while Lenis is stopped |
| `src/index.css` | Appended "Accessibility & interaction pass" block (~210 lines) |

## Fixes by requested area

### 1. Forms
- `alert()` removed (`Contact.jsx`). Feedback is an always-mounted `role="status" aria-live="polite"` region.
- **No fake success.** There is no submission endpoint in the repo. Without `VITE_CONTACT_ENDPOINT`, submitting opens the visitor's email app (`mailto:` with the message pre-filled), says exactly that, shows the fallback address, and **keeps the typed text**. With `VITE_CONTACT_ENDPOINT` set, the form POSTs JSON and shows real success/error states.
- `autoComplete` (`name`, `email`, `off` for message), `inputMode="email"`, `spellCheck={false}` on email, `rows={6}`, `…` in the message placeholder.
- Loading/disabled submit: spinner, "Sending…", `disabled`, `aria-busy` (applies on the endpoint path).
- Focus indicator: 2px orange outline plus an underline thickening on `.form-field` (replaces border-colour-only focus). `:user-invalid` border.
- `transition-all` → explicit properties on the inputs and submit buttons.
- Non-breaking space in the phone number.

### 2. Navigation
- Desktop and mobile nav items, logo, hero CTAs and the carousel CTA are real `<a href>`. Plain clicks use the smooth scroller and sync the URL hash; middle/Ctrl/Cmd-click falls through to the browser.
- Mobile menu: `aria-expanded`, `aria-controls="mobile-nav"`, labelled `<nav>`, visible "Menu/Close" text is the accessible name (the overriding `aria-label="Toggle menu"` was removed). Escape closes and returns focus to the toggle; focus moves to the first link on open; outside tap closes; resizing past `md` resets it. Functional `setState` updater.
- Skip link doesn't touch the URL hash (it focuses `#main` directly) — found and fixed a race with the router's hash-scroll timers.
- `section[id] { scroll-margin-top }` for native anchor jumps.

### 3. Motion
- `DecorativeVideo`: never autoplays under `prefers-reduced-motion` (the "who we are" video then shows native controls); otherwise plays only while ≥15% visible.
- `CustomCursor`: only mounts for fine pointers without reduced motion; `transform: translate3d` driven by one rAF loop that idles when settled; hover state via a data attribute (no re-renders); `transition-all` gone. *(This component is not currently imported anywhere; see Remaining issues.)*
- Audited: hero ticker and testimonial marquee already had reduced-motion rules. Under reduced motion the marquee rows now scroll instead of clipping the paused loop. Lenis was already skipped for reduced motion and touch. GSAP/Framer reveals already honour `useReducedMotion`.

### 4. Accessibility
- Skip link, `<main id="main">`, labelled `<nav>`s, labelled `<section>`s (`aria-label`), one `<h1>`.
- Tabs (tools + featured work): `aria-controls`, `aria-labelledby`, roving `tabindex`, Arrow/Home/End with wrap, focus follows selection. Removed the focusable-but-invisible carousel container.
- Carousel live region announces "Showing {project}, project NN / NN".
- Marquee duplicate cards and the second row are `aria-hidden` (screen readers previously read ~48 repeated testimonials).
- Global focus ring is solid `#ff6b00` with a 3px offset; decorative icons `aria-hidden`.

### 5. Performance
- `transition-all` removed from every app component under `src/` outside the vendored library.
- Cursor no longer animates `left/top` or re-renders per mouse move; videos pause off-screen.
- Functional state updaters / `useCallback` for new handlers. Existing animation quality is unchanged.

### 6. CSS cleanup
- `bg-[var(--bg-primary)]/95` never emitted an alpha, so the WhatsApp button and mobile menu panel lacked their intended translucency; fixed in CSS with `color-mix`.
- ToggleTheme's inline `<style>` (rendered twice in the navbar) moved to `index.css`.
- Mobile menu: `overscroll-behavior: contain`, `max-height` with scroll. Tap highlight set to a brand tint; `touch-action: manipulation` on interactive elements.

## Test results

Environment: production build served with `vite preview`; Chromium 1440×900 (desktop, dark and light), 390×844 touch emulation (mobile), `reduced_motion=reduce`; Playwright script (kept outside the repo in the session scratchpad: `a11y_test.py`).

- **47 / 47 checks passed**: skip link (first tab stop, visible, focuses main, URL untouched); landmarks; nav and CTA anchors + smooth scroll + hash; both tab widgets with keyboard; carousel live region; form attributes, focus ring, honest no-endpoint behaviour, data kept; WhatsApp background; light theme + `theme-color`; mobile menu open/Escape/outside-tap/focus return/overscroll; reduced motion (videos paused, controls offered, cursor not mounted, ticker and marquee animations off, Lenis not initialised); `/contact` form.
- **Production build**: `SITE_URL=https://example.com npm run build` succeeds (client, SSR and 5-page prerender). The build now *requires* `SITE_URL` (other process's SEO work).
- **CustomCursor** verified separately in a throwaway copy (not in the repo): transform-only movement, hover toggle, not mounted under reduced motion.
- **Console (preview)**: the only error is the 404 for `/_vercel/speed-insights/script.js`, which exists only on Vercel. Warnings are unused `<link rel=preload>` images from `index.html`.

## Remaining issues

1. **React hydration errors (#418/#423) in the prerendered build — not caused by this pass, needs a fix.** They occur on every mobile route and on desktop `/about` and `/contact` (desktop `/` is clean). A dev-mode build showed the desktop cause: the server-rendered nav link for the current route lacks the active class that the client adds (`Navbar` route-aware active state vs the prerendered HTML). React falls back to client rendering, so the site works but loses the prerender benefit and logs errors. The mobile cause was not isolated. Owner: the SSR/SEO work.
2. **`fetchPriority` warning** remains in the SSR build; it comes from `src/components/lightswind/trusted-users.tsx` (vendored, off-limits, and already modified by the other process).
3. **No form backend.** Until `VITE_CONTACT_ENDPOINT` is set (or a service is wired up) the form hands off to the visitor's mail client. That path can't confirm delivery.
4. **Dead code**: `CustomCursor`, `ParticleBackground`, `AnimatedBackground`, `ServicesBento` are not imported anywhere. The cursor was rewritten as requested but isn't visible until mounted.
5. **Not done / not verified**:
   - No pause control for the marquee, ticker or videos for users who haven't set reduced motion (WCAG 2.2.2 would want one).
   - `ServicesShowcase` index buttons and the pinned-scroll sections were not keyboard-tested.
   - No real assistive-technology testing (screen reader), no Firefox/Safari, no physical devices.
   - Colour-contrast was not audited.
   - The hero video still uses `preload="auto"`.
   - `ErrorBoundary` is untested (can't be triggered without forcing an error).
   - Brand-name/unit non-breaking spaces and `translate="no"` from the guidelines were not applied beyond the phone number.
