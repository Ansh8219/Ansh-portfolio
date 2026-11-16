import {
  Bot,
  Boxes,
  Cloud,
  Workflow,
  Server,
  Sparkles,
  Library,
  Database,
  Terminal,
  ShieldCheck,
  Globe,
  Plug,
  GitBranch,
  Share2,
  BarChart3,
  Code2,
} from 'lucide-react'
import { FaMobileAlt, FaBullhorn, FaCloud } from 'react-icons/fa'
import {
  SiReact,
  SiVite,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiDotnet,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiFirebase,
  SiFlutter,
  SiFigma,
  SiAdobe,
  SiAmazonwebservices,
  SiDocker,
  SiLinux,
  SiJenkins,
  SiGithubactions,
  SiGreensock,
  SiTensorflow,
  SiKubernetes,
  SiHubspot,
} from 'react-icons/si'

/**
 * Each service owns one accent. `cls` maps to a `.d-*` class in signal.css that sets the
 * block fill (--c) and the readable text colour on it (--on).
 */
export const DISCIPLINES = {
  ai: { label: 'AI Development', cls: 'd-ai', Icon: Bot },
  software: { label: 'System Architecture', cls: 'd-software', Icon: Boxes },
  web: { label: 'Frontend & Mobile', cls: 'd-web', Icon: FaMobileAlt },
  cloud: { label: 'Cloud & DevOps', cls: 'd-cloud', Icon: FaCloud },
  data: { label: 'Python Backend', cls: 'd-data', Icon: Workflow },
  brand: { label: 'Full Stack Products', cls: 'd-brand', Icon: FaBullhorn },
}

/**
 * Crops for the existing service art. Those images have copy and logos baked into them (mostly
 * the left third, plus a few signs), so each is cropped/zoomed to the devices and scenery.
 * `pos` is object-position, `zoom` + `origin` magnify around a focal point. Two of the source
 * files (service-mobile.jpg and service-social.jpg) are byte-identical, so they get different crops.
 */
/**
 * New, text-free artwork (public/images/nv/, generated to the brand palette). Each entry has a full
 * size and a small variant for phones; `pos` is the object-position used on narrow/portrait crops.
 */
const NV = (name, w, h, sm, pos = '50% 50%') => ({
  image: `/images/nv/${name}.webp`,
  imageSm: `/images/nv/${name}-${sm}.webp`,
  width: w,
  height: h,
  crop: { pos, zoom: 1, origin: '50% 50%' },
})

export const ART = {
  befit: NV('work-befit', 1672, 941, 900, '50% 55%'),
  dawat: NV('work-dawat', 1672, 941, 900, '70% 50%'),
  network: NV('work-service-network', 1672, 941, 900, '45% 50%'),
  catering: NV('work-catering', 1672, 941, 900, '60% 50%'),
  studio: NV('studio', 1122, 1402, 720),
  ai: NV('service-ai', 1536, 1024, 900, '70% 50%'),
  software: NV('service-software', 1536, 1024, 900, '65% 50%'),
  web: NV('service-web-mobile', 1536, 1024, 900, '55% 45%'),
  cloud: NV('service-cloud', 1536, 1024, 900),
  data: NV('service-data-qa', 1536, 1024, 900, '60% 50%'),
  brand: NV('service-brand', 1536, 1024, 900),
  vault: NV('vault-render', 1731, 908, 900, '62% 50%'),
}

export const SERVICES = [
  {
    key: 'ai',
    name: 'AI Development',
    description:
      'AI agents, RAG and LLM integrations on commercial or open-weight models, automating work and making products smarter.',
    ...ART.ai,
    features: ['AI Agents & Assistants', 'RAG & Knowledge Systems', 'LLM Integrations', 'Voice & Multimodal AI', 'AI Workflow Automation'],
  },
  {
    key: 'software',
    name: 'System Architecture',
    description:
      'Service boundaries, data models, queues and caching designed up front, so the product can grow without a rewrite.',
    ...ART.software,
    features: ['System Design', 'Microservices', 'Database Design', 'Scalability Planning', 'Technical Consulting'],
  },
  {
    key: 'web',
    name: 'Frontend & Mobile',
    description:
      'React web apps and admin panels, and Flutter apps for iOS and Android, wired to the backend I build.',
    ...ART.web,
    features: ['React Web Apps', 'Admin Dashboards', 'Flutter iOS & Android', 'Store Releases'],
  },
  {
    key: 'cloud',
    name: 'Cloud & DevOps',
    description:
      'AWS infrastructure, containers and CI/CD pipelines that keep releases routine and the product reliable.',
    ...ART.cloud,
    features: ['AWS', 'Docker & Kubernetes', 'CI/CD', 'Linux', 'Monitoring'],
  },
  {
    key: 'data',
    name: 'Python Backend',
    description:
      'Django and FastAPI backends with PostgreSQL, Redis and Celery: my main craft, built clean, tested and easy to extend.',
    ...ART.data,
    features: ['Django & DRF', 'FastAPI', 'PostgreSQL & Redis', 'Celery Jobs', 'API Integrations'],
  },
  {
    key: 'brand',
    name: 'Full Stack Products',
    description:
      'Whole products from idea to release: backend, admin panel, mobile app and deployment, handled end to end.',
    ...ART.brand,
    features: ['MVPs & Products', 'Admin Platforms', 'Backend + Web + Mobile', 'Launch & Support'],
  },
]

/**
 * One project list (replaces the old Featured Work + Proof of Work, which showed the same
 * four projects twice). `lead` is the discipline whose accent colours the poster; it is an
 * editorial choice and easy to change.
 */
