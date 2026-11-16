# NorthVault Studios — Content Strategy (Revision 3, approved)

**Status:** Approved and implemented. See NORTHVAULT_CONTENT_IMPLEMENTATION_REPORT.md.
**Scope:** Text and data only. No changes to layout, CSS, components, animations or sections.

---

## 1. Final positioning

| | |
|---|---|
| **Name** | NorthVault Studios |
| **Descriptor** | Digital Engineering & AI Solutions Studio |
| **Tagline** | We Engineer What's Next. |
| **Positioning** | A multidisciplinary team of developers that works as your complete technology partner, covering AI, software, web and mobile, backend, cloud and data, from first idea to production support. |
| **Markets** | USA, UK, Canada, Australia |
| **Tone** | Direct, technical, specific. No "agency" vocabulary, no superlatives, no invented numbers. |

**Words to retire:** "futuristic", "agency", "cutting-edge", "innovation first", "transform your digital presence", "years of experience", "trusted by 250+".
**Words to use:** engineer, build, ship, systems, platform, production, end to end, support.

### The six service cards (final, confirmed business offerings)
1. AI & Intelligent Systems
2. Software & Product Engineering
3. Web & Mobile Development
4. Backend, Cloud & Infrastructure
5. Data & Quality Engineering
6. Brand, Marketing & Social Media

Marketing, branding and social media management are paid services and stay visible on the Home hero pills, ticker, Why Choose Us, Services (home and page) and About. Cross-cutting capabilities (UI/UX design, technology consulting, integrations, ongoing engineering support) appear inside the cards and supporting copy.

---

## 2. Proof of capability (real projects only)

All four projects are already on the site. No metrics, client names or outcomes are added beyond what is stated.

| Project | What it demonstrates | Maps to categories |
|---|---|---|
| Befit Sports Booking Platform (Dubai) | Multi-role platform: Super Admin, Corporate Admin and a players' mobile app | 2, 3, 4, 5 |
| Dawat Food Delivery App | Multi-business admin plus one app serving customers, drivers and managers | 2, 3, 4, 5 |
| Service Provider Network | Posts, chat and calls between providers and customers | 3, 4 |
| Catering Management App | Role-based operations: expenses, payroll, daily tasks | 2, 4, 6 |

Stack on record: Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS.

---

## 3. Decisions (all resolved)

| # | Issue | Resolution |
|---|---|---|
| D1 | Fabricated testimonials | Replaced with **Proof of Work**: the four real projects in the same marquee. Quote marks and initials avatars removed from the card component. Marquee `aria-label` is now "Shipped projects". |
| D2 | "Trusted by 250+ clients" with stock avatars | Now **"4 Featured Projects"**. Stock avatars and the hardcoded "+" removed. |
| D3 | Marketing, Branding, Social Media | **Kept.** Confirmed paid services. They are card 6 and appear across the site. |
| D4 | Card images | Existing images kept and re-assigned among the six cards. Several still carry baked-in text from the old services (see the implementation report). |
| D5 | Target markets | No international client experience is claimed. Chandigarh, India stated plainly. |
| D6 | Project years | Removed. |
| D7 | Technologies | New copy names only technologies listed on the four projects: Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS. |
| D8 | About opening | "Our approach is simple: good software is engineered, not assembled." |

## 4. Length constraints (so nothing breaks the layout)

| Slot | Limit used |
|---|---|
| Hero eyebrow (uppercase, tracked) | 45 characters or fewer |
| Hero display lines | About the same length as now (12 and 14 characters) |
| Hero lead (2 lines) | About 45 and 55 characters |
| Home service description (clamped to 3 lines) | 150 characters or fewer |
| Home service feature chips (only the first 3 show) | 3 words or fewer each |
| Why Choose Us subline (`whitespace-nowrap`) | 80 characters or fewer |
| Handwrite lines | 30 characters or fewer |
| Testimonial-card content | About 130 characters |

---

## 5. Final copy (as implemented)

### 5.1 Home
- **Hero:** handwrite `We Engineer What's Next.` · eyebrow `NorthVault Studios · Digital Engineering & AI` · headline `Built Right, / Built to Last.` · handwrite `Idea → Build → Launch` · lead `AI, software, web, mobile and cloud engineering, plus the brand and marketing to launch it.` · trust line `4 Featured Projects` (no avatars, no plus) · button `Start a Project`.
- **Pills:** `Available for projects` · `Engineering · AI · Brand · Growth` · `NorthVault Studios`.
- **Ticker:** AI & Intelligent Systems · Product Engineering · Web & Mobile · Backend & Cloud · Data & Quality · Brand Identity · Digital Marketing · Social Media · UI/UX Design · Tech Consulting · Integrations · Engineering Support.
- **Who We Are:** sub `Engineers Building Products`; P1 and P2 describe the developer-run studio, the six disciplines, brand/marketing/social, and the real projects.
- **Services (six cards):** see 5.3.
- **Tools intro:** `The tools we use across AI, backend, cloud and product work.`
- **Featured Work intro:** `Four featured projects: a sports booking platform, a multi-business food delivery system, a provider network and a catering operations app. Built with Flutter, React and FastAPI on AWS.` Project years removed.
- **Why Choose Us:** rotating words `Engineering / Creativity / Ownership / Support`; handwrite `One Team → Build + Brand`; subline `One team for engineering, brand and growth.`; cards: Multidisciplinary Engineers · Engineering + Creative · End-to-End Delivery · Built for Production.
- **Proof of Work** (was Testimonials): eyebrow `Proof of work`, heading `What We've Shipped`, sub `Real Products → Real Systems`, line `Production systems we designed, built and deployed.` Four cards (Befit Sports Booking, Dawat Food Delivery, Service Provider Network, Catering Management), each with a "Shipped" tag, a one-line scope, project name and category. No quotes, no invented metrics.
- **Contact:** handwrite `We Engineer What's Next`; placeholder `Tell us what you're building…`.

