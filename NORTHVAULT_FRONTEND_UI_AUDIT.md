# NorthVault Studios — Frontend UI Audit

Date: 2026-11-13 · Review only. No visual component, CSS or image was changed during this audit.
Method: production build served locally, inspected in headless Chromium at **320, 375, 390, 768, 1024 and 1440px**, in **dark and light themes**, on all four routes (48 page captures), plus targeted checks of the tools tabs, the Services page and keyboard behaviour. Criteria: the Web Interface Guidelines (fetched fresh) and the frontend-design skill's principles, applied as a review lens only.
Evidence: `audit-screenshots/` (6 key images) and the numbered references below. Automated results are from my own scripts, so treat the contrast values as measurements, not a certified audit.

## 1. What already looks good
- **Hero (both themes, all widths):** one clear message, strong display type, one dominant CTA ("Start a Project"). It fits at 320px with no horizontal scroll. See `02-home-hero-light-1440.png`, `03-home-hero-dark-320.png`.
- **Consistent brand voice in type:** the display face, handwritten accents and orange #ff6b00 form a recognisable system on Home, Services and Contact.
- **No horizontal page scroll** on any route at any of the six widths, in either theme.
- **Keyboard support is solid:** a working skip link, a visible 2px focus ring on every element tabbed through, and the tools tabs respond to Arrow, Home and End keys correctly.
- **Reduced motion, `color-scheme`, a `<main>` landmark and a logical heading order** (one h1, then h2 sections) are all present. The earlier SEO and accessibility work is intact: canonicals, per-route titles and descriptions, and JSON-LD are present on all four routes.
- **Services showcase** (pinned desktop view and stacked mobile cards) reads clearly, and the six-card list scans well. See `05-services-dark-1440.png`.
- **Tools tabs** work well at every width: wrapping and centred on desktop, horizontally scrollable on mobile (`06-tools-light-375.png`).
- **Proof of Work cards** are clean now that the quote marks and avatars are gone, and they stay legible in both themes.

## 2. What feels inconsistent
- **About page vs the rest of the site.** Home, Services and Contact use theme tokens. About uses hard-coded Tailwind grays (`text-gray-600/700`, `border-gray-200`, a fixed black gradient block), so it only works in light theme.
- **CTA styling differs by page.** The Home CTA is a gradient pill; the Services CTA ("Talk to Our Team") is a flat rectangular button with a different radius and no arrow.
- **Eyebrow and handwrite devices are heavily repeated.** Nearly every section has a tracked all-caps eyebrow plus a handwritten "A → B" line. Repetition weakens each one, and the frontend-design guidance lists these as common template tells.
- **Card heights on the Services page** vary because the AI card has nine bullets and the others have six (see M2).
- **Pre-existing:** the showcase subtitle "Strategy → Build → Scale" and the Tools eyebrow "Tools we use" were not rewritten and use older, more generic phrasing than the rest of the copy.

## 3. Issues, ranked

### Critical
**C1. About page is hard to read in dark theme (accessibility).**
`src/pages/About.jsx` uses fixed grays. Measured contrast in dark theme: "How We Work" steps **2.04:1**, "What We Do" card descriptions **2.78:1** (4.5:1 required). The numbered circles are `bg-black` on a black page, so they vanish. See `01-about-dark-1440.png`.
Fix direction: use the existing text tokens (`text-secondary`, `text-primary`, `--glass-border`) in place of the fixed grays. This is a small class change and should be verified in both themes.

### High
**H1. About "Who We Are" has an empty gradient box where media should be** (`About.jsx`, the `h-56 … bg-gradient-to-br` div). It reads as a missing image or video in both themes. Home uses a video in the same slot. Fix direction: reuse the Home video or a brand image, or show a short pull-quote. This needs your decision, since it is imagery.
**H2. Orange accent text on the light theme is low contrast.** #ff6b00 on the cream background measures about **2.5:1**. Large headings (for example "Built to Last.", "About the Studio") are below the 3:1 large-text threshold, and small orange text (10–12px eyebrows and "Shipped" tags) is well below 4.5:1. The brand colour should stay, but light theme could use a darker accent token for text only (about #c2410c reaches roughly 5:1), leaving buttons and decorative uses on #ff6b00.
**H3. Service card artwork contradicts the new services.** Known, deferred by you: card 1 shows "Website Development", card 5 shows "Mobile Apps" (duplicating card 3), card 6 shows "UI/UX Design". Visible in the pinned desktop showcase and the mobile stack.

### Medium
**M1. Touch and click targets below 24×24px:** footer and contact social icons (18×18), desktop nav links (about 16px tall) and the logo link (12–15px tall). Add padding or `min-height` so each reaches at least 24px, ideally 44px on touch screens.
**M2. Services page row 1 is uneven.** The AI card is about 70px taller than its neighbours, leaving empty space in cards 2 and 3. Options: accept it (the nine bullets are the requested capabilities), or fold two bullets together.
**M3. Auto-moving content has no pause control:** the hero ticker and the Proof of Work marquee (WCAG 2.2.2, and the guidelines require pause controls for motion over 5 seconds). The reduced-motion media query covers users who opt out, but a visible pause control, or pause on hover and focus, would be better.
**M4. Tools row has almost no slack at 900–1000px.** At 900px the grid is 838px in 836px of space. Groups with 6 items fit, but a 7th item would overflow. Keep groups to 6 items or fewer, or allow the grid to wrap.
**M5. Inconsistent buttons and links across pages** (see Section 2). A single CTA style would help conversion.

### Low
- **L1.** The Why Choose Us subline is `whitespace-nowrap` and overflows at 320px (about 31px). The hero's second line sits within about 5px of the edge at 320px.
- **L2.** `theme-color` is a fixed #000000, so browser chrome stays black in light theme.
- **L3.** `ResponsivePicture` requests `.webp` files that don't exist (404 for six `service-*.webp`), then falls back to jpg. It wastes six requests per load. It also passes `fetchpriority` in lowercase, which React treats as an unknown DOM property.
- **L4.** The brand name could carry `translate="no"` so translation tools leave it alone.
- **L5.** The Vercel speed-insights script 404s when the build is served locally, which is expected outside Vercel.
- **L6.** First load is heavy (large hero and story videos, per the earlier SEO audit). This was not re-measured here.

## 4. Recommended improvements (in priority order)
1. Fix About-page theming (C1), the highest-value, lowest-risk change.
2. Decide the About media block (H1).
3. Add a light-theme text accent token (H2).
4. Replace the three mismatched service images (H3).
5. Enlarge small targets (M1) and add marquee pause behaviour (M3).
6. Unify the CTA style (M5).
7. Create the missing `.webp` files or stop requesting them (L3).

## 5. Changes to avoid
- **Do not recolour the brand orange globally.** Add a text-only variant for light theme instead.
- **Do not add more than 6 items to any tools group** without making the grid wrap.
- **Do not lengthen the nowrap Why Choose Us subline** or hero display lines. Test at 320px if you do.
- **Do not add more service bullets** to the Home showcase (desktop chips and the pinned layout assume 4–6).
- **Do not remove the skip link, focus ring or reduced-motion rules** when theming the About page.
- **Do not rework layouts or animations.** Nothing in this audit needs it.

## 6. Coverage notes
- Contrast figures come from a script that reads computed colours. They may over-report on text sitting over images or gradients, but the About-page and light-theme accent findings were confirmed visually.
- A real assistive-technology pass (screen reader, 200% zoom, forced colours) was not done.
