/**
 * Long-form copy for the /services page, keyed by the discipline keys in ./site.js (SERVICES / DISCIPLINES).
 * The home page links to `/services#<key>`, so each key is also the section id on the page.
 */
export const SERVICES_INTRO =
  '4+ years of building and running production software: architecture, Python backends, web and mobile apps, AI systems and the cloud infrastructure underneath. Pick an area to jump straight to it.'

export const SERVICE_DETAILS = {
  ai: {
    lead:
      'AI agents, LLM integrations and RAG systems that do real work inside a product, so repetitive tasks shrink and the product gets smarter.',
    features: [
      'AI Agents & Assistants',
      'LLM & Generative AI Integrations',
      'RAG & Knowledge Systems',
      'Voice & Multimodal AI',
      'AI Workflow Automation',
      'Document Intelligence',
      'Model Orchestration',
    ],
  },
  software: {
    lead:
      'The part that decides whether a product survives growth: service boundaries, data models, queues, caching and failure handling, designed before the first line of code.',
    features: [
      'System & Software Architecture',
      'Microservices & Modular Monoliths',
      'Database & Data-Model Design',
      'Scalability & Performance Planning',
      'Technical Design Documents',
      'Code Review & Tech Consulting',
    ],
  },
  web: {
    lead:
      'Fast, responsive React web apps and Flutter apps for iOS and Android, wired to the backend I build.',
    features: ['React Web Apps', 'Admin Panels & Dashboards', 'Flutter (iOS & Android)', 'App Store & Play Store Releases', 'API Integration', 'Performance Tuning'],
  },
  cloud: {
    lead:
      'Cloud infrastructure and delivery pipelines: containers, automated deployments, monitoring and the security basics, so releases are boring and uptime is not.',
    features: [
      'AWS Infrastructure',
      'Docker & Kubernetes',
      'CI/CD Pipelines',
      'Linux Server Management',
      'Monitoring & Logging',
      'Cost & Security Hygiene',
    ],
  },
  data: {
    lead:
      'My main craft: Python backends in Django and FastAPI, with PostgreSQL, Redis and Celery, built to be clean, tested and easy to extend.',
    features: [
      'Django & Django REST Framework',
      'FastAPI & Async Python',
      'PostgreSQL, MySQL & MongoDB',
      'Redis & Celery Background Jobs',
      'Third-party API Integrations',
      'Authentication & Role-based Access',
    ],
  },
  brand: {
    lead:
      'Whole products from idea to release: backend, admin panel, mobile app and deployment handled by one engineer, which keeps decisions fast and hand-offs few.',
    features: [
      'MVPs & Product Builds',
      'Admin Platforms',
      'Backend + Web + Mobile Delivery',
      'Business Process Automation',
      'Launch & Ongoing Support',
    ],
  },
}
