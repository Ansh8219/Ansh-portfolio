# NorthVault redesign: Phase 1 report (homepage)

Date: 2026-11-13 · Branch: `website-refresh-new-images` · **Not committed, not deployed.** Waiting for your homepage review before Phases 2 to 5.

## 1. What direction this is

**Engineered Atlas**, as approved, with the editorial studio language you asked for after sharing the Webdrift reference:
- giant, tight grotesk headlines;
- mono "Fig. 0X" captions;
- an orange square marker on each section;
- sharp rectangular buttons, the primary one with a separate arrow cell;
- dark and paper sections alternating;
- a full-screen menu, a section counter in the bar, and a cycling word in the footer.

Webdrift was used only as a reference for that language. **Nothing was copied from it**: no images, graphics, code, copy or exact layouts. Every visual on the page is NorthVault's own:
- the procedural 3D "vault unit" (a solid, product-style safe with a live display, dial, handle and a door that opens);
- CSS and SVG drawings;
- NorthVault's existing service art and studio video.

The accent is NorthVault orange `#FF6A13`.

## 2. Final decisions applied

| Decision | Status |
|---|---|
| Blueprint Night dark default, Drafting Paper light, toggle kept | Done (`src/styles/atlas.css`, `ThemeContext`, `index.html` theme-color) |
| Intro splash removed, premium hero entrance instead | Done: masked headline lines, rings and axes drawing in, object arriving. Plays once on the client; the prerendered HTML is already the final readable state |
| Caveat handwriting retired | Done on the homepage. Caveat is no longer loaded |
| Typography | Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (metadata only). Fraunces italic is loaded but currently unused on the homepage (the editorial direction leaned pure-grotesk); it can be dropped in Phase 5 |
| WhatsApp floating button | Kept. Hidden only while the full-screen menu is open |
| One procedural Three.js vault, 3 states tied to scroll | Done (`src/three/vault.js`). After your review the wireframe lattice/network was replaced by a solid product-style **vault unit**: Hero = product shot (display shows "NV"), Services = facing front, its display shows each discipline and its accents take the discipline colour, then it zooms into the camera to hand over to Work; Contact = door swings open, glowing core inside |
| 3D behind a feature flag | Done (see section 4) |
| Featured Work + Proof of Work merged | Done: one "Selected work" showcase with the four real projects |
| No invented clients, testimonials, stats, awards, certifications, team sizes | Respected. Only approved copy is used. New UI wording is limited to labels and options, listed in section 7 |

## 3. Homepage, section by section

