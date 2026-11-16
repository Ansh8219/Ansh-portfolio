/**
 * Long-form copy for the /services page, keyed by the discipline keys in ./site.js (SERVICES / DISCIPLINES).
 * The home page links to `/services#<key>`, so each key is also the section id on the page.
 */
export const SERVICES_INTRO =
  'AI, engineering and creative work from one team, from the first idea to the support that follows. Pick a discipline to jump straight to it.'

export const SERVICE_DETAILS = {
  ai: {
    lead:
      'Agents, RAG, voice and generative AI on commercial or open-weight models, so repetitive work shrinks and your product gets smarter.',
    features: [
      'AI Agents, Assistants & Multi-Agent Systems',
      'Generative AI & LLM Integrations',
      'RAG & Knowledge Systems',
      'Voice & Multimodal AI',
      'AI Workflow & Process Automation',
      'AI Document Intelligence',
      'ML Integration & Model Orchestration',
      'AI Coding Assistants & Dev Workflows',
    ],
  },
  software: {
    lead:
      'Custom software and complete products, from discovery to launch and ongoing support, built around how your business actually works.',
    features: [
      'Custom Software',
      'MVPs & Product Builds',
      'Admin Platforms & Dashboards',
      'Business Process Automation',
      'C# / .NET Systems',
      'Technology Consulting',
      'Ongoing Engineering Support',
    ],
  },
  web: {
    lead:
      'Fast, responsive web platforms and iOS and Android apps, with UI/UX design built in, so people enjoy using what you ship.',
    features: ['Web Platforms', 'React & Next.js', 'Flutter & React Native', 'iOS & Android', 'UI/UX Design', 'SEO & Performance'],
  },
  cloud: {
    lead:
      'Secure APIs, integrations and cloud infrastructure on AWS or Azure that keep your product fast, reliable and ready to scale as usage grows.',
    features: [
      'APIs & Integrations',
      'Python, Node.js & .NET Backends',
      'Microservices',
      'AWS & Azure',
      'Docker, Kubernetes & Linux',
      'CI/CD & DevOps',
    ],
  },
  data: {
    lead: 'Reliable data, analytics and testing, so your decisions and releases rest on information you can trust.',
    features: [
      'Data Engineering',
      'PostgreSQL, MySQL & MongoDB',
      'Analytics & Reporting',
      'Test Automation',
      'Browser Automation',
      'Quality Assurance',
    ],
  },
  brand: {
    lead:
      'Brand identity, digital marketing and social media management from our creative team, so the product we engineer is easy to find, trust and remember.',
    features: [
      'Brand Identity',
      'Logo Design',
      'Digital Marketing',
      'Social Media Management',
      'Content Creation',
      'Campaign Management',
    ],
  },
}