### 5.2 About
- Hero handwrite `Digital Engineering & AI Solutions`; opening line `Our approach is simple: good software is engineered, not assembled.`
- Who We Are (sub `Engineering Meets Brand`): developer-run studio across AI, software, web and mobile, backend, cloud and data; brand, marketing and social media alongside; idea to launch and ongoing support.
- What We Do (four cards, existing 4-column layout): AI, Data & Quality · Software & Product · Web, Mobile & Cloud · Brand & Growth.
- How We Work: Discover the problem and the goals · Plan the architecture and scope · Design and build in focused sprints · Test, launch and deploy · Support, improve and scale.
- Promise: `We don't chase trends. We engineer systems that last. We stay accountable for what we ship, including after launch.`

### 5.3 Services (Home cards and Services page)

| # | Title | Business value (Home description) | Features |
|---|---|---|---|
| 1 | AI & Intelligent Systems | AI agents, generative AI and automation that take repetitive work off your team and make your product smarter. | AI Agents · Generative AI · Workflow Automation · ML Integration |
| 2 | Software & Product Engineering | Custom software and complete products, built from architecture to launch, so your idea becomes a system you own. | Custom Software · MVPs & Products · Admin Platforms · Tech Consulting |
| 3 | Web & Mobile Development | Fast, responsive web platforms and Flutter apps for iOS and Android, with UI/UX design built in. | Web Platforms · iOS & Android · UI/UX Design · Responsive Design |
| 4 | Backend, Cloud & Infrastructure | Secure APIs, integrations and AWS cloud setups that keep your product fast, reliable and ready to scale. | APIs & Integrations · Docker & AWS · DevOps · Infrastructure Setup |
| 5 | Data & Quality Engineering | Reliable data, analytics and testing, so your decisions and releases rest on information you can trust. | Data Engineering · Analytics · Test Automation · Quality Assurance |
| 6 | Brand, Marketing & Social Media | Brand identity, digital marketing and social media management that make your product easy to find, trust and remember. | Brand Identity · Digital Marketing · Social Media · Content Creation |

The Services page uses slightly longer descriptions (same meaning) and, for card 6, `Logo Design` and `Social Media Management` in the feature list. Page intro: `Engineering and creative services from one team, from first idea to ongoing support.` Handwrite `Everything Under One Roof` is kept. CTA: `Ready to Build?` / `Tell us what you're building. We'll reply within 24 hours.` / button `Talk to Our Team`.

### 5.4 Contact
- Intro `Tell us about your product, your brand or your growth goals. We reply within 24 hours.` · form handwrite `NDA on Request`. Contact details unchanged.

### 5.5 Footer
- `Digital engineering and AI solutions, plus brand, marketing and social media. We engineer what's next.`

### 5.6 SEO metadata
Titles and descriptions for the four routes are in `src/seo/routes.js`; the `index.html` keywords meta was updated. The SEO implementation itself is unchanged.

---

## 6. What did not change
Layouts, section order, CSS, animations, colours, typography, routing, SEO machinery, contact details, social links, project data and the tools list.

## 7. Component edits that were explicitly approved
- `TestimonialsMarquee.jsx`: quote mark and initials avatar removed, `aria-label` set to "Shipped projects".
- `trusted-users.tsx`: avatar block is optional and skipped when empty, hardcoded "+" removed, defaults updated.

---

## 8. Capability expansion (Revision 4)

Positioning stays "Digital Engineering & AI Solutions Studio — We Engineer What's Next." The team is described as **a multidisciplinary team of developers and creative professionals**. No team size, clients, certifications, awards or results are stated.

**AI & Intelligent Systems** (Services page, nine bullets covering all fourteen requested capabilities): AI Agents & Assistants · Multi-Agent Systems · Generative AI & LLM Integrations · RAG & Knowledge Systems · Voice & Multimodal AI · AI Workflow & Process Automation · AI Document Intelligence · ML Integration & Model Orchestration · AI Coding Assistants & Dev Workflows. Copy says "commercial or open-weight models" and never names a model or version.

**Other cards:** each now lists 5–6 concrete capabilities (React & Next.js, Flutter & React Native, AWS & Azure, Docker, Kubernetes, CI/CD, test and browser automation, brand, marketing, social and campaign management).

**Technology showcase** (8 categories, 5–6 items each, which keeps the existing one-row card layout): Languages · Frontend & Mobile · Backend & APIs · Data & Storage · Cloud & Infrastructure · CI/CD & Quality · AI & Automation · Design & Marketing. Existing tools (Vite, GSAP, Three.js, Firebase, Jenkins, Django, TensorFlow, HubSpot, Figma, Adobe, Linux, microservices, REST, scripting) were retained. Intro: "The technologies our team builds with and supports, grouped by discipline."

**Images:** unchanged in this revision.
