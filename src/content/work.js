/**
 * Copy for the /work page (text only, no artwork). One entry per project; the page shows a one-line
 * summary and opens the `details` on demand. Keep claims to what was actually built.
 * `status` tone: live | soon | built (built but not released / not delivered) | self.
 */
export const WORK_INTRO =
  'Real products with admins, users and a backend behind them. Some are live in the stores, some are on the way, and a few were built but never released. Open any row for the detail.'

const APP_STORE_BEFIT = 'https://apps.apple.com/in/app/befit-by-maulee-world/id6773420644'
const PLAY_BEFIT = 'https://play.google.com/store/apps/details?id=com.app.befit'
const PLAY_UNIFEAST = 'https://play.google.com/store/apps/details?id=com.app.unifeast'

export const WORK_CASES = [
  {
    key: 'northvault',
    title: 'NorthVaultStudios',
    category: 'This website',
    lead: 'ai',
    status: { tone: 'self', label: 'You are here' },
    summary: 'Our own site: animated, prerendered for search, and built to be fast and accessible.',
    about:
      'The studio site you are on. Scroll-driven motion, a 3D vault scene on desktop, a light and dark theme, and static prerendering so every page is readable without JavaScript. It respects reduced-motion settings.',
    parts: [
      { name: 'Motion', text: 'GSAP and Lenis for scroll-driven animation and smooth scrolling.' },
      { name: '3D', text: 'A Three.js vault scene on larger screens only.' },
      { name: 'SEO', text: 'Per-page metadata, sitemap and prerendered HTML.' },
    ],
    roles: [],
    backend: [],
    stack: ['React', 'Vite', 'Tailwind', 'GSAP', 'Three.js', 'Lenis'],
    links: [],
  },
  {
    key: 'befit',
    title: 'Befit',
    category: 'Sports · Dubai venues',
    lead: 'web',
    status: { tone: 'live', label: 'Live on App Store & Google Play' },
    summary:
      'A full sports platform: players book and play at venues, companies run their own players, and head office runs everything.',
    about:
      'Befit lets people in Dubai find and play venue games. One platform serves three audiences: the company behind it, partner companies, and the players themselves. Access is role based throughout, so every user only sees what belongs to them.',
    parts: [
      { name: 'Super Admin panel', text: 'Company-wide control of venues, users, games and settings.' },
      { name: 'Company Admin panel', text: 'Each partner company manages its own players and games.' },
      { name: 'Main website', text: 'The public site that introduces Befit and sends people to the apps.' },
      { name: 'Mobile app', text: 'One Flutter codebase on iOS and Android for players.' },
    ],
    roles: ['Super Admin', 'Company Admin', 'Company player', 'Individual player'],
    backend: [
      'Python 3.12 with FastAPI',
      'PostgreSQL with Alembic migrations',
      'Redis for caching and queues',
      'Celery for background jobs',
    ],
    stack: ['Flutter', 'React', 'Python 3.12', 'FastAPI', 'Alembic', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'AWS'],
    links: [
      { label: 'App Store', href: APP_STORE_BEFIT },
      { label: 'Google Play', href: PLAY_BEFIT },
    ],
  },
  {
    key: 'dawat',
    title: 'Dawat',
    category: 'Restaurant · Bakery · Dining',
    lead: 'software',
    status: { tone: 'soon', label: 'Releasing soon' },
    summary:
      'A multi-business food delivery platform: one admin panel for every brand, and one app for customers, shopkeepers and drivers.',
    about:
      'Dawat runs restaurants, bakeries and dining brands together. Managers use the same admin panel as the owner, signing in with their own credentials and seeing only what their permissions allow. In the app, the screens change with who signs in.',
    parts: [
      { name: 'Admin panel', text: 'One React panel for the whole business, with manager permissions on the same panel.' },
      { name: 'Customer, shopkeeper and driver app', text: 'A single Flutter app that adapts to the role of the user.' },
      { name: 'Backend', text: 'FastAPI service layer built the same way as Befit.' },
    ],
    roles: ['Admin', 'Manager (limited permissions)', 'Customer', 'Shopkeeper', 'Driver'],
    backend: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery'],
    stack: ['Flutter', 'React', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'AWS'],
    links: [],
  },
  {
    key: 'unifeast',
    title: 'Unifeast',
    category: 'Canteen · Catering management',
    lead: 'data',
    status: { tone: 'live', label: 'Live on Google Play' },
    summary:
      'Catering management for businesses that run several canteens: finance, managers and daily operations in one system.',
    about:
      'Unifeast lets an organisation manage multiple canteens from one place. A Super Admin and an Admin panel control the setup and the money, while canteen managers work from the mobile app.',
    parts: [
      { name: 'Super Admin panel', text: 'Creates and oversees the canteens and the admins running them.' },
      { name: 'Admin panel', text: 'Manages its own canteens and finance, and creates managers.' },
      { name: 'Finance', text: 'Expenses and payroll tracked inside the same system.' },
      { name: 'Manager app', text: 'Managers use the mobile app for their canteen day to day.' },
      { name: 'Website', text: 'Public site for the product.' },
    ],
    roles: ['Super Admin', 'Admin', 'Manager'],
    backend: ['FastAPI', 'PostgreSQL', 'Redis', 'Celery'],
    stack: ['Flutter', 'React', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker', 'AWS'],
    links: [
      { label: 'Website', href: 'https://unifeastsolutions.org/' },
      { label: 'Google Play', href: PLAY_UNIFEAST },
    ],
  },
  {
    key: 'vyro',
    title: 'Vyro',
    category: 'Social media app',
    lead: 'cloud',
    status: { tone: 'built', label: 'Built · not shipped' },
    summary: 'A social app that blends several social platforms into one. We built the backend.',
    about:
      'Vyro combines ideas from several social media apps into a single product. Our part was the backend in FastAPI: creating posts and the services around them. The product itself was not released.',
    parts: [
      { name: 'Posts', text: 'Create and serve posts through the FastAPI backend.' },
      { name: 'Social layer', text: 'Backend services for a feed that mixes patterns from several social apps.' },
    ],
    roles: [],
    backend: ['FastAPI'],
    stack: ['FastAPI'],
    links: [],
  },
  {
    key: 'bookyahook',
    title: 'Bookyahook',
    category: 'Service booking platform',
    lead: 'brand',
    status: { tone: 'built', label: 'Built · not delivered' },
    summary: 'A service booking platform that we built, but did not hand over because of issues on the client side.',
    about:
      'Bookyahook was a platform for booking services. The build was completed on our side, but the project was never delivered to the end, so it did not go live.',
    parts: [],
    roles: [],
    backend: [],
    stack: [],
    links: [],
  },
]