export const PROJECTS = [
  {
    title: 'Befit Sports Booking Platform',
    category: 'Sports · Dubai venues',
    description:
      'Full platform for venue games in Dubai: a Super Admin panel, a Corporate Admin panel, and the Befit players app where users register and play inside venues.',
    outcome: ['Shipped', 'Super Admin', 'Corporate Admin', 'Players app'],
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    ...ART.befit,
    lead: 'web',
  },
  {
    title: 'Dawat Food Delivery App',
    category: 'Restaurant · Bakery · Dining',
    description:
      'Multi-business food delivery platform: one admin panel to run restaurants, bakeries and dining brands, plus a single app for customers, drivers and managers.',
    outcome: ['Shipped', 'Multi-business admin', 'Customer', 'Driver', 'Manager'],
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    ...ART.dawat,
    lead: 'software',
  },
  {
    title: 'Service Provider Network',
    category: 'Web · Social marketplace',
    description:
      'Social-style web app where service providers and customers connect: posts, likes, comments, chat and calls in one place.',
    outcome: ['Shipped', 'Posts', 'Chat', 'Calls', 'Provider ↔ Customer'],
    tech: 'React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    ...ART.network,
    lead: 'cloud',
  },
  {
    title: 'Unifeast Catering Management',
    category: 'Canteen · Catering management',
    description:
      'Catering management for businesses with several canteens: a Super Admin and an Admin panel, finance, and a mobile app for canteen managers.',
    outcome: ['Live', 'Super Admin', 'Admin', 'Finance', 'Manager app'],
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    ...ART.catering,
    lead: 'data',
  },
]

export const WHY_CHOOSE_US = [
  { title: 'Architecture first', description: 'Systems designed to scale before they are built.' },
  { title: 'Full stack range', description: 'Backend, web, mobile and cloud from one engineer.' },
  { title: 'End-to-end delivery', description: 'Design, build, deploy and support.' },
  { title: 'Built for production', description: 'Containerised and deployed on AWS from the start.' },
]

export const WHO_WE_ARE_P1 =
  'I’m Ansh, a full stack and AI developer with 4+ years of experience. I mainly design system architecture and build Python backends in Django and FastAPI, with React and Flutter on the front, and I work across cloud and DevOps.'

export const WHO_WE_ARE_P2 =
  'Recent work includes a venue-booking platform in Dubai, a multi-business food delivery system and a catering management app. I design, build, deploy and keep supporting what I ship.'

/** Stack, grouped into three marquee rows. */
export const STACK_ROWS = [
  [
    { name: 'Python', Icon: SiPython },
    { name: 'JavaScript', Icon: SiJavascript },
    { name: 'TypeScript', Icon: SiTypescript },
    { name: 'C#', Icon: Code2 },
    { name: '.NET', Icon: SiDotnet },
    { name: 'React', Icon: SiReact },
    { name: 'Next.js', Icon: SiNextdotjs },
    { name: 'Vite', Icon: SiVite },
    { name: 'Flutter', Icon: SiFlutter },
    { name: 'React Native', Icon: SiReact },
    { name: 'GSAP & Three.js', Icon: SiGreensock },
  ],
  [
    { name: 'Node.js', Icon: SiNodedotjs },
    { name: 'FastAPI', Icon: SiFastapi },
    { name: 'Django', Icon: SiDjango },
    { name: 'REST APIs', Icon: Server },
    { name: 'Microservices', Icon: Boxes },
    { name: 'API Integrations', Icon: Plug },
    { name: 'PostgreSQL', Icon: SiPostgresql },
    { name: 'MySQL', Icon: SiMysql },
    { name: 'MongoDB', Icon: SiMongodb },
    { name: 'Redis', Icon: SiRedis },
    { name: 'Firebase', Icon: SiFirebase },
  ],
  [
    { name: 'AWS', Icon: SiAmazonwebservices },
    { name: 'Azure', Icon: Cloud },
    { name: 'Docker', Icon: SiDocker },
    { name: 'Kubernetes', Icon: SiKubernetes },
    { name: 'Linux', Icon: SiLinux },
    { name: 'GitHub Actions', Icon: SiGithubactions },
    { name: 'Jenkins', Icon: SiJenkins },
    { name: 'CI/CD Pipelines', Icon: GitBranch },
    { name: 'Test Automation', Icon: ShieldCheck },
    { name: 'Browser Automation', Icon: Globe },
    { name: 'Scripting', Icon: Terminal },
    { name: 'LLMs', Icon: Sparkles },
    { name: 'RAG', Icon: Library },
    { name: 'Vector DBs', Icon: Database },
    { name: 'AI Agents', Icon: Bot },
    { name: 'ML', Icon: SiTensorflow },
    { name: 'Workflow Automation', Icon: Workflow },
    { name: 'Figma', Icon: SiFigma },
    { name: 'Adobe', Icon: SiAdobe },
    { name: 'CRM', Icon: SiHubspot },
    { name: 'Analytics', Icon: BarChart3 },
    { name: 'Social Media Tools', Icon: Share2 },
  ],
]

export const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ansh-kumar-18b63a270/' },
  { name: 'GitHub', url: 'https://github.com/Ansh8219' },
]

export const NAV_LINKS = [
  { label: 'Approach', to: '/approach', id: 'services' },
  { label: 'Work', to: '/work', id: 'work' },
  { label: 'About', to: '/about', id: 'who-we-are' },
  { label: 'Resume', to: '/resume', id: 'resume' },
  { label: 'Contact', to: '/contact', id: 'contact' },
]

export const HERO_DISCIPLINES = [
  'AI & agents',
  'System architecture',
  'React & Flutter',
  'Cloud & DevOps',
  'Python backend',
  'Full stack products',
]
