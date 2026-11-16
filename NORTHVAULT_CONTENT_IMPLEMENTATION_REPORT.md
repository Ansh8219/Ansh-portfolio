# NorthVault Studios — Content Implementation Report

Date: 2026-11-13 · Branch: `website-refresh-new-images` · Not deployed, not committed.
Strategy source: `NORTHVAULT_CONTENT_STRATEGY.md` (Revision 3).

## Files changed (this task)
| File | Change |
|---|---|
| `src/pages/Home.jsx` | Six service cards, Who We Are, Tools intro, Featured Work intro, project years removed, Why Choose Us, Proof of Work data and headings, contact copy, hero pills, CTA label. Unused icon imports removed. |
| `src/components/HeroContent.jsx` | Tagline, eyebrow, headline, lead, "4 Featured Projects". Stock Unsplash avatar list removed. |
| `src/components/lightswind/trusted-users.tsx` | Avatar block optional (skipped when empty), hardcoded "+" removed, defaults updated. |
| `src/components/HeroTicker.jsx` | Ticker items cover all six services. |
| `src/components/TestimonialsMarquee.jsx` | Quote mark and initials avatar removed. `aria-label` now "Shipped projects". |
| `src/components/Footer.jsx` | Footer description. |
| `src/pages/About.jsx`, `Services.jsx`, `Contact.jsx` | Copy per strategy. Services page icons swapped to fit the six cards. |
| `src/seo/routes.js`, `index.html` | Titles, descriptions and keywords meta. |
| `NORTHVAULT_CONTENT_STRATEGY.md` | Updated to Revision 3. |

No CSS, animation, routing, SEO machinery or dependency changes. Many other files were already modified in the working tree before this task and were left alone.

## Verification
- **Production build:** passes (`SITE_URL=https://example.com npm run build`). The real domain isn't configured in the repo, so a placeholder was used; canonicals in `dist/` therefore point at example.com. Set the real `SITE_URL` for the deploy build.
- **Routes:** `/`, `/about`, `/services`, `/contact` all prerendered and load. Each has its own title, description and canonical (checked in `dist/*.html`). JSON-LD is still present.
- **Layout, desktop 1440×900 and mobile 375×812:** no horizontal page scroll on any route. No clamped or truncated descriptions. The only "clipped" hit is a screen-reader-only text node.
- **Fixed during testing:**
  - Hero line 2 ("Built to Scale.") overflowed on mobile, so it is now "Built to Last.", which is narrower than the original "Our Expertise." at every width tested (320–390px).
  - The Why Choose Us subline is `whitespace-nowrap` and was clipped on mobile (this also happened before the change). It is now "One team for engineering, brand and growth.", which fits at 375px.
  - Added the missing space before the hero lead's line break on mobile.
- **Removed claims:** no "250", testimonials, "futuristic", "agency" (except a video filename), or project years remain in the rendered HTML.

## Items needing your attention
1. **Service images still carry old baked-in text** (kept per instruction). Current mapping: AI → `service-website` ("Website Development"), Software → `service-branding` ("Great Products Are Built Together", fits), Web & Mobile → `service-mobile` (fits), Backend/Cloud → `service-cloud` (fits), Data & Quality → `service-social` ("Mobile Apps", mismatch and near-duplicate of card 3), Brand/Marketing → `service-uiux` ("UI/UX Design"). New artwork for cards 1, 5 and 6 would fix this.
2. **Tools section list is unverified.** I left the tool names as they were (Node.js, Django, Kubernetes, Jenkins, MongoDB, Firebase, TensorFlow, HubSpot and others). Only the Flutter/React/FastAPI/PostgreSQL/Redis/Celery/Docker/AWS stack is confirmed by the four projects. I removed the old "on real client work" wording from the intro. Please confirm or trim the rest.
3. **AI capabilities** (agents, generative AI, ML integration) are described as services, since no AI project is among the four featured. Please confirm they are offered.
4. **Proof-of-work cards** still sit in the testimonial-styled marquee. The section id `testimonials` and CSS class names were left unchanged, since renaming would touch CSS.
5. **Pre-existing, not touched:** 404s for `/ourServices/service-*.webp` (the picture component falls back to jpg) and for the Vercel speed-insights script when served locally. The Services showcase subtitle "Strategy → Build → Scale" is unchanged.
6. **Target markets** (USA, UK, Canada, Australia) are not claimed anywhere in the copy.

Screenshots and test scripts are in the session scratchpad and were not added to the repo.
