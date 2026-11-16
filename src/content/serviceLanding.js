/**
 * One indexable landing page per discipline: /services/<slug>.
 * Pure data (no framework imports) so the build script, sitemap and JSON-LD can all read it.
 * Copy sticks to what the studio actually does; no invented numbers, clients or awards.
 * `key` matches the discipline keys in ./site.js.
 */
export const SERVICE_PAGES = [
  {
    key: 'ai',
    slug: 'ai-development',
    name: 'AI & Intelligent Systems',
    h1: 'AI agents, RAG and generative AI development',
    metaTitle: 'AI Agents, RAG & Generative AI Development | NorthVaultStudios',
    metaDescription:
      'Custom AI agents, RAG knowledge systems, voice and generative AI built into your product or workflow by NorthVault Studios, an AI and software studio in Chandigarh, India.',
    intro:
      'We build AI that does real work inside your business: assistants that answer from your own documents, agents that run multi-step tasks, and voice or multimodal features that make a product feel smarter. We work with commercial and open-weight models and choose the one that fits your budget, privacy and quality needs.',
    included: [
      { name: 'AI agents and assistants', text: 'Single and multi-agent systems that use tools, call your APIs and hand off to a person when needed.' },
      { name: 'RAG and knowledge systems', text: 'Search and question answering grounded in your documents, with sources shown so answers can be checked.' },
      { name: 'Voice and multimodal AI', text: 'Speech, image and document understanding added to apps and internal tools.' },
      { name: 'Workflow and document automation', text: 'Turning repetitive, paper-heavy processes into reliable automated flows.' },
    ],
    faqs: [
      { q: 'Which AI models do you work with?', a: 'Both commercial models and open-weight models. We recommend based on cost, accuracy, latency and whether your data can leave your environment.' },
      { q: 'Can the AI answer from our own documents?', a: 'Yes. That is what a RAG system does: it retrieves the relevant parts of your documents and answers from them, showing where the answer came from.' },
      { q: 'Can you add AI to a product we already have?', a: 'Yes. We integrate AI features into existing web, mobile and backend products as well as building new ones.' },
    ],
  },
  {
    key: 'software',
    slug: 'software-development',
    name: 'Software & Product Engineering',
    h1: 'Custom software and product development',
    metaTitle: 'Custom Software & Product Development Company | NorthVaultStudios',
    metaDescription:
      'Custom software, MVPs and admin platforms built end to end, from discovery to launch and support. NorthVault Studios, Chandigarh, India.',
    intro:
      'We design and build complete software products around how your business really works: the admin panels, the user apps and the backend behind them. One team takes you from the first conversation to launch, and stays on for support afterwards.',
    included: [
      { name: 'Custom software', text: 'Systems built for your process rather than bent around an off-the-shelf tool.' },
      { name: 'MVPs and product builds', text: 'A focused first version you can put in front of users quickly, then grow.' },
      { name: 'Admin platforms and dashboards', text: 'Role-based panels so each person sees and does only what they should.' },
      { name: 'Business process automation', text: 'Replacing spreadsheets and manual hand-offs with one connected system.' },
      { name: 'C# and .NET systems', text: 'New builds and upgrades on the .NET stack.' },
    ],
    faqs: [
      { q: 'Do you build full products or only parts of them?', a: 'Both. We have shipped complete platforms with admin panels, mobile apps and a backend, and we also join existing teams for a specific part.' },
      { q: 'How do projects usually start?', a: 'With a conversation and a written plan covering architecture, scope, timeline and cost, so there are no surprises later.' },
      { q: 'Do you support the product after launch?', a: 'Yes. We keep fixing, tuning and extending what we ship.' },
    ],
  },
  {
    key: 'web',
    slug: 'web-and-mobile-app-development',
    name: 'Web & Mobile Development',
    h1: 'Web and mobile app development',
    metaTitle: 'Web & Mobile App Development (Flutter, React) | NorthVaultStudios',
    metaDescription:
      'Fast, responsive web platforms and iOS and Android apps in React, Next.js, Flutter and React Native, with UI/UX design built in. NorthVault Studios, India.',
    intro:
      'We build web platforms and iOS and Android apps that are quick to load and easy to use. Design and engineering sit in the same team, so what is designed is what gets built. Our apps are live in the App Store and on Google Play.',
    included: [
      { name: 'Web platforms', text: 'Responsive sites and web apps built with React and Next.js, tuned for speed and search.' },
      { name: 'iOS and Android apps', text: 'One codebase in Flutter or React Native, shipped to both stores.' },
      { name: 'UI/UX design', text: 'Interface and flow design done alongside the build, not handed over afterwards.' },
      { name: 'SEO and performance', text: 'Prerendered pages, clean metadata and fast loading so people and search engines can find you.' },
    ],
    faqs: [
      { q: 'Flutter or React Native: which should we choose?', a: 'We choose with you based on your team, your timeline and the features you need. Both let you ship iOS and Android from one codebase.' },
      { q: 'Will you publish the app to the App Store and Google Play?', a: 'Yes. We handle the store setup, builds and release.' },
      { q: 'Do you design as well as build?', a: 'Yes. UI/UX design is part of the work, so you do not need a separate agency.' },
    ],
  },
  {
    key: 'cloud',
    slug: 'cloud-and-devops',
    name: 'Backend, Cloud & Infrastructure',
    h1: 'Backend, cloud and DevOps services',
    metaTitle: 'Backend, Cloud & DevOps Services (AWS, Azure) | NorthVaultStudios',
    metaDescription:
      'Secure APIs, microservices and cloud infrastructure on AWS or Azure with Docker and CI/CD. Backend and DevOps engineering by NorthVault Studios, India.',
    intro:
      'The part users never see decides how your product behaves on a busy day. We build secure APIs and integrations, and run them on AWS or Azure with containers and automated deployments, so your product stays fast, reliable and ready to scale.',
    included: [
      { name: 'APIs and integrations', text: 'Clean, documented APIs, plus connections to the payment, messaging and business tools you already use.' },
      { name: 'Python, Node.js and .NET backends', text: 'We build mostly in Python with FastAPI, and also in Node.js and .NET.' },
      { name: 'Microservices and background jobs', text: 'Queues and workers for the tasks that should not slow down a request.' },
      { name: 'Cloud and DevOps', text: 'AWS and Azure, Docker, Kubernetes, Linux and CI/CD pipelines.' },
    ],
    faqs: [
      { q: 'Which cloud do you use?', a: 'AWS or Azure, depending on what you already use and what suits the product.' },
      { q: 'Can you take over an existing backend?', a: 'Yes. We review it first, then fix, document and extend it, or plan a safe migration.' },
      { q: 'What do you build backends with?', a: 'Most often Python with FastAPI, PostgreSQL, Redis and Celery, on Docker. We also build with Node.js and .NET.' },
    ],
  },
  {
    key: 'data',
    slug: 'data-and-qa',
    name: 'Data & Quality Engineering',
    h1: 'Data engineering, analytics and QA testing',
    metaTitle: 'Data Engineering, Analytics & QA Testing | NorthVaultStudios',
    metaDescription:
      'Data pipelines, analytics and reporting, plus test and browser automation and QA, so decisions and releases rest on information you can trust. NorthVault Studios.',
    intro:
      'Good decisions need data you can trust, and good releases need testing you can rely on. We build the data foundations, reports and automated tests that let your team move quickly without breaking things.',
    included: [
      { name: 'Data engineering', text: 'Pipelines and databases (PostgreSQL, MySQL, MongoDB) that keep your data clean and usable.' },
      { name: 'Analytics and reporting', text: 'Dashboards and reports that answer the questions your team actually asks.' },
      { name: 'Test and browser automation', text: 'Automated checks that run on every change, so regressions are caught early.' },
      { name: 'Quality assurance', text: 'Structured testing before release, on the devices and flows your users really use.' },
    ],
    faqs: [
      { q: 'Can you work with our existing database?', a: 'Yes. We work with PostgreSQL, MySQL and MongoDB and can build around what you already have.' },
      { q: 'Do you offer QA for software someone else built?', a: 'Yes. We can test and automate checks for existing products as a separate engagement.' },
      { q: 'What is browser automation useful for?', a: 'Repeating tasks on websites and testing web flows end to end, without anyone clicking through them by hand.' },
    ],
  },
  {
    key: 'brand',
    slug: 'branding-and-digital-marketing',
    name: 'Brand, Marketing & Social Media',
    h1: 'Brand identity, digital marketing and social media',
    metaTitle: 'Brand Identity, Digital Marketing & Social Media | NorthVaultStudios',
    metaDescription:
      'Brand identity, logo design, digital marketing, content and social media management from NorthVault Studios, so your product is easy to find, trust and remember.',
    intro:
      'A well-built product still needs to be found and remembered. Our creative team handles brand identity, content and social media so that what we engineer looks right and reaches the people it is for.',
    included: [
      { name: 'Brand identity and logo design', text: 'A clear name, mark and visual system that works across your product and your marketing.' },
      { name: 'Digital marketing', text: 'Campaigns planned, run and reviewed against goals you set with us.' },
      { name: 'Social media management', text: 'Regular posting and community care on the channels your customers use.' },
      { name: 'Content creation', text: 'Posts, graphics and copy that match the brand.' },
    ],
    faqs: [
      { q: 'Can you do branding and the product together?', a: 'Yes. Having brand and engineering under one roof means the product and the identity look like they belong together.' },
      { q: 'Do you manage social media accounts?', a: 'Yes. That includes planning, creating and posting content, and campaign management.' },
      { q: 'Can we hire you for branding only?', a: 'Yes. Brand work does not require an engineering project.' },
    ],
  },
]

export const getServicePage = (slug) => SERVICE_PAGES.find((p) => p.slug === slug)
export const servicePageForKey = (key) => SERVICE_PAGES.find((p) => p.key === key)
