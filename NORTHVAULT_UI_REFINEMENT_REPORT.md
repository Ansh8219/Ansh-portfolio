# NorthVault Studios — UI Refinement Report

Date: 2026-11-13 · Branch: `website-refresh-new-images` · Not deployed, not committed. Unrelated working-tree changes were left alone.
Inputs: `NORTHVAULT_FRONTEND_UI_AUDIT.md`, `NORTHVAULT_CAPABILITY_IMPLEMENTATION_REPORT.md`, `NORTHVAULT_CONTENT_STRATEGY.md`. All approved capability content (AI, software, web and mobile, backend, cloud, DevOps, data, automation, brand, marketing) is kept.

## 1. Summary of results
| Audit item | Status |
|---|---|
| C1 About page dark-theme contrast | **Fixed** |
| H2 Orange text contrast in light theme | **Fixed** (text-only token; brand #ff6b00 preserved for buttons and decoration) |
| L1 Why Choose Us subline at 320px, hero headline at 320px | **Fixed** |
| M4 Tools tabs at 900px | **Fixed** |
| M1 Small touch targets | **Fixed** (44px on nav, theme toggle, social icons; nothing under 24px anywhere) |
| M3 Ticker and marquee pause controls | **Added** |
| M5 Unified CTA styling | **Done** (all primary CTAs share one style) |
| L3 Invalid `.webp` requests, `fetchPriority` | **Fixed** |
| L2 `theme-color` | **Verified already working** (see 5) |
| M2 Uneven service card heights | **Reduced** (nothing removed) |
| Primary CTA text contrast (follow-up) | **Fixed** (dark text, see section 6) |
| H1 About media block, H3 service images | **Deferred**, as instructed |

## 2. Changes by priority

### Priority 1 — Contrast and theming
- **About page** (`src/pages/About.jsx`): fixed grays (`text-gray-600/700`, `border-gray-200`, black circles) replaced with theme tokens. The cards now use the same `glass` card and hover pattern as the Services page. The step circles invert per theme (`--text-primary` fill, `--bg-primary` number). The Promise card has a border so it reads in dark theme and carries the `dark` class so its accent text stays bright on the black card.
- **New token `--text-accent-ink`** (`src/index.css`): `#ff6b00` in dark theme and `#b83e00` in light theme (4.98:1 on the cream background, 4.5:1 required). It is used for text only: `.text-accent`, handwritten accents, the hero mid handwrite, the "4 Featured Projects" count, project outcome tags, nav active and hover states, service index labels, the looping Why Choose Us word, the branded email and social hover.
- **Light-theme hero headline**: the gradient on "Built to Last." now runs #e25a00 → #b83e00 in light theme (3.3:1 to 5:1, large text needs 3:1). Dark theme is unchanged.
- **Secondary text in light theme** raised from 55% to 66% opacity (about 4.3:1 to 5.5:1). The hero eyebrow in light theme was raised the same way.
- **Preserved:** #ff6b00 for button fills, gradients, icons, borders and the logo.
- **Skip link:** text colour changed from white to near-black, since white on #ff6b00 was 2.9:1.

### Priority 2 — Responsiveness
- **Why Choose Us subline:** wraps below 640px (`text-balance`) and stays on one line from 640px up. No overflow at 320px.
- **Hero headline:** mobile font size is now `clamp(1.9rem, (100vw − 2rem) / 8.6, 3.5rem)`, so the longest line fits with margin at every width (it overflowed by 5–15px at 320 and 375px).
- **Tools:** the 900px+ grid wraps instead of forcing one row, so a group can grow safely.
- **Touch targets (44px):** desktop nav links, logo link, theme toggle (36px → 44px), footer and contact social icons. Pause toggles are 44×44.

### Priority 3 — Interactions
- **Pause/resume controls** in `HeroTicker.jsx` and `TestimonialsMarquee.jsx`, both using a single `.motion-toggle` style. They are real `<button>`s with `aria-pressed` and a label that changes between "Pause…" and "Resume…". The animation uses `animation-play-state`, so position is kept when resuming.
- **Reduced motion:** the toggles are hidden and the existing reduced-motion behaviour (ticker static, marquee scrollable) is unchanged.
- **CTAs:** every primary CTA now uses `btn-primary btn-primary--hero` (the hero button style). That covers Home form submit, Services "Talk to Our Team", Contact form submit, the Contact "Schedule a Consultation" link and the Featured Work "Start a similar project" link. About has no CTA, so none was added.

### Priority 4 — Component quality
- **WebP requests:** `preloadImages` was requesting a `.webp` twin for every `.jpg`, and the `service-*.webp` files do not exist. `includeWebp` is now opt-in, and the six 404s are gone.
- **`fetchPriority`:** the DOM prop was lowercase (`fetchpriority`) and is now `fetchPriority`.
- **Service card heights:** the AI card description was shortened to four lines, its first two bullets were merged, and Software and Web gained one real capability each (Ongoing Engineering Support; SEO & Performance). Row heights are now even, with 16–32px of slack at most. Every AI capability is still listed.

## 3. Validation
- **Matrix:** 4 routes × 7 widths (320, 375, 390, 768, 900, 1024, 1440) × 2 themes = **56 pages**. Zero horizontal overflow, zero clipped text, zero unlabeled controls, zero images without alt, and zero interactive elements below 24px. After the final tweaks, **24 pages** (320, 900, 1440 × both themes) re-ran clean.
- **Keyboard:** skip link and a visible 2px focus ring on every element tabbed through. Pause toggles work with Space and Enter. Tools tabs work with Arrow, Home and End.
- **Touch (375px, touch emulation):** tapping the ticker toggle pauses it, and tapping a tools tab selects it.
- **Reduced motion:** toggles hidden, ticker and marquee animations are `none`.
- **Pause/resume:** ticker and marquee go running → paused → running, and `aria-pressed` and labels update correctly.
- **Themes:** both themes render on all routes. `theme-color` follows the theme.
- **Network:** zero failed requests on Home apart from the Vercel script, which only exists on Vercel.
- **Contrast:** the About page and light-theme accent text now pass. Remaining automated flags were checked and are false positives (white text over image overlays, gradient text) or the exceptions in section 4.
- **Production build:** passes (`SITE_URL=https://example.com`, a placeholder; set your real domain for deployment). All four routes prerender with their own title, description, canonical and JSON-LD.
- **Skills:** the Web Interface Guidelines and frontend-design principles were used as review criteria. Findings that matched the guidelines (focus visibility, pause controls for auto-moving content, touch targets, `theme-color`, `fetchPriority`) are addressed above. No redesign was introduced.

## 4. Known remaining items
1. **Resolved in sections 6 and 7:** primary CTA text and the selected Tools tab text are now `#111111` on the orange fill, verified in the rendered browser.
2. **Logo orange on cream** ("NorthVault" in the nav and footer) is about 2.5–2.9:1. Preserved as brand identity.
3. **Deferred by you:** the empty About media block and the service card artwork. Cards 1, 5 and 6 still show old baked-in text.
4. **`theme-color` before hydration:** the prerendered HTML starts at `#000000`, and the saved theme is applied once JavaScript runs. A returning light-theme visitor may see black browser chrome for a moment.
5. **Not tested:** real screen-reader and zoom (200%+) passes, forced-colors mode, and physical touch devices.
6. **Testing scripts** (Playwright, run from another project's `node_modules`) and screenshots are in the session scratchpad and are not part of the repo.

## 5. Files changed in this task
`src/index.css` · `src/pages/About.jsx`, `Services.jsx`, `Contact.jsx`, `Home.jsx` · `src/components/HeroTicker.jsx`, `TestimonialsMarquee.jsx`, `Navbar.jsx`, `ToggleTheme.jsx`, `Footer.jsx`, `ServicesShowcase.jsx`, `FeaturedWorkCarousel.jsx`, `BrandedEmail.jsx`, `ResponsivePicture.jsx`, `lightswind/looping-words.tsx` · `src/utils/preloadImages.js`.
No images, dependencies, routes or SEO code were changed. `theme-color` needed no code change.

## 6. Follow-up: primary CTA contrast (approved dark text)
**Change** (`src/index.css`, two declarations only):
- `.btn-primary` text colour `#fff` → `#111111`.
- `.btn-primary--hero` text colour `#fff` → `#111111`.

All primary CTAs already share these two classes (hero "Start a Project", Home and Contact form submits, Contact "Schedule a Consultation", Services "Talk to Our Team", Featured Work "Start a similar project"), so one change covers every one of them. The orange fill, gradient, shadows, hover lift and tap animation are untouched. Secondary buttons (for example "Watch Our Story", the Tools tabs and the motion toggles), the logo and the global palette were not changed.

**Icons:** the arrow icons are Lucide SVGs that draw with `currentColor`, and the loading spinner uses `border: 2px solid currentColor`, so both follow the new dark text automatically. No icon code was edited.

**Contrast, calculated across the whole gradient** (`#111111` text):
| Gradient part | Fill | Contrast |
|---|---|---|
| Top stop | `#ff8a33` | 8.03:1 |
| Middle stop and flat `.btn-primary` fill | `#ff6b00` | 6.61:1 |
| Bottom stop (darkest) | `#e85f00` | **5.46:1** |

Red, green and blue values change in one direction between stops, so the lowest contrast anywhere on the button is the bottom stop's 5.46:1, above the 4.5:1 minimum. The fill and text colours are the same in light and dark themes, so the result is identical in both.

**States** (from the CSS, not browser-tested): hover and active only change shadow, transform and scale, with no colour change, so the contrast above holds. Focus uses the existing 2px outline, which is unaffected. The disabled state (`opacity: 0.75`, while the form is sending) fades the text and fill together; disabled controls are exempt from the contrast requirement, and the label stays readable.

**Verification:** production build passes. Section 7 covers the browser check of these buttons.

## 7. Follow-up: selected Tools tab and rendered-browser verification
**Change** (`src/index.css`):
- `.tools-tab.is-active` text `#fff` → `#111111`, and the matching `.light .tools-tab.is-active` override. The orange fill, border, shadow and the inactive tab styling are unchanged.
- **Focus ring (new, small):** the global keyboard focus ring is `#ff6b00`, which measured only **2.52:1** against the light-theme page (3:1 is needed for focus indicators). I added one scoped rule so the ring on Tools tabs and primary CTAs uses `--text-accent-ink`: `outline-color: var(--text-accent-ink)`. In dark theme this is still `#ff6b00`, so dark is unchanged; in light theme it is `#b83e00`. The global ring on all other controls was not changed.

**Focused browser tests** (Chromium, 1440×900, both themes, computed styles from the live page):

| Check | Dark | Light |
|---|---|---|
| Selected tab text / fill | `#111` on `#ff6b00` = **6.61:1** | **6.61:1** |
| Selected tab on hover | text stays `#111`, 6.61:1 | same |
| Selected tab, keyboard-focused (`:focus-visible`) | text `#111`; ring 2px, 3px offset, **7.36:1** vs page | ring `#b83e00`, **4.98:1** vs page |
| Inactive tab | unchanged (white 55% / dark 66% text); hover turns text full-strength with an orange border | same |
| Primary CTAs, worst point of the gradient (`#e85f00`) | **5.46:1** on all 6 buttons | **5.46:1** on all 6 buttons |
| CTA hover / active / keyboard focus | text stays `#111`; ring 7.36:1 | text stays `#111`; ring 4.98:1 |
| CTA arrow icons | stroke is `rgb(17,17,17)` (`currentColor`) | same |
| Disabled submit | text `#111`, `opacity: 0.75` (disabled controls are exempt) | same |

The six primary CTAs checked were Home "Start a Project", Home "Start a similar project", Home "Send Message", Services "Talk to Our Team", Contact "Send Message" and Contact "Schedule a Consultation". The selected tab keeps a visible gap between the orange fill and the focus ring (3px offset), so the ring does not disappear against the fill.

Screenshots of the focused tab and CTA were inspected in both themes and looked correct. No other pages or components were modified. Production build passes (placeholder `SITE_URL`).
