/**
 * One indexable landing page per discipline: /services/<slug>.
 * Pure data (no framework imports) so the build script, sitemap and JSON-LD can all read it.
 * Copy sticks to what Ansh actually does; no invented numbers, clients or awards.
 * `key` matches the discipline keys in ./site.js.
 */
export const SERVICE_PAGES = [
  {
    key: 'ai',
    slug: 'ai-development',
    name: 'AI Development',
    h1: 'AI agents, RAG and LLM integration',
    metaTitle: 'AI Agents, RAG & LLM Development | Ansh',
    metaDescription:
      'AI agents, RAG knowledge systems and LLM integrations built into real products by Ansh, a full stack and AI developer with 4+ years of experience.',
    intro:
      'I build AI that does real work inside a product: assistants that answer from your own documents, agents that run multi-step tasks, and voice or document features that make an app feel smarter. I work with commercial and open-weight models and pick the one that fits the budget, privacy and quality needs.',
    included: [
      { name: 'AI agents and assistants', text: 'Single and multi-agent systems that use tools, call your APIs and hand off to a person when needed.' },
      { name: 'RAG and knowledge systems', text: 'Search and question answering grounded in your documents, with sources shown so answers can be checked.' },
      { name: 'Voice and multimodal AI', text: 'Speech, image and document understanding added to apps and internal tools.' },
      { name: 'Workflow automation', text: 'Turning repetitive, manual processes into reliable automated flows.' },
    ],
    faqs: [
      { q: 'Which AI models do you work with?', a: 'Both commercial and open-weight models. I recommend based on cost, accuracy, latency and whether your data can leave your environment.' },
      { q: 'Can the AI answer from our own documents?', a: 'Yes. That is what a RAG system does: it retrieves the relevant parts of your documents and answers from them, showing where the answer came from.' },
      { q: 'Can you add AI to a product we already have?', a: 'Yes. I integrate AI features into existing web, mobile and backend products as well as building new ones.' },
    ],
  },
  {
    key: 'software',
    slug: 'system-architecture',
    name: 'System Architecture',
    h1: 'System architecture and technical design',
    metaTitle: 'System Architecture & Backend Design | Ansh',
    metaDescription:
      'System architecture, microservices and database design for products that need to scale, by Ansh, a full stack developer with 4+ years of experience.',
    intro:
      'Most scaling problems are architecture problems that were cheap to fix on day one. I design the structure of a system before it is built: service boundaries, data models, queues, caching and how things fail, so the product can grow without a rewrite.',
    included: [
      { name: 'System and software architecture', text: 'A clear design for how the pieces fit together, written down so a team can build from it.' },
      { name: 'Microservices and modular monoliths', text: 'The right level of splitting for your size, not microservices by default.' },
      { name: 'Database and data-model design', text: 'Schemas, indexes and migrations that stay fast and easy to change.' },
      { name: 'Scalability planning', text: 'Caching, background jobs and load handling planned for the traffic you expect.' },
    ],
    faqs: [
      { q: 'Do you only design, or also build?', a: 'Both. I can hand over a design for your team to build, or build it myself.' },
      { q: 'Can you review an existing system?', a: 'Yes. I review the code and infrastructure, list what will hurt as you grow, and suggest a practical order to fix it.' },
      { q: 'Microservices or monolith?', a: 'Whichever your team size and product stage justify. Often a well-structured monolith first.' },
    ],
  },
  {
    key: 'web',
    slug: 'web-and-mobile-app-development',
    name: 'Frontend & Mobile',
    h1: 'React web apps and Flutter mobile apps',
    metaTitle: 'React & Flutter App Development | Ansh',
    metaDescription:
      'React web apps, admin dashboards and Flutter iOS and Android apps built and released by Ansh, a full stack developer in India.',
    intro:
      'I build React web apps and admin panels and Flutter apps for iOS and Android, connected to the backend I build. Apps I worked on are live in the App Store and on Google Play.',
    included: [
      { name: 'React web apps', text: 'Responsive web apps and role-based admin dashboards, tuned for speed.' },
      { name: 'Flutter apps', text: 'One codebase shipped to both iOS and Android.' },
      { name: 'Store releases', text: 'Builds, signing, store listings and release to the App Store and Google Play.' },
      { name: 'API integration', text: 'Clean connection to the backend, with loading, error and offline states handled.' },
    ],
    faqs: [
      { q: 'Flutter or React Native?', a: 'I work in Flutter for apps. It gives one codebase for iOS and Android with native-feel performance.' },
      { q: 'Will you publish the app to the stores?', a: 'Yes. I handle the store setup, builds and release.' },
      { q: 'Do you build the backend too?', a: 'Yes. That is the main thing I do, so the app and the API are designed together.' },
    ],
  },
  {
    key: 'cloud',
    slug: 'cloud-and-devops',
    name: 'Cloud & DevOps',
    h1: 'Cloud infrastructure and DevOps',
    metaTitle: 'Cloud Infrastructure & DevOps (AWS, Docker, CI/CD) | Ansh',
    metaDescription:
      'AWS infrastructure, Docker, Kubernetes and CI/CD pipelines set up by Ansh, a full stack and DevOps engineer with 4+ years of experience.',
    intro:
      'I set up and run the infrastructure behind products: containers, automated deployments, monitoring and the security basics, so releases are routine and the product stays up.',
    included: [
      { name: 'AWS infrastructure', text: 'Compute, databases, storage and networking set up for the product and its budget.' },
      { name: 'Docker and Kubernetes', text: 'Containerised services that run the same everywhere.' },
      { name: 'CI/CD pipelines', text: 'Automated tests and deployments on every change.' },
      { name: 'Linux, monitoring and logging', text: 'Servers you can see into, with alerts before users notice problems.' },
    ],
    faqs: [
      { q: 'Which cloud do you use?', a: 'Mainly AWS, which is what my shipped products run on.' },
      { q: 'Can you take over existing infrastructure?', a: 'Yes. I review it first, then fix, document and improve it, or plan a safe migration.' },
      { q: 'Can you set up CI/CD for an existing app?', a: 'Yes. Typically a pipeline that tests, builds a container and deploys, with a way to roll back.' },
    ],
  },
  {
    key: 'data',
    slug: 'python-backend-development',
    name: 'Python Backend',
    h1: 'Python backend development with Django and FastAPI',
    metaTitle: 'Python Backend Development (Django, FastAPI) | Ansh',
    metaDescription:
      'Python backends and APIs in Django and FastAPI with PostgreSQL, Redis and Celery, built by Ansh, a full stack developer with 4+ years of experience.',
    intro:
      'Python backends are my main craft. I build APIs and services in Django and FastAPI, backed by PostgreSQL, Redis and Celery, written to be clean, tested and easy to extend. The backends behind my shipped apps run this way.',
    included: [
      { name: 'Django and FastAPI services', text: 'REST APIs, async services and admin back-ends.' },
      { name: 'Databases', text: 'PostgreSQL, MySQL and MongoDB, with migrations and sensible schemas.' },
      { name: 'Background jobs', text: 'Celery and Redis for work that should not slow a request down.' },
      { name: 'Integrations and auth', text: 'Payments, messaging and other third-party APIs, plus role-based access.' },
    ],
    faqs: [
      { q: 'Django or FastAPI?', a: 'Django when you want batteries included and an admin quickly, FastAPI for fast async APIs. I use both.' },
      { q: 'Can you take over an existing Python backend?', a: 'Yes. I review it first, then fix, document and extend it.' },
      { q: 'Do you write tests?', a: 'Yes. Critical paths are covered so changes can ship with confidence.' },
    ],
  },
  {
    key: 'brand',
    slug: 'full-stack-product-development',
    name: 'Full Stack Products',
    h1: 'Full stack product development, end to end',
    metaTitle: 'Full Stack Product Development | Ansh',
    metaDescription:
      'Whole products from idea to release: backend, admin panel, mobile app and deployment, by Ansh, a full stack developer in India.',
    intro:
      'I can take a product from first idea to release alone or inside a team: the backend, the admin panel, the mobile app and the deployment. One engineer across the stack keeps decisions quick and hand-offs few.',
    included: [
      { name: 'MVPs and product builds', text: 'A focused first version you can put in front of users quickly, then grow.' },
      { name: 'Admin platforms', text: 'Role-based panels so each person sees and does only what they should.' },
      { name: 'Backend, web and mobile', text: 'All the layers designed together so they fit.' },
      { name: 'Launch and support', text: 'Deployment, monitoring and continued fixes and features after release.' },
    ],
    faqs: [
      { q: 'Do you build complete products?', a: 'Yes. See the Work page: platforms with admin panels, mobile apps and backends, some live in the stores.' },
      { q: 'How do projects usually start?', a: 'With a conversation and a written plan covering architecture, scope and timeline.' },
      { q: 'Are you available for freelance or full-time?', a: 'Get in touch with what you have in mind and we can work out the format.' },
    ],
  },
]

export const getServicePage = (slug) => SERVICE_PAGES.find((p) => p.slug === slug)
export const servicePageForKey = (key) => SERVICE_PAGES.find((p) => p.key === key)
