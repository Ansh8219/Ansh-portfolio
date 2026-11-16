# NorthVault Studios: Creative direction proposal

Date: 2026-11-13 · Branch: `website-refresh-new-images` · Status: **proposal only**. No source, dependency, image or component was changed. Nothing is deployed. Implementation waits for your selection.

**Skills applied:** premium-saas-web, frontend-design, web-design-guidelines, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, gsap-performance. Section 8 shows where each one shaped the proposal.

---

## 1. What I found in the current project

### Architecture (all of this is preserved)
- React 18, Vite 5, React Router 6, Tailwind 3. Four real routes (`/`, `/about`, `/services`, `/contact`) plus a noindex 404.
- **SSR and prerender:** `src/entry-server.jsx` renders each route with `StaticRouter`. `scripts/prerender.mjs` injects per-route head tags from `src/seo/routes.js` and writes static HTML, `robots.txt` and `sitemap.xml`. The client calls `hydrateRoot`. This pipeline and the SEO table stay untouched.
- **Motion stack already in place:** GSAP 3.15 with ScrollTrigger, and Lenis wired to ScrollTrigger in `LenisProvider`. Lenis is switched off for touch devices and reduced motion. `ServicesShowcase` is already a pinned, scroll-driven section.
- **Theming:** a dark/light toggle driven by CSS variables (`--bg-primary`, `--text-accent`, and so on) in `src/index.css`.

