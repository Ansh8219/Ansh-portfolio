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
  ai: { label: 'AI & Intelligent Systems', cls: 'd-ai', Icon: Bot },
  software: { label: 'Software & Product Engineering', cls: 'd-software', Icon: Boxes },
  web: { label: 'Web & Mobile Development', cls: 'd-web', Icon: FaMobileAlt },
  cloud: { label: 'Backend, Cloud & Infrastructure', cls: 'd-cloud', Icon: FaCloud },
  data: { label: 'Data & Quality Engineering', cls: 'd-data', Icon: Workflow },
  brand: { label: 'Brand, Marketing & Social Media', cls: 'd-brand', Icon: FaBullhorn },
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
    name: 'AI & Intelligent Systems',
    description:
      'AI agents, RAG, voice and generative AI on commercial or open-weight models, automating work and making products smarter.',
    ...ART.ai,
    features: [
      'AI Agents & Assistants',
      'RAG & Knowledge Systems',
      'Voice & Multimodal AI',
      'AI Workflow Automation',
      'Document Intelligence',
    ],
  },
  {
    key: 'software',
    name: 'Software & Product Engineering',
    description:
      'Custom software and complete products, from discovery to launch and support, built around how your business works.',
    ...ART.software,
    features: [
      'Custom Software',
      'MVPs & Products',
      'Admin Platforms',
      'Business Process Automation',
      'C# / .NET Systems',
      'Tech Consulting',
    ],
  },
  {
    key: 'web',
    name: 'Web & Mobile Development',
    description:
      'Fast, responsive web platforms and iOS and Android apps in React, Next.js, Flutter or React Native, with UI/UX built in.',
    ...ART.web,
    features: ['Web Platforms', 'React & Next.js', 'Flutter & React Native', 'iOS & Android', 'UI/UX Design'],
  },
  {
    key: 'cloud',
    name: 'Backend, Cloud & Infrastructure',
    description:
      'Secure APIs, integrations and cloud infrastructure on AWS or Azure that keep your product fast, reliable and scalable.',
    ...ART.cloud,
    features: ['APIs & Integrations', 'Microservices', 'AWS & Azure', 'Docker & Kubernetes', 'CI/CD & DevOps'],
  },
  {
    key: 'data',
    name: 'Data & Quality Engineering',
    description:
      'Reliable data, analytics and testing, so your decisions and releases rest on information you can trust.',
    ...ART.data,
    features: [
      'Data Engineering',
      'Analytics & Reporting',
      'Test Automation',
      'Browser Automation',
      'Quality Assurance',
    ],
  },
  {
    key: 'brand',
    name: 'Brand, Marketing & Social Media',
    description:
      'Brand identity, digital marketing and social media management from our creative team, so your product is easy to find, trust and remember.',
    ...ART.brand,
    features: [
      'Brand Identity',
      'Logo Design',
      'Digital Marketing',
      'Social Media Management',
      'Content Creation',
    ],
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
  {
    title: 'Multidisciplinary engineers',
    description: 'AI, backend, mobile, cloud and QA expertise in one team.',
  },
  {
    title: 'Engineering + creative',
    description: 'Developers and creative professionals in one team, from code to brand.',
  },
  {
    title: 'End-to-end delivery',
    description: 'Discovery, design, build, launch and ongoing support.',
  },
  {
    title: 'Built for production',
    description: 'Containerised and deployed on AWS from the start.',
  },
]

export const WHO_WE_ARE_P1 =
  'NorthVault Studios is a digital engineering and AI solutions studio: a multidisciplinary team of developers and creative professionals. We work across AI, software, web and mobile, backend, cloud and data, plus brand, marketing and social media.'

export const WHO_WE_ARE_P2 =
  'Our recent work includes a venue-booking platform in Dubai, a multi-business food delivery system and a catering operations app. One team designs, builds, launches and keeps supporting what it ships.'

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
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/northvaultstudios/' },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/northvaultstudios?igsh=MWVhejFtcjd4Nmo2aQ%3D%3D&utm_source=qr',
  },
]

export const NAV_LINKS = [
  { label: 'Approach', to: '/approach', id: 'services' },
  { label: 'Work', to: '/work', id: 'work' },
  { label: 'About', to: '/about', id: 'who-we-are' },
  { label: 'Contact', to: '/contact', id: 'contact' },
]

export const HERO_DISCIPLINES = [
  'AI & agents',
  'Software',
  'Web & mobile',
  'Cloud & DevOps',
  'Data & QA',
  'Brand & marketing',
]
