# NorthVault Studios: Reference design study

Date: 2026-11-13 · Status: **proposal only**. No source, dependency, image or deploy was touched. Nothing here is a clone of the reference. Implementation waits for your selection.

Skills applied: premium-saas-web, frontend-design, gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-react, gsap-performance, web-design-guidelines (section 6 shows the rules each one imposed).

---

## 1. What I could and could not learn from the reference

**Method and limits.** I read the site's public HTML, its main stylesheet (27 KB) and its theme bootstrap script. I did **not** render it, so I have not seen its 3D model, its motion or its layouts. Anything about *feel* below is inference from code and should be checked by you in a browser. Facts and inferences are labelled.

**Observed (from markup/CSS):**
- RI.Studio is a Tokyo interaction/UI-UX designer's portfolio, described as a "3D scroll experience" with app UI, web, AR and motion work. Bilingual (Japanese and English).
- Type: **Inter** (300 to 700) with **Instrument Serif** (including italic). Large display sizes use `clamp(44px, 6.5vw, 72px)`.
- Colour: near-black `#0b0b0c` with text `#e9e4d8`, and a warm paper light theme `#ece6d8` with text `#1a1a18`. One accent, red-orange `#ff3b24`. A yellow `#ffe58a` "paper" token. Greys are warm (`#807c72`, `#2a2926`). So: two environments, **one** accent, warm neutrals.
- 3D: a preloaded `.glb` model ("white" variant, Draco-compressed) rendered with WebGL, so a real three.js scene, not video.
- Motion: GSAP (CDN), custom easing `cubic-bezier(.16, 1, .3, 1)`, a "curtain" page transition module, a scroll progress variable (`--p`), and a counting preloader ("seq 001, est.2026, loading 000%").
- Theme: a blocking script sets the theme class before first paint, so there is no flash. One persisted key across all pages.
- A "works" strip whose height is a CSS variable, which suggests a persistent bottom or edge project index.

**Inferred (verify visually):** one hero 3D object that is driven by scroll position; serif italic used as a contrast voice against Inter; heavy restraint (almost no decoration beyond the object and type).

**What it does well, which we should learn from:** one dominant object per moment; a single accent; serif-versus-sans contrast; theme set before paint; transitions that feel like a place changing, not a page loading.
**Where it would not fit us as-is:** it is a personal portfolio with a few projects. NorthVault sells six service lines to businesses and needs to convert (contact form, trust, SEO). Our pages are server-prerendered, so any 3D must be a client-only layer.

## 2. Reference vs. our Signal Poster proposal

| | RI.Studio (as read) | Signal Poster (what we built) |
|---|---|---|
| Dimension | 3D object, camera, depth | Flat, graphic, poster blocks |
| Colour | 2 environments, 1 accent | Many flat hues on ink and paper |
| Type | Inter + Instrument Serif | Syne + DM Sans |
| Motion | Continuous, object-led | Section reveals, marquees |
| Tone | Quiet, cinematic, premium | Loud, graphic, editorial |
| Strength | Memorability, craft signal | Clarity, speed, SEO, low risk |
| Weakness for us | Few conversion cues, GPU cost, SSR friction | Less "wow", no engineering signature |

**Conclusion:** they are complementary. Signal Poster gives us the multi-colour system and fast, indexable structure. The reference gives us dimension and pacing. The three directions below vary how much of each we take.

## 3. Facts about our project that constrain every direction
1. **Nothing to install.** `three` (^0.184), `ogl`, `gsap` 3.15 (with ScrollTrigger and SplitText), `lenis` and `animejs` are already in `package.json`. `three`, `ogl` and `animejs` are currently unused. `@gsap/react` is **not** installed, so use `gsap.context()` in `useLayoutEffect` (the pattern already in the Signal components), not `useGSAP`, unless you approve a dependency later.
2. **SSR/prerender must survive.** 3D mounts client-side only, after hydration, behind a lazy import. The server HTML contains the full text and a static poster frame for the hero. This keeps SEO and LCP intact.
3. **Images are generic service art**, and some carry old baked-in text. You said no replacements, so no direction depends on photography. Imagery is generated in code (3D, CSS, SVG) or used small and cropped.
4. **Real content only.** Six services, four shipped projects, five-step process, "NDA on request", "reply within 24h". No invented stats or logos.
5. **Buttons never move on hover.** Hover = colour, light, fill.
6. **Existing assets:** the site has a dark/light toggle and CSS variable theming, and a duplicate-motion issue (framer-motion alongside GSAP) that any direction should collapse to GSAP only.
7. **3D asset reality:** we have no `.glb` models and must not generate replacement images. All 3D objects are **procedural** (parametric geometry built in three.js: lattices, extruded glyphs, wireframe vaults, instanced cubes). That also keeps payload near zero.