### What the site looks like today
- Black and cream with a single orange (#ff6b00). Heavy wide headline font (Unbounded), Caveat handwriting accents, Inter body, tracked all-caps labels.
- Home order: hero (character video) → who we are → pinned services → tools tabs → featured work carousel → why choose us → proof-of-work marquee → contact form.
- Real content to keep: six service lines, four shipped projects (Befit sports booking in Dubai, Dawat food delivery, Service Provider Network, Catering Management), the five-step process, "NDA on request", "reply within 24h", Chandigarh. I will not invent stats, clients or testimonials.

### Things worth knowing before choosing
1. **Featured work and Proof of work show the same four projects twice.** The redesign should merge them into one showcase.
2. **Project and service images are generic service art** (`/ourServices/service-*.jpg`, about 150 KB each). They are not project screenshots, and the earlier audit noted three of them have old baked-in text. Directions that lean on big images will expose this. You told me not to replace images, so each direction below says how it copes with the current set.
3. **The About page's media block is still empty** (deferred in the last round).
4. **Unused weight in `package.json`:** `animejs`, `three` and `ogl` are not imported anywhere in `src/`. `ParticleBackground` and `AnimatedBackground` exist but nothing imports them. `lightswind` is used only for `LoopingWords`. `framer-motion` appears in 15 files alongside GSAP, so the site runs two animation systems.
5. **Heavy media in `public/`:** `mainPage.mp4` is about 20.8 MB and `hero_video.mp4` and `Video.mp4` are about 5.6 MB each. I did not confirm whether they are used; the hero uses the 1.5 MB clip. `hero-character.png` is 2 MB and is preloaded in `index.html`.
6. **`@gsap/react` is not installed and `SplitText` is unused.** SplitText is included in the installed `gsap` package (free since 3.13).

### Rules I am working under (they shape every direction)
- **Your brief wins where it conflicts with the premium-saas-web skill.** That skill recommends one accent hue; you asked for a rich multi-color identity. So each direction below uses a **disciplined multi-hue system** where every color has a job (see section 2).
- **Buttons never move on hover** (premium-saas-web hard rule). "Premium hover" here means light, color, clip-path fills and image reactions. Cards and images can react more.
- **frontend-design cautions** I applied: no tracked all-caps eyebrow above every heading, no 01/02/03 numbers unless the content is a real sequence, no single-word-accent headlines, no cream-plus-serif-plus-terracotta, no generic near-black-plus-neon. Each direction names how it avoids these.
- The hex values below are **starting points**. Every text/background pair gets measured for 4.5:1 (3:1 for large text) at implementation.

---

## 2. A shared idea across all three: color that carries meaning

Today the six services look alike. In every direction, **each discipline owns a hue**, used consistently on Home, Services, project tags and the contact form's topic chips. That is how a multi-color identity stays disciplined instead of decorative.

Disciplines: AI & Intelligent Systems · Software & Product · Web & Mobile · Backend, Cloud & Infrastructure · Data & Quality · Brand, Marketing & Social.

Each direction maps its own palette onto these six.

---

## 3. Direction A: Northern Lights

**One line:** a cinematic, luminous night-sky identity. "North" becomes the idea: aurora ribbons, depth and light, with a dark default and a frost light theme.

**Personality:** immersive, atmospheric, cinematic. Closest to the current dark site, so it is the lowest brand-continuity risk.

### 1. Color palette
| Token | Hex | Role |
|---|---|---|
| Midnight | `#070A1A` | page base (dark) |
| Deep indigo | `#11143A` | surfaces, cards |
| Snow | `#F2F5FF` | text (secondary at 72% opacity) |
| Aurora violet | `#7C5CFF` | AI & Intelligent Systems |
| Glacier cyan | `#2DD4FF` | Software & Product |
| Aurora mint | `#4FE3B0` | Web & Mobile |
| Fjord blue | `#4C7DFF` | Backend, Cloud & Infrastructure |
| Sun amber | `#FFC24D` | Data & Quality |
| Ember coral | `#FF6A4D` | Brand, Marketing & Social, and primary CTA (a nod to the old orange) |

**Frost (light theme):** base `#EEF2FB`, ink `#0B1030`, the same hues darkened for text use (for example violet `#5B3FE0`). Glows become soft tinted washes.

**Rule:** only one or two hues are strongly lit in any viewport. The aurora blends all six, but the active section's discipline hue leads.

### 2. Typography
- **Display:** Bricolage Grotesque (variable, width and optical-size axes), weight 700-800, tracking about -0.035em, line-height about 0.98.
- **Body and UI:** Instrument Sans, 17-18px, line length under 70 characters.
- **Mono:** JetBrains Mono only inside project tech lists, not as a decorative label style.
- Retires Unbounded and Caveat. The handwriting accents ("Idea → Build → Launch") go; the idea moves into the process section as real type.

### 3. Homepage hero concept
```
┌───────────────────────────────────────────────────────┐
│ ~~~ aurora ribbons drifting (CSS gradients, blurred) ~~│
│                                  ╭───────────╮        │
│  We Engineer                     │           │        │
│  What's Next.                    │  video in │        │
│                                  │  arched   │        │
│  Digital engineering & AI        │  "portal" │        │
│  studio…        [Start a project]│           │        │
│                                  ╰───────────╯        │
│  AI · Software · Web & Mobile · Cloud · Data · Brand  │
└───────────────────────────────────────────────────────┘
```
- The existing hero video sits in a tall arched window (a "portal"). The headline is the brand tagline, set huge, revealed line by line from a mask.
- **Scroll moment:** the hero pins and the portal scales from about 0.8 up to full-bleed, so the visitor "flies into" the video. Then the manifesto section rises over it.
- Background aurora is CSS only (layered radial and conic gradients), with slow drift and pointer parallax through `gsap.quickTo`. No WebGL.
- The current headline "Built Right, Built to Last." moves into the manifesto. That is a copy decision I need from you (section 10).

### 4. Section-by-section layout (Home)
1. **Hero portal** (pinned, scale-through transition).
2. **Manifesto:** one large statement that fills line by line as you scroll. Discipline keywords carry their hue.
3. **Disciplines:** a pinned **horizontal gallery** of six full-height panels. Each panel has its own hue wash, a parallax-masked service image, the real capability list and a link to Services.
4. **Work:** interactive showcase. Four project names set huge in a list. Hovering or focusing a name floats a preview image that follows the cursor (desktop). Selecting opens the project detail (outcome, stack) in place. This replaces both the carousel and the proof-of-work marquee.
5. **Stack:** three counter-moving marquee rows grouped by discipline, with a pause button, replacing the tabbed grid.
6. **Why NorthVault:** four sticky stacking cards, tone shifting per card (dimmed with `filter: brightness`, never opacity).
7. **Contact:** the aurora brightens, a giant "Let's build." and the form. Service chips tint the background to the chosen hue.

### 5. Animation and interaction ideas
- Headline: SplitText lines with mask reveal. One orchestrated page-load moment, then quiet fades.
- Pinned hero zoom; scroll-fill manifesto (one timeline, lines sequential); pinned horizontal gallery using `containerAnimation`; sticky stacking cards; parallax on panel images (`yPercent`, scrubbed).
- Cursor-following spotlight on cards and the work list. Buttons only change light and glow.
- Aurora hue shift as sections change, driven by one ScrollTrigger per section.

### 6. About, Services, Contact
- **About, "The long night":** a chapter-style page. The who-we-are video scales inside a frame. The five-step process is a **real sequence**, so it is drawn as an SVG path that traces as you scroll, with a light pulse running along it. "Our promise" is a full-bleed statement.
- **Services:** six chapters, one per discipline. A sticky title on the left, capabilities on the right, and the background color scrubbed from one hue to the next as you move down.
- **Contact:** "Signal" screen. Giant email address, glass form panel, topic chips that retune the aurora. Reply-time, NDA and location facts sit beside the form.

### 7. Mobile approach
- Below 768px: no pinning, no scale-through. The hero is a stacked headline, then the video in a 4:5 arch.
- The horizontal gallery becomes a **native scroll-snap carousel** with visible controls (no scroll hijack).
- Aurora drops to two static gradient layers. The cursor preview becomes a tap-to-expand card.
- Type uses `clamp()`; Lenis stays off on touch, as today.

### 8. Technical implementation
- CSS custom properties for palette and discipline hues. A `data-discipline` attribute per section swaps the accent token, so one component serves every hue.
- GSAP + ScrollTrigger + SplitText (all already in `gsap`). One shared `useReveal` and `usePinnedSection` hook layer, each built on `gsap.matchMedia()` so reduced motion and mobile revert cleanly.
- Aurora is CSS gradients on a single fixed layer using transform and opacity only.
- **Risk:** dark plus glowing gradients is the most common "AI studio" look. It stays distinctive only if the portal, the discipline hues and the typography are done with real conviction. Without them it drifts toward generic.

---

## 4. Direction B: Signal Poster

**One line:** a bold, color-blocked, print-poster identity. Huge type, flat saturated panels, hard ink borders and offset shadows. It treats the six disciplines as six colors on a poster wall.

**Personality:** confident, editorial, playful and precise. The most distinctive of the three, and the cheapest to run.

### 1. Color palette
| Token | Hex | Role |
|---|---|---|
| Paper | `#F1F2F4` | page base (cool grey, deliberately not cream) |
| Ink | `#0E0F14` | text, borders, dark theme base |
| Cobalt | `#2F3BFF` | Software & Product; primary brand block |
| Tangerine | `#FF6A13` | Brand, Marketing & Social, and the heritage orange, now one voice among five |
| Lilac | `#C9B8FF` | AI & Intelligent Systems |
| Chartreuse | `#D6F26B` | Data & Quality |
| Rose | `#FF9EC4` | Web & Mobile |
| Sky | `#8FD0FF` | Backend, Cloud & Infrastructure |

**Inverse (dark theme):** Ink base, paper text, the same blocks. The blocks stay saturated; only their surroundings invert.

**Rule:** color is flat, never gradient. Emphasis comes from block size and contrast, not glow.

### 2. Typography
- **Display:** Syne 800, set very large (`clamp(3.2rem, 15vw, 14rem)` on the hero), tight tracking, sentence case.
- **Body and UI:** DM Sans 17px.
- No handwriting, no mono, no tracked all-caps eyebrows. Section labels are plain words inside a bordered tag.
- Retires Unbounded and Caveat.

### 3. Homepage hero concept
```
┌───────────────────────────────────────────────────────┐
│ WE ENGINEER ░░░░░░░░░░░░░░░░░░░░░░  (cobalt band)     │
│ ░░░░░░░ WHAT'S  ░░░░░░░░░░░░░░░░░░  (tangerine band)  │
│ ░░░░░░░░░░░░░░░ NEXT.  ┌────────┐   (lilac band)      │
│                        │ video  │ ← tilted sticker    │
│  Digital engineering   │ frame  │   frame, ink border │
│  & AI studio  [Start]  └────────┘                     │
│ ── AI ── Software ── Web ── Cloud ── Data ── Brand ── │  ← ticker
└───────────────────────────────────────────────────────┘
```
- The tagline runs across three full-width color bands at poster scale. The hero video sits in a slightly tilted frame with a hard ink border and flat offset shadow, overlapping the type.
- **Scroll moment:** the bands slide apart horizontally in opposite directions (scrubbed) and reveal the next section underneath.

### 4. Section-by-section layout (Home)
1. **Hero bands** (scrubbed split).
2. **Statement on cobalt:** white scroll-fill text, one sentence about one team doing engineering and brand.
3. **Disciplines:** six sticky full-height **color cards** stacking on scroll, each in its discipline color with a masked service image, slight rotation and the real capability list.
4. **Work:** pinned **horizontal gallery** of four oversized project posters, one color each. Images scale from 0.9 to 1 as they enter. Outcome and stack are printed on the poster.
5. **How we work:** the real five-step sequence as a numbered ribbon (numbering is valid here).
6. **Stack:** a "sticker wall" of technology chips in a counter-moving marquee with a pause button.
7. **Why NorthVault:** four statements in a split marquee.
8. **Contact:** giant "Say hello." The form sits on a cobalt panel with chunky inputs.

### 5. Animation and interaction ideas
- Color wipes through `clip-path`: hovering a card or button floods it with its color from the pointer's entry point. Nothing translates on hover, so buttons stay still.
- Marquees that reverse direction with scroll velocity (`ScrollTrigger` velocity), plus a pause control.
- Horizontal gallery with `containerAnimation`; stacking cards with scrubbed scale; sticker parallax at different `data-speed` values.
- Hard-edged "pressed" states: the offset shadow flattens on `:active`.

### 6. About, Services, Contact
- **About, "Team poster":** the who-we-are video grows from 60% to full-bleed with the lines of copy overlaid. The four pillars become folded color labels. The process is a numbered ribbon. "Our promise" is a full-bleed tangerine statement.
- **Services, "Index":** six full-width rows with the discipline name at poster scale. Hover or focus floods the row with its color and shows an image preview. Selecting expands the capability list (`aria-expanded`).
- **Contact:** a split screen. Left: cobalt, giant email, location and reply-time facts. Right: a paper form with chunky bordered inputs and topic chips in discipline colors.

### 7. Mobile approach
- Bands stack with full-width type and no horizontal split on scroll.
- The horizontal gallery becomes **vertically stacked sticky posters**. This keeps the same energy without scroll hijacking.
- Hover floods become tap states. Marquees keep running with the pause control.
- Because the identity comes from flat color and type, it loses almost nothing on phones.

### 8. Technical implementation
- Color blocks are plain CSS, not images or canvas. The heaviest motion is transforms and `clip-path` on a few elements.
- GSAP + ScrollTrigger (pinning, scrubbed bands, velocity marquee), SplitText for headlines, `gsap.matchMedia()` for reduced motion and breakpoints.
- Lowest GPU and memory cost of the three; the easiest to keep smooth on mid-range Android.
- Works well with the current weak imagery because images appear as small framed windows inside bold type and color, not as full-bleed heroes.
- **Risk:** poster-style color blocking can feel loud for conservative enterprise clients. The palette weighting (more paper and ink, fewer saturated blocks per viewport) controls this.

---

## 5. Direction C: Iridescent Vault

**One line:** a refined, light-first, pearl-and-iridescent identity. Soft gradients like vault metal catching light, a serif display for warmth, and large rounded image windows.

**Personality:** calm, premium, luxury-engineering. The most "international studio" in tone.

### 1. Color palette
| Token | Hex | Role |
|---|---|---|
| Pearl | `#F6F7FB` | page base (light) |
| Mist | `#E9ECF6` | surfaces, section bands |
| Ink | `#0F1222` | text |
| Vault indigo | `#2E27D9` | links, primary CTA, focus ring |
| Peach | `#FFB59A` | Brand, Marketing & Social |
| Lilac | `#B8A6FF` | AI & Intelligent Systems |
| Sky | `#8EC9FF` | Web & Mobile |
| Aqua | `#9BF0DD` | Backend, Cloud & Infrastructure |
| Butter | `#FFE08A` | Data & Quality |
| Orchid | `#E9A8FF` | Software & Product |

**Iridescent gradient:** peach → lilac → sky → aqua, used as halos, borders and the final CTA mesh. It never fills body text areas.

**Obsidian (dark theme):** base `#0B0C14`, surfaces `#14162A`. The same pastel hues glow against it.

### 2. Typography
- **Display:** Instrument Serif, large (clamp up to about 12rem), tracking -0.02em, with italics used for contrast within a line.
- **Body and UI:** Geist 17px.
- The serif next to cool pearl and iridescent color is a deliberate departure from the cream-plus-serif default. Retires Unbounded and Caveat.

### 3. Homepage hero concept
```
┌───────────────────────────────────────────────────────┐
│          ╭─────────────────────────╮  (iridescent     │
│    We    │                         │   halo rotating) │
│  Engineer│   hero video in a       │                  │
│  What's  │   rounded "vault        │                  │
│  Next.   │   window"               │                  │
│          ╰─────────────────────────╯                  │
│  Digital engineering & AI studio    [Start a project] │
└───────────────────────────────────────────────────────┘
```
- The serif tagline overlaps the edges of a tall rounded video window. A conic iridescent halo rotates slowly behind it and leans toward the pointer.
- **Scroll moment ("the vault opens"):** the window scales to full-bleed while the page turns to Obsidian, revealing the manifesto.

### 4. Section-by-section layout (Home)
1. **Hero window**, then the scale-to-full-bleed transition.
2. **Manifesto on obsidian:** serif scroll-fill statement.
3. **Capabilities:** a pinned horizontal gallery of six large rounded image cards with iridescent borders on hover.
4. **Case rooms (work):** a sticky large image on the right that cross-fades with a clip-path wipe as the four project names scroll past on the left. Outcome and stack appear with each.
5. **Why NorthVault:** four statements, each beside a parallax image (the existing `why-client`, `why-delivery` and `why-innovation` images fit here).
6. **Stack:** a quiet two-column hairline list by discipline, with no motion.
7. **Contact:** full-bleed iridescent mesh, serif "Let's build what's next."

### 5. Animation and interaction ideas
- Smooth **image scaling** is the signature: windows grow, images counter-scale inside masks (`scale` 1.15 → 1 while the mask opens), so movement feels optical rather than mechanical.
- Slow halo rotation (CSS, 40-60s); pointer-reactive tilt of the halo only, not of the content.
- Clip-path crossfades between projects; cards show iridescent borders on hover.
- Calmest motion budget of the three: fewer, slower, larger moves.

### 6. About, Services, Contact
- **About:** an editorial longform page. A sticky image column changes as chapters scroll by, serif pull-quotes fill on scroll, the four pillars become rounded panels, and the process is a vertical timeline with a line that draws.
- **Services:** alternating large image and text rows with parallax, and a sticky chapter index at the side showing the current discipline hue.
- **Contact:** a conversational form. A large serif prompt, "Tell us what you're building.", and fields styled as one sentence. Each field keeps a real `<label>` so accessibility is unchanged.

### 7. Mobile approach
- The window becomes a full-width 4:5 card. The pin-and-scale transition drops to a simple opacity fade.
- The gallery becomes a native scroll-snap carousel. Parallax is limited to a few images.
- Fewer blurred layers, with the halo reduced to a static gradient ring.
- Serif sizes need careful `clamp()` to avoid awkward line breaks.

### 8. Technical implementation
- Gradients, masks and `clip-path` in CSS; GSAP scrubs scale and clip values. Everything is transform or clip-path based.
- Image-heavy: it needs responsive `srcset`, explicit `width` and `height`, and AVIF/WebP derivatives to stay fast.
- **Risk:** this direction depends most on image quality. The current service images (generic, some with baked text) and the 3D-style character would look weakest here. It is the best choice only if new photography or renders are planned.

---

## 6. Side-by-side

| | A: Northern Lights | B: Signal Poster | C: Iridescent Vault |
|---|---|---|---|
| Default theme | Dark | Light | Light |
| Feel | Cinematic, atmospheric | Bold, editorial, playful | Calm, refined, luxurious |
| Signature | Portal zoom + aurora | Color bands + posters | Vault-window scale + halo |
| Color use | Glowing hues on dark | Flat saturated blocks | Pastel iridescence |
| Display type | Bricolage Grotesque | Syne | Instrument Serif |
| Best with current images | Good (video-led hero) | **Best** (small framed windows) | Weakest (image-led) |
| Motion cost | Highest (layered gradients) | **Lowest** | Medium |
| Mobile fidelity | Good | **Best** | Good |
| Brand continuity | **Highest** (dark, warm accent kept) | Medium (orange becomes one voice) | Lowest |
| Main risk | Generic "AI dark glow" | Too loud for some clients | Needs strong imagery |

### My recommendation
**Direction B (Signal Poster)**, for three reasons. It is the most distinctive and the least likely to be mistaken for another AI studio. It is the only direction that makes your current imagery look intentional. And it is the cheapest to keep smooth on phones, which matters for an audience that includes Dubai and India mobile traffic.

If cinematic immersion matters more than standing apart, choose **A**. Choose **C** only if you plan new photography or renders.

Mixing directions is how pages get muddy, so I would pick one and borrow at most a single technique from another.

---

## 7. Shared technical strategy (applies to whichever direction you pick)

### Keep as is
- Vite build, `entry-server.jsx`, `scripts/prerender.mjs`, `src/seo/*`, route table, canonical, sitemap and JSON-LD. Page `<title>`, descriptions and headings keep their SEO intent; I will not rewrite them without asking.
- Dark/light toggle, skip link, `ErrorBoundary`, `LenisProvider` (with its touch and reduced-motion off-switch), the contact form logic in `useContactForm`.

### SSR and hydration rules
- **SSR HTML must show the final state.** Content is visible by default. A class such as `html.motion-ready` is added on the client before animation start states are applied, so no text is hidden in the prerendered HTML. The current hero sets `autoAlpha: 0` inside a layout effect, which can flash on hydrate; the redesign avoids that.
- All GSAP, ScrollTrigger and `matchMedia` calls run only in effects (gsap-react skill). Nothing touches `window` at module scope. Use an isomorphic layout-effect helper to silence the server warning the prerender script currently suppresses.
- `gsap.registerPlugin(ScrollTrigger, SplitText)` once, in one place.

### GSAP practices (from gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, gsap-performance)
- **Scoped, cleaned-up animations:** every component uses `gsap.context()` (or `useGSAP`) with a scope ref, and reverts on unmount.
- **`gsap.matchMedia()`** wraps every animation set, so `prefers-reduced-motion`, breakpoints and live changes revert correctly. Reduced motion shows final states, no pinning and no autoplay motion.
- **One ScrollTrigger per timeline.** Scrubbed tweens use `ease: 'none'`. Horizontal sections use `containerAnimation` with `ease: 'none'`.
- **Only transform, opacity, `clip-path` and `filter`.** Never width, height, top or left. `will-change` only on elements that animate. `gsap.quickTo` for cursor followers.
- **Pin only what is needed**, with `invalidateOnRefresh`, and refresh ScrollTrigger once after fonts and images settle (`document.fonts.ready`), not on every resize.
- **SplitText with `autoSplit: true`** and the animation built in `onSplit`, so lines re-measure on resize. Mask only text without clipped accents.
- A small timing scale shared by all pages: hover 120-180 ms; state changes 250-400 ms; section reveals 800-1000 ms with `power3.out`; hero cascade 1000-1400 ms with `expo.out`.

### Accessibility (web-design-guidelines)
- Visible `:focus-visible` on everything; never `outline: none` without a replacement; no `transition: all`.
- **Pinned and horizontal sections must stay keyboard-usable:** panels are focusable, focus scrolls the page to that panel's progress, and a "skip gallery" link is provided. Native scroll-snap fallback on touch.
- Any autoplaying motion over 5 seconds (marquees, video loops) keeps a pause button; videos stop under reduced motion.
- Heading order stays h1 → h2 → h3 on every route. `scroll-margin-top` for anchored sections under the fixed nav.
- Icon-only buttons have `aria-label`; decorative icons are `aria-hidden`; form fields keep real labels; `text-wrap: balance` on headings; `touch-action: manipulation`; `color-scheme` and `theme-color` follow the theme; safe-area insets on full-bleed layouts.
- No `user-scalable=no`; text stays real HTML (never baked into canvas).

### Performance plan
- Budgets I will test against: no horizontal overflow at 320-1440, no layout shift from images (explicit dimensions), animations hold 60 fps on mid-range hardware, and LCP stays on the hero media or headline.
- Replace the intro splash delay with the hero's own entrance, so the splash no longer holds back first paint. (Decision needed in section 10.)
- Fonts: keep Google Fonts with `preconnect`, variable fonts and `display=swap`, requesting only the weights used. Subset and preload the display font.
- Lazy-load below-the-fold images; preload only the one hero asset.
- Pause or kill ScrollTriggers and videos for off-screen sections.

### Dependency and cleanup notes (for later; I am not touching any of this now)
- Remove unused `animejs`, `three`, `ogl`. Consider dropping `lightswind` once `LoopingWords` is replaced.
- Move `framer-motion` usage (15 files) to GSAP or CSS over time so the site ships one animation system.
- Optional: add `@gsap/react` for `useGSAP`. It is small, and the gsap-react skill recommends it. The existing `gsap.context()` pattern also works, so this is your call.

### Theming approach
- Extend the existing CSS variables rather than replacing them, so current components keep working while pages migrate. A `data-page` attribute on each route's root remaps accent and background tokens, giving each page its own personality inside one design language.
- Keep the dark/light toggle. It costs more QA (every route × both themes) but preserves an existing feature.

### Suggested phases (after you choose)
0. Tokens, fonts, motion foundation (hooks, `matchMedia` wrapper, SSR-safe reveal).
1. Navbar, footer and Home.
2. Services.
3. About.
4. Contact and 404.
5. QA: the Playwright matrix used last round (4 routes × 7 widths × 2 themes), keyboard and reduced-motion passes, production build and prerender check, Lighthouse.

---

## 8. How each skill shaped this document

| Skill | Effect on the proposal |
|---|---|
| **premium-saas-web** | The "light, restraint, typography with tension, motion with weight" framework; the pinned, stacking and scroll-fill recipes; timing table; the rule that buttons never move on hover. I deliberately overrode its one-accent rule because your brief asks for multi-color. |
| **frontend-design** | Pushed each direction to start from the subject (a North/vault/engineering studio) instead of defaults. Drove the removal of tracked all-caps eyebrows, decorative numbering and single-word accents, and the check against the cream-serif and dark-neon clichés. |
| **web-design-guidelines** | Source of the accessibility, motion, forms, theming and performance rules in section 7. I fetched the upstream guideline list; it contains no commands for me to run. |
| **gsap-core / gsap-timeline** | Tween and timeline structure, easing choices, `matchMedia` for responsive and reduced-motion variants. |
| **gsap-scrolltrigger** | Pinning, scrub, `containerAnimation` horizontal galleries, batch reveals, and the one-trigger-per-timeline and refresh rules. |
| **gsap-react** | Scoped context, cleanup on unmount, no GSAP during SSR, and the `useGSAP` question. |
| **gsap-performance** | Transform-only animation, `quickTo`, limited `will-change`, and pinning only what is needed. |

## 9. Known limits of this proposal
- I read the code and two audit screenshots; I did not run the site or take new screenshots for this document.
- Color values and font choices are untested until implementation. Contrast, font loading and layout need measuring in a browser.
- Fonts named here (Bricolage Grotesque, Instrument Sans, Syne, DM Sans, Instrument Serif, Geist) are Google Fonts; I did not verify their current availability or weights.
- I did not check whether `mainPage.mp4`, `hero_video.mp4` and `Video.mp4` are referenced anywhere. The sizes are from the file system.

## 10. Decisions I need from you
1. **Which direction: A, B or C?** (Or a variation, such as B's structure with A's dark theme.)
2. **Default theme:** keep the dark/light toggle, and which theme loads first?
3. **Hero headline:** make "We Engineer What's Next." the H1, and move "Built Right, Built to Last." into the manifesto? Or keep the current headline as H1?
4. **Handwriting accents (Caveat):** retire them, as all three directions propose, or keep a small amount?
5. **Intro splash:** remove it in favor of the hero entrance (better LCP), or keep it?
6. **Imagery:** are new project screenshots or renders coming, or should I design around the current service art? C depends on this most; B depends on it least.
7. **`@gsap/react`:** add it at implementation, or stay with `gsap.context()`?
8. **WhatsApp floating button:** keep as is?

I will wait for your selection before touching any source file.