| # | Section | What it does |
|---|---|---|
| 00 | **Hero** | "We Engineer / What's Next." bottom-left. The 3D vault unit sits top-right inside a measured figure (rings, dotted field, crosshair, live pointer coordinates, "Fig. 01 · Vault unit"). Intro copy and the two buttons sit bottom-right, with a ruled caption bar underneath. On scroll the headline drifts and the figure scales away |
| 01 | **Studio** (paper) | The approved "who we are" statement fills word by word as you scroll. Then come three ruled facts (Chandigarh, reply within 24h, NDA on request), the second paragraph, and buttons to About and Services. The studio film opens from a clip-path mask and scales down, captioned "Fig. 02" |
| 02 | **Services** (pinned) | On desktop the stage pins. The current discipline's word sits large top-left with its approved description and features. The vault unit sits centre-stage; its display switches to the discipline (AI, </>, Apps, Cloud, Data, Brand) and its LED and key take the discipline's colour. The next discipline waits ghosted bottom-right. A clickable 01 to 06 index top-right jumps to any discipline. At the end of the pin the text fades and the unit zooms into the camera until its display fills the screen, then the Work section takes over (with 3D off, the static illustration does the same zoom). Below 1024px this becomes a plain list |
| 03 | **Work** (pinned full-screen stage) | One full-screen frame stays pinned while you scroll through the four real projects. Only one project is ever on screen: when the scroll crosses into the next project's slice, a short transition plays inside the frame. The new image wipes in from the scroll direction (clip-path) and settles from a zoom, the old one drifts away, the project name rises out of a mask and the details follow. Scrolling back reverses the direction. Images stay bright: only the top bar and the top-left corner are lightly shaded, and the details sit on a small frosted panel bottom-right so they stay readable over the image. Each frame shows the counter (01 / 04), the project index with the current one highlighted, category, name bottom-left, description, lead discipline, status, stack and "Start a similar project". Without JS or with reduced motion: four full-screen frames in a row |
| 04 | **One team** (paper) | Replaces the Stack section. Label "One team" left and a live "01 / 06" counter right on a ruled bar; one giant word cycles through the six disciplines (AI. Software. Web & Mobile. Cloud. Data & QA. Brand.), letters dropping out and rising in through a mask, the full stop in the discipline's colour; underneath, "AI, software, web, cloud, data and brand, designed and built under one roof." and an "Explore all services ↗" link to /services. Cycles only while on screen; static first word with reduced motion |
| — | **Footer = Contact** | The separate Contact section was removed; like the reference, the footer is the contact block (it carries id="contact" on the home page, so the nav's Contact and the section counter land on it). Orange "■ Contact" label and live Chandigarh time on a bar, big "Got a project in mind?", an orange rule, email + "Start a project ↗", nav, studio details (phone, reply within 24h, NDA on request, socials), and a giant word cycling Engineer. / Build. / Launch. / Scale. Entrance when it scrolls into view: glow fades up, heading lines rise out of a mask, the rule draws across, details follow, the big word rises in. The brief-builder form now lives only on the /contact page (Phase 4) |
| — | **Nav and menu** | Logo, live section counter ("02 Services") with page progress line, Chandigarh time, theme toggle, "Start a project", Menu. The menu is a full-screen dialog with big numbered links and the vault artwork, with Escape and focus trap |

Route transitions: a two-layer curtain wipe (dark, then orange).

## 4. 3D feature flag and fallbacks

**Flag** (`src/motion/vaultFlag.js`). The first match wins:
1. `?vault=on` or `?vault=off` in the URL. It is remembered on this browser; `?vault=reset` forgets it.
2. The value remembered from a previous visit.
3. The build-time env `VITE_VAULT_3D=off`, which disables it. **The default is on.**

**The WebGL scene only loads when all of these hold:**
- home route;
- not a software (CPU) WebGL renderer;
- flag on;
- viewport ≥ 900px;
- fine pointer;
- motion allowed;
- no Save-Data;
- WebGL available.

Otherwise the static SVG vault stays on the page. That SVG is generated from the same node data as the 3D scene.

| Case | Result |
|---|---|
| Mobile / touch | Static SVG illustration of the vault unit (closed, and open in Contact). three.js is never downloaded |
| Reduced motion | Static SVG. Also no entrance, no scroll scrubbing, no pins, no marquee, no footer word cycling |
| No WebGL / context lost | Static SVG (context loss switches back automatically) |
| SSR | Full text and the SVG visuals are in the prerendered HTML |
| Software WebGL (no GPU acceleration) | Static SVG. Override for QA only: `?vault-allow-software` |
| Hydration | No mismatches in any of the 6 test runs. The canvas, the clock and the pointer coordinates are all added after hydration. The poster geometry uses exact arithmetic only, so server and client agree |

## 5. Screenshots

All are in `redesign-screenshots/phase1-atlas/`.

| Set | Viewport | Shots |
|---|---|---|
| `desktop-dark-3d-on-*` | 1440×900 | hero, studio, services (2 states), work, stack, contact, footer, menu |
| `hero.png`, `svc-start.png`, `zoom-30.png`, `zoom-70.png`, `work-enter.png`, `work-in.png` | 1440×900 | the services → work zoom transition, step by step |
| `desktop-dark-3d-off-*` | 1440×900 | same, static SVG visuals |
| `desktop-light-3d-on-*` | 1440×900 | same, light theme |
| `desktop-light-3d-off-*` | 1440×900 | same, light theme, static |
| `mobile-dark-*` | 390×844 | same sections + menu |
| `mobile-light-*` | 390×844 | same sections |

Screenshots were taken in headless Chrome with software WebGL (SwiftShader), so 3D edges look slightly softer than on a real GPU.

## 6. Performance

**How it was measured**
- The production build was served locally with `vite preview` and loaded in headless Chrome 154.
- Desktop is 1440×900, mobile is 390×844.
- "CPU ×4" is Chrome's CPU throttling. "Slow 4G" is 1.6 Mbps down with 150 ms latency.
- Sizes are uncompressed bytes as served by `vite preview`; real hosting adds gzip or brotli.
- These are lab numbers from one machine, not field data. **No Lighthouse score was run.**

| Run | LCP | CLS (load) | Total blocking time | Scroll FPS (hero → services) | JS |
|---|---|---|---|---|---|
| Desktop, 3D on (×3 runs) | 1.56–1.78 s | 0.002 | 460–520 ms | 20–25 * | 1063 kB (incl. 496 kB 3D chunk) |
| Desktop, 3D off | 1.72 s | 0.002 | 56 ms | 56.5 | 567 kB |
| Desktop, 3D on, CPU ×4 | 1.47 s | 0.002 | 1815 ms | 15.9 * | 1063 kB |
| Desktop, 3D off, CPU ×4 | 2.48 s | 0.002 | 731 ms | 46.3 | 567 kB |
| Mobile, CPU ×4 + slow 4G | 4.06 s | 0.017 | 738 ms | 60.1 | 567 kB (no 3D) |

\* **The 3D frame rates were measured on software WebGL (SwiftShader, rendered on the CPU).** This machine's headless Chrome has no GPU, so those numbers are the worst case, not what a GPU will do. I could not measure on a real GPU here. Please check the 3D on your own machine with `?vault=on`.

Because CPU-rendered WebGL is this slow, **the site now detects a software renderer** (SwiftShader, llvmpipe and similar) **and keeps the static vault instead of starting the 3D scene.** I checked this: `?vault=on` in headless Chrome now falls back to the SVG. QA can force the scene with `?vault-allow-software`, which is how the "3D on" screenshots were taken. The 496 kB three.js chunk is still downloaded before that check runs; fixing that is a Phase 5 item.

**Fixed during measurement.** The first mobile slow-4G run never reached the `load` event within 30 s. Three things were downloading on page load:
- the old 2 MB `hero-character.png` from the previous hero;
- all six service images, at high priority;
- the 4.4 MB studio video, plus its 1.9 MB poster image.

Fixes:
- Removed the unused `hero-character` image from the preload list, and dropped two stale preloads from `index.html`.
- Service images now warm only after `load`, when the browser is idle.
- `DecorativeVideo` no longer sets `autoplay`, so the video only downloads when it scrolls into view. This also affects the old Signal components that use it.
- Removed the 1.9 MB poster.

Result: images on first load dropped from **4.9 MB to 0.9 MB**, video on mobile first load from multiple MB to **0**, and mobile load completes in 3.7 s on slow 4G.

**CLS.** One desktop run once recorded a CLS of 1.0 *after* the scripted scroll. It did not happen again in three repeat runs, and CLS during load was 0.002 every time. It was likely a ScrollTrigger refresh landing during the scripted jump-scroll. I'll keep watching for it in Phase 5.

**What the numbers mean**
- With 3D off, the homepage is light: TBT 56 ms, about 57 FPS, CLS 0.002.
- The 3D layer costs about 0.5 MB of JavaScript and about 400 ms of extra main-thread time on desktop. It never loads on phones, touch devices, reduced motion, Save-Data or software WebGL.
- Whether to keep 3D on by default is your call after you try it on a real GPU.

## 7. New UI wording (please check)

None of this states a fact about the company. It is all labels, options or prompts:
- Section labels: Intro, Studio, Services, Work, Stack, Why us, Contact. Figure captions: "Fig. 01 · Vault unit", "Fig. 01 · Digital engineering & AI solutions", "Fig. 02 · The studio".
- Services: "Six disciplines, one team". Short words: AI, Software, Web & Mobile, Cloud, Data & QA, Brand.
- Work: "Selected work", "Four platforms we designed, built and shipped. Details shared under NDA on request." Meta labels: Lead discipline, Status, Stack. "Start a similar project".
- Stack group titles: "Languages & frameworks", "Backend & data", "Cloud, DevOps, AI & tools".
- Contact: "A project in mind?", the timing options (As soon as possible / In 1–3 months / Just exploring), "Send my brief".
- Footer: "Got a project in mind?", the words Engineer. / Build. / Launch. / Scale.
- Vault display text: "NV", "NorthVault · ready", the six short discipline words.

## 8. Files

**New**
- `src/three/vault.js`: the WebGL scene, lazy-loaded.
- `src/motion/vaultFlag.js`.
- `src/components/atlas/` (11 files): Hero, Story, Services, Work, Stack, Why, Contact, VaultStage, VaultPoster, SectionLabel.
- `src/styles/atlas.css`.

**Changed**
- `src/pages/Home.jsx`
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/components/signal/PageTransition.jsx`
- `src/App.jsx` (mounts `VaultStage`)
- `src/main.jsx` (imports `atlas.css`)
- `src/context/ThemeContext.jsx` and `index.html` (theme colours, fonts, removed unused hero-character preloads)
- `src/index.css` (Syne swapped for Bricolage in legacy rules)
- `src/hooks/useContactForm.js` (service and timing added to the message)

**Backups:** the Signal Poster versions of every replaced file are in `redesign-backup/signal-poster/`.

**Untouched:**
- `package.json` and the lockfile, so no dependencies were added or removed;
- the SEO table and the prerender pipeline;
- all assets;
- the About, Services, Contact and 404 pages.

## 9. Changes after your first review

- **Hero object:** the wireframe was replaced by a solid, lit, product-style 3D **vault unit** (our own design, not a copy of any reference object).
- **Services:** the unit sits in the centre and its display changes per discipline. Words, panel text and the unit were reduced in size. The section now ends with the unit zooming into the camera and handing over to Work.
- **Work (rounds 2–4):** the horizontal gallery became a pinned full-screen stage where projects swap in place (one at a time, no overlapping frames, lighter shading, frosted details panel). Card and sticky-overlap versions were tried in between and dropped at your request. Screenshots: `work-*-1-project1`, `-2-transition` (mid-wipe), `-3-project2`, `-4-project3`, `-5-project4` for desktop dark, desktop light and mobile.
- **Footer:** the greetings were replaced by NorthVault words (Engineer. / Build. / Launch. / Scale.).
- **Nav counter fix:** the counter showed "Studio" while you were inside the pinned Services and Work sections; it now follows tall and pinned sections correctly.
- The new 3D chunk is 522 kB (133 kB gzip). It is slightly larger than before because it now includes lighting, rounded-box geometry and a room environment. The performance numbers in section 6 were measured before this change, so I need to re-measure them.

- **Removed (round 4):** the "Why us" section, and the 3D vault door animation that played while scrolling into Contact. The vault unit now appears only in the hero and the services stage.

- **Round 5:** the Stack section was replaced by the "One team" cycling-word section (see section 3). The technology list itself is not on the homepage any more; it can move to the Services page in Phase 2.

- **Round 6:** the homepage Contact section was removed; the footer is now the contact block with its own entrance animation. Every "Start a project" button (nav, hero, work frames, footer) now goes to the /contact page.

- **Round 7, new artwork:** 11 brand-palette, text-free images (generated by you with ChatGPT from the prompts) were converted to WebP in `public/images/nv/` (about 21 MB of PNG down to about 0.9 MB, with a small variant for phones):
  - **Work:** the four full-screen project frames use `work-befit`, `work-dawat`, `work-service-network` and `work-catering`.
  - **Studio:** the studio image `studio` replaced the 4.4 MB "who we are" video.
  - **Services page (ready for Phase 2):** the service artwork `service-software`, `service-web-mobile`, `service-cloud`, `service-data-qa` and `service-brand` is wired into `src/content/site.js`.
  - **Social share:** `og-cover.jpg` (1200×630, cropped from the vault render) is now the og:image and twitter:image on every page.
  - **AI service:** `service-ai` (violet-orange energy orb), added in a follow-up.
  - **Originals:** the original PNGs were moved out of `public/` to `design-assets/generated-images/`, so they no longer ship with the site. Nothing was deleted.

## 10. Known issues and what's next

- **The other three pages are not redesigned yet.** They pick up the new colours and fonts, but still use the older Signal layouts. That is Phases 2 to 4.
- **The 3D chunk is larger than planned.** It is about 130 KB gzipped against my earlier estimate of under 100 KB. It never loads on mobile or before first paint, but it can be trimmed in Phase 5.
- Work images are brand illustrations, not real product screenshots. Real screenshots would still be the most convincing option later.
- **Leftover code** remains: the unused Signal components, `framer-motion`, `three`'s unused siblings (`ogl`, `animejs`), and the large unused videos in `public/`. These are Phase 5 clean-up.
- **The screen recording `Screencast From 2026-11-13 12-03-56.mp4` (82 MB) is in the project root.** It should not be committed. Move it out or add it to `.gitignore`.
- **Vercel Speed Insights** returns 404 in local preview. That is expected; it only exists when deployed on Vercel.
- **QA-only URL params:** `?vault-debug` and `?vault-allow-software` exist only for testing and change nothing for normal visitors.