---

## 4. Direction A: Vault Interior (3D immersive storytelling)

**One line:** the visitor travels *into* the vault. Scrolling moves a camera through a continuous 3D space, and each section is a chamber.

### Color system
Dark-first, one hero accent plus a service palette that appears only as light inside the scene.
- Base `#07080C`, surface `#10121A`, text `#EDEAE2` (warm, like the reference), muted `#8A8C96`.
- Accent: **Vault orange** `#FF6A13` (brand continuity with today's orange). Used for CTAs, the active object edge and focus rings.
- Six discipline hues (AI violet `#8C6BFF`, Software cyan `#38D5FF`, Web mint `#5BE7B1`, Cloud blue `#5B86FF`, Data amber `#FFC24D`, Brand coral `#FF7A8A`) appear only as **emissive light on the corresponding object** when its section is active. Never as flat fills.
- Light theme "Daylight Lab": base `#ECE8DF`, ink `#12131A`, same accent darkened for text (`#B83E00`), 3D scene re-lit with a bright studio HDR look and soft shadows.

### Typography
- Display: a wide grotesk at 11 to 18 vw for single words (for example "ENGINEER" spanning the viewport behind or in front of the object). Candidate: **Space Grotesk** or **Bricolage Grotesque** (not Inter, to stay distinct).
- Editorial voice: **Instrument Serif**-style italic for one phrase per section ("what's next"). A different serif than the reference's is preferable; **Fraunces** or **Newsreader** italic.
- Mono for engineering labels: **JetBrains Mono** at small sizes, used sparingly for real metadata only (stack names, project type).
- Fluid `clamp()` scale, tight tracking on display, no all-caps eyebrow on every heading.

### Hero concept
A dark chamber. A procedural **vault lattice** (a cube made of a 6x6x6 instanced frame, with a glowing core) hangs centre. The giant word **"ENGINEER"** sits behind it; **"What's next."** in serif italic sits in front, partially occluding the object's edge. Pointer movement tilts the object a few degrees. Counter-style intro loader (a short, 1.2 s count-in that doubles as asset warm-up, skippable and skipped for returning visitors). The `<h1>` and tagline are real DOM text.

### 3D visual treatment
- Procedural only: instanced box lattice, extruded outline of the vault door, line geometry for "circuit" paths, one point light per discipline.
- Materials: matte graphite with emissive edge lines (cheap), no heavy PBR or HDR textures.
- One shared `Canvas`, fixed behind content, one object system that morphs between chambers (lattice, then gears of text blocks, then a network graph, then back).
- Quality tiers: DPR capped at 1.5, 30 fps fallback on low-power, static poster on reduced motion or no WebGL.

### Scroll interactions (GSAP)
- One master `ScrollTrigger` timeline scrubbing camera position and object morph (`scrub: 1`), pinned chapters for the hero and services only.
- Large type scales and slides with scroll; the serif phrase swaps word by word (SplitText, `mask`).
- Section transitions are camera moves plus a brief colour wash in the incoming discipline hue (the reference's "curtain" idea, done as a light wipe).
- Lenis stays for desktop; off on touch and reduced motion.

### Homepage sections
1. Hero chamber (ENGINEER / What's next.)
2. Who we are: object opens, three short statements reveal on scroll.
3. Services: six chambers, one per discipline, camera docks at each, copy swaps in sync, discipline hue lights the object. Pinned.
4. Work: four real projects as "vault drawers" (stacked panels sliding out of the lattice). Each has its real description and stack. Images are shown small and cropped, never full-bleed.
5. Process: the real five steps as a path the camera follows.
6. Why NorthVault: NDA, 24 h reply, Chandigarh, engineering-first.
7. Contact: object closes into a door; form on the open side.

### About page
Scene resets to a calmer, slower chamber: founder/team narrative as long-form editorial text with the lattice slowly assembling as you read. (Team photos are not available, so no portraits are implied.)

### Services page
A fixed 3D index on the left (six small objects), detailed copy scrolling on the right. Clicking an object scrolls to its discipline and re-lights the scene.

### Contact page
Form on a flat panel over a dim, slow scene. 3D is paused while typing (saves GPU and avoids distraction). Topic chips use the six discipline hues.

### Mobile experience
No scrubbed camera on touch. Replace with a **lighter per-section 3D "card" (single rotating object, drag to tilt)** or the static poster, and ordinary vertical scrolling with GSAP reveals. Pins removed below 768 px. Type scales to ~16 vw single words.

### Performance considerations
- Highest risk of the three. Budget: <150 KB extra JS gzip (three tree-shaken, lazy), no textures, one draw call group via `InstancedMesh`.
- LCP from DOM text and CSS poster, not the canvas. Canvas mounts after `requestIdleCallback`.
- Pause rendering when off-screen or tab hidden; dispose geometries on route change; `ScrollTrigger.refresh` after fonts.
- Must test on a low-end Android and on integrated GPUs before sign-off.

**Risks:** GPU/battery, motion sickness, SSR complexity, the hardest content-first accessibility story. Needs a solid reduced-motion path.

---

## 5. Direction B: Meridian (editorial minimalism)

**One line:** a printed-magazine feel. Almost no decoration; scale, whitespace and type do everything. Motion is slow and typographic.

### Color system
- Light-first "Paper": base `#F3F0E8`, ink `#14141A`, rule lines `#14141A` at 12%.
- Dark "Ink": base `#0C0C10`, text `#ECE9E0`.
- **One** brand accent at a time per page, rotating by discipline (Services page uses all six, one per section: cobalt `#2F3BFF`, tangerine `#FF6A13`, lilac `#BFA9FF`, chartreuse `#D6F26B`, rose `#FF9EC4`, sky `#8FD0FF`). Home uses only tangerine plus cobalt for links. This is a quieter version of Signal Poster's palette.
- Avoid the "cream + serif + terracotta" cliché by keeping the neutral cool-leaning and the accent cobalt-led, not terracotta.

### Typography
- Display serif at very large sizes: **Fraunces** (optical size axis, soft) or **Gloock**; one weight, light tracking.
- Sans for UI and body: **DM Sans** (already loaded) or **Instrument Sans**.
- Mono for index numbers and captions: used only where a real sequence exists (the five-step process, project index).
- Pull quotes and the tagline in serif italic at 8 to 12 vw.

### Hero concept
A near-empty page. "We engineer what's next." set in giant serif, one word per line, each line revealing from a mask. A thin horizontal rule draws across. A small CSS-only geometric mark (a nested square, the vault) rotates one step per scroll tick. No video, no canvas.

### 3D visual treatment
Essentially none. A single **CSS 3D** transform object (a rotating cube or folded plane built from borders, `transform-style: preserve-3d`) appears only in the About page and footer, as a signature rather than a feature. No three.js loaded on any page.

### Scroll interactions
- Text-led: lines mask-reveal; a long statement fills word by word as you scroll (`fillWords`, already built); headings change weight/colour via variable-font axes while pinned.
- Section transitions are page-colour changes (paper to ink to accent block) rather than camera moves.
- One pinned chapter (services list with large serif titles swapping) and nothing else pinned.

### Homepage sections
1. Hero statement.
2. Who we are: scroll-filled paragraph.
3. Services: six rows, huge serif titles, hover reveals a one-line description and discipline colour fill (colour change only).
4. Work: four projects as an index list with a single preview panel that follows the pointer (cropped service art, small).
5. Process: the five real steps in a two-column editorial spread.
6. Why / trust facts: NDA, 24 h, location.
7. Contact CTA with the form.

### About page
Long-form editorial: manifesto, principles, a timeline only if we have real dates. No portraits unless supplied.

### Services page
Six chapters, each with a short essay, a "what we deliver" list and related project. Side index highlights as you scroll.

### Contact page
Calm, form-forward page. Large serif heading, discipline chips in their hues, direct email and "NDA on request".

### Mobile experience
Strongest of the three: the layout is already single-column and type-led. Serif sizes scale with `clamp`, no pins, no heavy motion, reveals only.

### Performance considerations
Best of the three. No WebGL, no large images; fonts are the main cost (subset, `font-display: swap`, preload the display face). Expect excellent LCP and CLS, and the easiest SSR/hydration story.

**Risks:** least "wow", does not show off engineering ability; depends on excellent copy and typography; the weak generic imagery is simply hidden, which suits it.

---

## 6. Direction C: Engineered Atlas (hybrid, recommended)

**One line:** editorial typography as the backbone, with **one** deliberate 3D "engineering object" per key moment and a colour system that maps to disciplines. It reads as an engineering studio that also has taste.

### Color system
- Dark "Blueprint Night": base `#0A0B10`, surface `#12141C`, text `#EEEBE3`.
- Light "Drafting Paper": base `#EFEBE2`, ink `#12131A`, grid lines `#12131A` at 8%.
- Primary accent: **Vault orange** `#FF6A13` (CTA, focus, primary edge light). Secondary: cobalt `#2F3BFF` (links, active states).
- Six discipline hues as in Direction A, but used in **two ways only**: the emissive light in the 3D object, and thin 2 px "tab" strips on service cards and project tags. Never large flat fields. This keeps it multi-colour without noise.
- Every text pair measured to 4.5:1 (3:1 for large text) before shipping.

### Typography
- Display: **Bricolage Grotesque** or **Space Grotesk** (wide, tight), 10 to 16 vw for key words.
- Editorial accent: serif italic (**Fraunces** or **Newsreader**) for one phrase per section, never the whole headline.
- Mono for engineering metadata: **JetBrains Mono**, small, real data only (stack names, project type, "reply within 24h").
- Body: **DM Sans** (already loaded).
- Avoid: single-word-accent headlines on every heading, all-caps eyebrows on every section, decorative numbering.

### Hero concept
Split composition on a faint engineering grid. Left: "We engineer what's next." in large grotesk, with "what's next" in serif italic and a text swap that cycles through real capabilities ("AI systems", "mobile apps", "cloud platforms") using the existing `LoopingWords`-style behaviour, but done in GSAP. Right: a **single procedural vault object** (wireframe cube with an inner glowing core) that responds to the pointer and to scroll. Below, a thin ticker of real stack names.

### 3D visual treatment
- Same procedural approach as A, but **one object, one canvas, small footprint**, not a full environment. Roughly 40% of the viewport on desktop.
- The object morphs through three states tied to scroll: **lattice (hero) to network graph (services) to open door (contact)**.
- Wireframe edges plus one emissive core, orange by default and the discipline hue when a service is active. Light theme shows it as a dark ink wireframe on paper, like a technical drawing.
- Non-hero 3D is replaced with SVG/CSS line drawings (cheap, crisp, SSR-friendly), for example a drawn stack diagram in the Stack section.

### Scroll interactions (GSAP)
- Hero: scale and rotate the object on scroll; headline lines mask-reveal; the serif phrase swaps word by word.
- Services: one pinned chapter; the object morphs and re-lights per discipline while cards advance. This is the single most cinematic moment.
- Work: horizontal gallery driven by vertical scroll (one pin), images scale from a crop to larger on hover or focus, with a clip-path reveal.
- Everything else is non-pinned reveals and filled-word paragraphs.
- Page transitions: a short colour-wipe "curtain" in the destination's accent, 500 ms.
- `gsap.matchMedia()` splits desktop, touch and reduced-motion behaviours; `ScrollTrigger.refresh` after fonts.

### Homepage sections
1. Hero (headline + vault object + stack ticker)
2. Who we are (scroll-filled statement)
3. Services (pinned, object morph, six disciplines)
4. Work (four real projects, one gallery, merging today's two duplicate sections)
5. Engineering stack (drawn diagram, real tech names)
6. Process (five real steps)
7. Why NorthVault (NDA, 24 h, Chandigarh)
8. Contact (object becomes an open door; form)

### About page
Editorial spread on the drafting grid, with the object in a calm, slowly assembling state beside the text. Principles in serif, facts in mono. No invented team photos.

### Services page
Sticky left column: small object plus discipline index. Right: detailed service blocks with deliverables, stack, and linked project. Selecting a discipline re-lights the object.

### Contact page
Mostly flat. Slim object in an "open" state, paused while typing. Discipline chips, direct email, response promise, NDA note. Honest form states and inline validation.

### Mobile experience
- No pinned scrubbing below 768 px. The hero object becomes a smaller, drag-to-tilt canvas or, on low-power devices, a static poster frame.
- Services becomes a vertical stack of cards with the discipline strip; the object appears once per card as a CSS/SVG icon.
- Work gallery becomes a native horizontal scroll-snap row. Touch targets ≥ 44 px, safe-area padding, no custom cursor.

### Performance considerations
- One lazy WebGL canvas (<100 KB gzip added), mounted after idle, paused off-screen, DPR capped, disposed on route change.
- Hero text and a CSS poster of the object are in the prerendered HTML, so LCP is not tied to WebGL.
- Remove framer-motion usage over time so only GSAP animates; no duplicate runtimes.
- Test budget: Lighthouse performance ≥ 90 on mobile for non-hero routes, ≥ 80 for home; reduced-motion and no-WebGL fallbacks verified.

**Risks:** more design/engineering effort than B; needs discipline to keep the 3D to "one object", not a whole world.

---

## 7. Side by side

| | A: Vault Interior | B: Meridian | C: Engineered Atlas |
|---|---|---|---|
| Wow factor | Highest | Lowest | High |
| Engineering identity | Strong | Weak | Strongest |
| Conversion clarity | Medium | High | High |
| Multi-colour brand | As light in scene | Rotating per section | Light + thin strips |
| Perf / mobile risk | Highest | Lowest | Medium |
| SSR/SEO friction | High | None | Low–medium |
| Works with weak current images | Yes (no photos) | Yes (hidden) | Yes (small crops) |
| Effort | Highest | Lowest | Medium–high |
| Reuses Signal Poster work | Little | Much (type, palette) | Moderate (sections, content, motion helpers) |

## 8. Recommendation
**Direction C.** It borrows the reference's best lesson (one dominant dimensional object, serif/sans contrast, a place-changing transition) without the cost of a full 3D world, keeps the Signal Poster content, SEO and multi-colour logic, and says "engineering studio" more clearly than either alternative. If you want to minimise risk first, B ships fastest and C can be layered on later by adding the single object.

## 9. Rules from the skills that shaped this study
- **premium-saas-web:** glow used sparingly and tied to meaning; buttons don't move on hover; giant tight-tracked headlines; scroll-scrubbed text reveals.
- **frontend-design:** no templated eyebrow-above-every-heading, no decorative numbering, no cream/serif/terracotta default, a clear aesthetic point of view per direction.
- **gsap-core / timeline:** one master timeline per chapter, position parameters, `gsap.matchMedia()` for desktop/touch/reduced motion.
- **gsap-scrolltrigger:** few pins (hero and services only), `scrub`, `refresh` after fonts/images, kill triggers on unmount.
- **gsap-react:** `gsap.context()` scoped to refs with cleanup (since `@gsap/react` is not installed); no animations during SSR.
- **gsap-performance:** animate transforms and opacity only, batch reads and writes, `will-change` only while animating, pause off-screen.
- **web-design-guidelines:** visible focus states, 4.5:1 contrast, `prefers-reduced-motion` honoured, semantic headings, labelled form fields, no content that exists only in the canvas.

## 10. Open questions for your selection
1. Pick A, B or C (or a named blend).
2. Light or dark as the default theme?
3. Is a one-time loader/preloader acceptable (the reference has one), or should the site be instant?
4. May the 3D layer be added behind a feature flag so we can compare it against the current build?
5. Are there real team members, project screenshots or photos you can supply later? Several sections would improve a lot with them.

Waiting for your selection.
