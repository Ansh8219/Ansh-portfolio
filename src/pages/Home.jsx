import { useRef, useState, useCallback, useLayoutEffect, memo } from 'react'
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  Play,
  Bot,
  Brain,
  Boxes,
  Cloud,
  Workflow,
  Server,
} from 'lucide-react'
import { HiOutlineGlobeAlt, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2'
import {
  FaMobileAlt,
  FaBullhorn,
  FaPaintBrush,
  FaCloud,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa'
import {
  SiReact,
  SiVite,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiFlutter,
  SiFigma,
  SiAdobe,
  SiAmazonwebservices,
  SiDocker,
  SiLinux,
  SiJenkins,
  SiThreedotjs,
  SiGreensock,
  SiOpenai,
  SiTensorflow,
  SiKubernetes,
  SiHubspot,
} from 'react-icons/si'
import { scrollToSection } from '../utils/scrollToSection'
import ScrollVerticalStack from '../components/ScrollVerticalStack'
import FeaturedWorkCarousel from '../components/FeaturedWorkCarousel'
import TestimonialsMarquee from '../components/TestimonialsMarquee'
import BrandedEmail, { MAILTO } from '../components/BrandedEmail'
import HeroContent from '../components/HeroContent'
import HeroTicker from '../components/HeroTicker'
import ServicesShowcase from '../components/ServicesShowcase'
import HandwriteAccent from '../components/HandwriteAccent'
import GsapReveal from '../components/GsapReveal'
import { LoopingWords } from '../components/lightswind/looping-words'
import {
  UI_HOVER_SCALE,
  UI_TAP_SCALE,
  UI_HOVER_TRANSITION,
} from '../motion/cinematic'
import { usePrefersFinePointer } from '../hooks/usePrefersFinePointer'
import { useTheme } from '../context/ThemeContext'
const SPRING_CONFIG = { stiffness: 75, damping: 18 }

const SERVICES = [
  {
    name: 'Website Development',
    icon: HiOutlineGlobeAlt,
    title: 'Website Development',
    description:
      'Custom, responsive websites built with modern technologies. From simple landing pages to complex web applications, we create digital experiences that engage and convert.',
    image: '/ourServices/service-website.jpg',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Modern Stack'],
  },
  {
    name: 'Mobile Apps',
    icon: FaMobileAlt,
    title: 'Mobile Apps',
    description:
      'Native and cross-platform mobile applications for iOS and Android. We build apps that are intuitive, performant, and deliver exceptional user experiences.',
    image: '/ourServices/service-mobile.jpg',
    features: ['iOS & Android', 'Cross-Platform', 'UI/UX Design', 'App Store Optimization'],
  },
  {
    name: 'Marketing & Branding',
    icon: FaBullhorn,
    title: 'Marketing & Branding',
    description:
      'Complete branding solutions that tell your story. From logo design to comprehensive brand guidelines, we help you stand out in the digital landscape.',
    image: '/ourServices/service-branding.jpg',
    features: ['Brand Identity', 'Logo Design', 'Marketing Strategy', 'Content Creation'],
  },
  {
    name: 'Social Media Management',
    icon: FaBullhorn,
    title: 'Social Media Management',
    description:
      'Strategic social media management that grows your audience and engagement. We create compelling content and manage your presence across all platforms.',
    image: '/ourServices/service-social.jpg',
    features: ['Content Strategy', 'Community Management', 'Analytics & Reporting', 'Campaign Management'],
  },
  {
    name: 'UI/UX Design',
    icon: FaPaintBrush,
    title: 'UI/UX Design',
    description:
      'User-centered design that combines aesthetics with functionality. We create interfaces that are beautiful, intuitive, and drive user engagement.',
    image: '/ourServices/service-uiux.jpg',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    name: 'IT & Cloud Solutions',
    icon: FaCloud,
    title: 'IT & Cloud Solutions',
    description:
      'Scalable IT infrastructure and cloud solutions for businesses of all sizes. From cloud migration to DevOps, we ensure your technology scales with you.',
    image: '/ourServices/service-cloud.jpg',
    features: ['Cloud Migration', 'DevOps', 'Infrastructure Setup', 'Security & Compliance'],
  },
]

const TOOL_GROUPS = [
  {
    label: 'Frontend & Motion',
    items: [
      { name: 'React', Icon: SiReact },
      { name: 'Vite', Icon: SiVite },
      { name: 'Next.js', Icon: SiNextdotjs },
      { name: 'Flutter', Icon: SiFlutter },
      { name: 'GSAP', Icon: SiGreensock },
      { name: 'Three.js', Icon: SiThreedotjs },
    ],
  },
  {
    label: 'Backend & APIs',
    items: [
      { name: 'Node.js', Icon: SiNodedotjs },
      { name: 'Python', Icon: SiPython },
      { name: 'FastAPI', Icon: SiFastapi },
      { name: 'Django', Icon: SiDjango },
      { name: 'Microservices', Icon: Boxes },
      { name: 'REST APIs', Icon: Server },
    ],
  },
  {
    label: 'Data & AI',
    items: [
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'MongoDB', Icon: SiMongodb },
      { name: 'Firebase', Icon: SiFirebase },
      { name: 'Gen AI', Icon: SiOpenai },
      { name: 'AI Agents', Icon: Bot },
      { name: 'ML', Icon: SiTensorflow },
    ],
  },
  {
    label: 'Cloud & Ops',
    items: [
      { name: 'AWS', Icon: SiAmazonwebservices },
      { name: 'Docker', Icon: SiDocker },
      { name: 'Kubernetes', Icon: SiKubernetes },
      { name: 'Linux', Icon: SiLinux },
      { name: 'Jenkins', Icon: SiJenkins },
      { name: 'Scaling', Icon: Cloud },
    ],
  },
  {
    label: 'Design & Automation',
    items: [
      { name: 'Figma', Icon: SiFigma },
      { name: 'Adobe', Icon: SiAdobe },
      { name: 'CRM', Icon: SiHubspot },
      { name: 'Scripting', Icon: Workflow },
      { name: 'Automation', Icon: Brain },
    ],
  },
]

const FEATURED_PROJECTS = [
  {
    title: 'Befit Sports Booking Platform',
    category: 'Sports · Dubai Venues',
    description:
      'Full platform for venue games in Dubai — Super Admin panel, Corporate Admin panel, and the Befit players app where users register and play inside venues.',
    outcome: 'Shipped · Super Admin · Corporate Admin · Players app',
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    image: '/ourServices/service-mobile.jpg',
    year: '2025',
  },
  {
    title: 'Dawat Food Delivery App',
    category: 'Restaurant · Bakery · Dining',
    description:
      'Multi-business food delivery platform — one admin panel to run restaurants, bakeries, and dining brands, plus a single app for customers, drivers, and managers.',
    outcome: 'Shipped · Multi-business admin · Customer · Driver · Manager',
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    image: '/ourServices/service-website.jpg',
    year: '2025',
  },
  {
    title: 'Service Provider Network',
    category: 'Web · Social Marketplace',
    description:
      'Social-style web app where service providers and customers connect — posts, likes, comments, chat, and calls in one place.',
    outcome: 'Shipped · Posts · Chat · Calls · Provider ↔ Customer',
    tech: 'React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    image: '/ourServices/service-social.jpg',
    year: '2025',
  },
  {
    title: 'Catering Management App',
    category: 'Canteen · Catering Ops',
    description:
      'Catering and canteen management for Super Admin, Admins, and Managers — daily expenses, employee salaries, and day-to-day tasks in one system.',
    outcome: 'Shipped · Expenses · Payroll · Daily tasks · Roles',
    tech: 'Flutter, React, FastAPI, PostgreSQL, Redis, Celery, Docker, AWS',
    image: '/ourServices/service-cloud.jpg',
    year: '2025',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    title: 'CEO',
    company: 'TechStart Inc.',
    initials: 'SJ',
    outcome: '3× organic traffic · 6 months',
    content:
      'NVS rebuilt our funnel end-to-end. We saw measurable lift in leads within the first quarter—fast, focused, and obsessively polished.',
  },
  {
    name: 'Michael Chen',
    title: 'Founder',
    company: 'InnovateLab',
    initials: 'MC',
    outcome: '4.8★ app rating · launch in 10 weeks',
    content:
      'They shipped a native-feel product our users actually keep. Clear communication, sharp UX, and zero drama at launch.',
  },
  {
    name: 'Emily Rodriguez',
    title: 'Marketing Director',
    company: 'BrandCo',
    initials: 'ER',
    outcome: 'Unified brand system · 12 markets',
    content:
      'Our rebrand finally feels premium and consistent everywhere. NVS nailed the story and the execution.',
  },
]

const WHY_CHOOSE_US = [
  { title: 'Innovation First', description: 'Cutting-edge solutions for modern challenges' },
  { title: 'Expert Team', description: 'Talented professionals with years of experience' },
  { title: 'Client Focused', description: 'Your success is our priority' },
  { title: 'Fast Delivery', description: 'Efficient processes without compromising quality' },
]

const WHY_LOOP_WORDS = ['Innovation', 'Expertise', 'Partnership', 'Velocity']

const WHO_WE_ARE_P1 =
  'NorthVaultStudios is a futuristic digital agency at the forefront of innovation. We specialize in creating exceptional digital experiences that blend cutting-edge technology with stunning design.'

const WHO_WE_ARE_P2 =
  'From web development to mobile apps, marketing to IT solutions, we transform your vision into reality with precision, creativity, and excellence.'

const HERO_EASE = 'power3.out'

function WhoWeAreSection() {
  const bodyLines = [WHO_WE_ARE_P1, WHO_WE_ARE_P2]

  return (
    <section id="who-we-are" className="stack-section w-full">
      <GsapReveal
        className="site-shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
        stagger={0.14}
        y={32}
      >
        <div className="flex flex-col">
          <span
            className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.35em] text-accent"
            data-reveal
          >
            About the studio
          </span>

          <HandwriteAccent as="h2" size="title" align="left" masked>
            Who We Are
          </HandwriteAccent>
          <HandwriteAccent align="left" tone="soft" className="mt-2 mb-6 md:mb-8" masked>
            Purpose → Passion → Product
          </HandwriteAccent>

          <div className="space-y-4 md:space-y-6" data-reveal>
            {bodyLines.map((line, index) => (
              <p key={index} className="editorial-body text-base md:text-lg">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div
          className="who-we-are__media h-[min(42vh,320px)] w-full overflow-hidden rounded-2xl sm:h-[min(48vh,420px)] lg:h-[min(56vh,520px)]"
          data-reveal
        >
          <video
            className="h-full w-full object-cover object-center"
            src="/updated/who-we-are.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="NorthVaultStudios — ideas, design, development, and growth"
          />
        </div>
      </GsapReveal>
    </section>
  )
}

function MagneticSubmitButton({ children, className = '' }) {
  const canMagnet = usePrefersFinePointer()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, SPRING_CONFIG)
  const smoothY = useSpring(y, SPRING_CONFIG)

  // Avoid forcing layout on every pointer event. Read the rect at most once per frame.
  const rectRef = useRef(null)
  const rafRef = useRef(0)
  const lastEventRef = useRef(null)

  const updateRect = useCallback(() => {
    if (!ref.current) return
    rectRef.current = ref.current.getBoundingClientRect()
  }, [])

  const flushMove = useCallback(() => {
    rafRef.current = 0
    const e = lastEventRef.current
    const rect = rectRef.current
    if (!e || !rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = ((e.clientX - centerX) / rect.width) * 16
    const offsetY = ((e.clientY - centerY) / rect.height) * 16
    x.set(Math.max(-8, Math.min(8, offsetX)))
    y.set(Math.max(-8, Math.min(8, offsetY)))
  }, [x, y])

  const handleMouseEnter = useCallback(() => {
    if (!canMagnet) return
    updateRect()
  }, [canMagnet, updateRect])

  const handleMouseMove = useCallback(
    (e) => {
      if (!canMagnet || !ref.current) return
      lastEventRef.current = e
      if (!rectRef.current) updateRect()
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(flushMove)
    },
    [canMagnet, flushMove, updateRect],
  )

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    lastEventRef.current = null
    rectRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }

  return (
    <motion.button
      ref={ref}
      type="submit"
      onMouseEnter={canMagnet ? handleMouseEnter : undefined}
      onMouseMove={canMagnet ? handleMouseMove : undefined}
      onMouseLeave={canMagnet ? handleMouseLeave : undefined}
      style={canMagnet ? { x: smoothX, y: smoothY } : undefined}
      whileHover={{
        scale: UI_HOVER_SCALE,
        backgroundColor: '#ff8533',
        transition: UI_HOVER_TRANSITION,
      }}
      whileTap={{ scale: UI_TAP_SCALE, transition: UI_HOVER_TRANSITION }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

function ToolsSection() {
  const [activeLabel, setActiveLabel] = useState(TOOL_GROUPS[0].label)
  const activeGroup = TOOL_GROUPS.find((group) => group.label === activeLabel) ?? TOOL_GROUPS[0]

  return (
    <section id="tools" className="stack-section w-full bg-[var(--bg-primary)]">
      <GsapReveal className="site-shell tools-section w-full" stagger={0.1} y={26}>
        <div className="tools-section__header mb-8 flex flex-col items-center text-center md:mb-10">
          <p
            className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs"
            data-reveal
          >
            Tools we use
          </p>
          <HandwriteAccent as="h2" size="title" className="tools-heading" masked>
            Our Stack
          </HandwriteAccent>
          <HandwriteAccent tone="soft" className="mt-2 tools-subhead md:mt-3" masked>
            Built to Ship
          </HandwriteAccent>
          <p
            className="editorial-body mx-auto mt-4 max-w-xl text-sm text-secondary md:mt-5 md:text-base"
            data-reveal
          >
            Pick a category — see the tools we ship with on real client work.
          </p>
        </div>

        <div className="tools-section__body" data-reveal>
          <div
            className="tools-tabs"
            role="tablist"
            aria-label="Stack categories"
          >
            {TOOL_GROUPS.map((group) => {
              const isActive = group.label === activeLabel
              return (
                <button
                  key={group.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`tools-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => setActiveLabel(group.label)}
                >
                  {group.label}
                </button>
              )
            })}
          </div>

          <div
            className="tools-panel"
            role="tabpanel"
            aria-label={activeGroup.label}
          >
            <ul className="tools-grid">
              {activeGroup.items.map(({ name, Icon }) => (
                <li key={name} className="tools-card">
                  <span className="tools-card__icon" aria-hidden>
                    <Icon />
                  </span>
                  <span className="tools-card__name">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GsapReveal>
    </section>
  )
}

function SectionThemeCurve({ position = 'top' }) {
  const isTop = position === 'top'
  return (
    <div
      className={`section-theme-curve section-theme-curve--${position}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="section-theme-curve__svg"
      >
        {isTop ? (
          <path
            d="M0 96V48c160 36 320 48 480 36s320-48 480-48 320 24 480 48v12H0Z"
            fill="currentColor"
          />
        ) : (
          <path
            d="M0 0h1440v48c-160-36-320-48-480-36s-320 48-480 48S160 36 0 12V0Z"
            fill="currentColor"
          />
        )}
      </svg>
    </div>
  )
}

function WhyChooseUsSection() {
  const { theme } = useTheme()
  const invertTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <section
      id="why-choose-us"
      className={`section-theme-invert section-theme-band w-full ${invertTheme}`}
      data-theme={invertTheme}
    >
      <SectionThemeCurve position="top" />

      <div className="section-theme-band__body stack-section">
        <GsapReveal className="site-shell w-full" stagger={0.08} y={26}>
          <div className="why-choose-header mb-12 md:mb-16">
            <p
              className="hero-eyebrow mx-auto mb-4 max-w-2xl text-center sm:mb-5"
              data-reveal
            >
              The NorthVault difference
            </p>
            <HandwriteAccent as="h2" size="title" className="mb-4 md:mb-5" masked>
              Why Choose Us
            </HandwriteAccent>
            <div className="why-choose-headline mx-auto w-full max-w-6xl">
              <div className="why-choose-loop relative flex w-full justify-center py-1 md:py-2" data-reveal>
                <LoopingWords
                  className="relative z-[1] w-full max-w-3xl px-2 sm:max-w-4xl sm:px-0"
                  textClassName="type-display text-[clamp(1.75rem,9vw,5rem)] font-black"
                  words={WHY_LOOP_WORDS}
                  intervalMs={2600}
                  slotPaddingX={24}
                  selectorPaddingX={16}
                />
              </div>
              <HandwriteAccent tone="soft" className="mt-4 md:mt-5" masked>
                Same Team → Bigger Impact
              </HandwriteAccent>
              <p
                className="editorial-body mx-auto mt-5 whitespace-nowrap px-2 text-center text-[clamp(0.7rem,2.35vw,1rem)] text-secondary md:mt-6"
                data-reveal
              >
                One studio for web, apps, brand, and cloud—built to move fast without cutting corners.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
            {WHY_CHOOSE_US.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                className="why-choose-card group relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#ff6b00]/50 hover:shadow-[0_12px_32px_var(--glass-glow)] active:scale-[0.99] sm:p-6 md:p-7"
              >
                <div
                  className="why-choose-card-glow pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full"
                  aria-hidden
                />
                <span className="mb-3 block font-mono text-[clamp(1.35rem,3.5vw,1.85rem)] font-black leading-none text-[#ff6b00]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="type-display-sm mb-2 text-lg leading-tight md:mb-2.5 md:text-xl">
                  {item.title}
                </h3>
                <p className="editorial-body text-sm leading-relaxed text-secondary md:text-[0.95rem]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </GsapReveal>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { theme } = useTheme()
  const invertTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <section
      id="testimonials"
      className={`section-theme-invert section-theme-band w-full ${invertTheme}`}
      data-theme={invertTheme}
    >
      <div className="section-theme-band__body stack-section !pt-4 sm:!pt-6 md:!pt-8">
        <GsapReveal className="site-shell w-full" stagger={0.12} y={28}>
          <div className="text-center">
            <p
              className="mb-2 text-center text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs"
              data-reveal
            >
              Client outcomes
            </p>
            <HandwriteAccent as="h2" size="title" className="mb-2 sm:mb-3" masked>
              What Our Clients Say
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mb-3 sm:mb-4" masked>
              Real Clients → Real Wins
            </HandwriteAccent>
            <p
              className="editorial-body mx-auto mb-6 max-w-xl text-center text-sm sm:mb-8"
              data-reveal
            >
              Real teams. Measurable results. Built to last.
            </p>
          </div>
          <div data-reveal>
            <TestimonialsMarquee testimonials={TESTIMONIALS} />
          </div>
        </GsapReveal>
      </div>

      <SectionThemeCurve position="bottom" />
    </section>
  )
}

function HeroPills() {
  return (
    <>
      <span className="hero-pill">
        <span className="hero-status-dot" />
        Available for projects
      </span>
      <span className="hero-pill">Web · Mobile · Brand · AI</span>
      <span className="hero-pill">NorthVaultStudios</span>
    </>
  )
}

const Home = () => {
  const heroReadableRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setFormStatus('success')
    setFormData({ name: '', email: '', message: '' })
  }, [])

  const scrollToContact = () => scrollToSection('contact', 80)
  const scrollToStory = () => scrollToSection('who-we-are', 80)

  useLayoutEffect(() => {
    const root = heroReadableRef.current
    if (!root) return undefined

    const fades = root.querySelectorAll('[data-hero="fade"]')
    const lines = root.querySelectorAll('[data-hero="line"]')
    const stage = Array.from(root.querySelectorAll('[data-hero="stage"]'))

    if (prefersReducedMotion) {
      gsap.set([fades, lines, stage], { clearProps: 'all' })
      return undefined
    }

    const isCompact = window.matchMedia('(max-width: 1023px)').matches
    const fadeY = isCompact ? 12 : 18
    const stageY = isCompact ? 16 : 28
    const startDelay = isCompact ? 0.06 : 0.12

    const ctx = gsap.context(() => {
      gsap.set(fades, { autoAlpha: 0, y: fadeY })
      gsap.set(lines, { yPercent: 110 })
      gsap.set(stage, { autoAlpha: 0, y: stageY })

      const tl = gsap.timeline({
        defaults: { ease: HERO_EASE },
        delay: startDelay,
      })

      // 1. Handwrite + eyebrow
      tl.to(fades[0], { autoAlpha: 1, y: 0, duration: isCompact ? 0.42 : 0.55 }, 0)
      tl.to(fades[1], { autoAlpha: 1, y: 0, duration: isCompact ? 0.42 : 0.55 }, 0.06)

      // 2–3. Display lines (masked rise)
      const lineMasks = Array.from(lines)
        .map((line) => line.parentElement)
        .filter(Boolean)
      lineMasks.forEach((mask) => mask.classList.add('is-masked'))
      tl.to(
        lines,
        {
          yPercent: 0,
          duration: isCompact ? 0.65 : 0.85,
          stagger: isCompact ? 0.08 : 0.12,
          onComplete: () => {
            lineMasks.forEach((mask) => mask.classList.remove('is-masked'))
          },
        },
        0.14,
      )

      // 4. Mid handwrite + lead
      tl.to(fades[2], { autoAlpha: 1, y: 0, duration: isCompact ? 0.4 : 0.5 }, isCompact ? 0.4 : 0.52)
      tl.to(fades[3], { autoAlpha: 1, y: 0, duration: isCompact ? 0.42 : 0.55 }, isCompact ? 0.48 : 0.62)

      // 5. Trusted clients
      tl.to(fades[4], { autoAlpha: 1, y: 0, duration: isCompact ? 0.4 : 0.5 }, isCompact ? 0.58 : 0.78)

      // CTAs first on compact (above the fold); visual/rail follow
      const [cta, visual, pills, ticker] = stage
      if (isCompact) {
        if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.62)
        const rest = [visual, pills, ticker].filter(Boolean)
        if (rest.length) {
          tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.78)
        }
      } else {
        tl.to(stage, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.82)
      }
    }, root)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <div className="page-root relative">
      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="hero-section page-hero-pad relative min-h-[100dvh] overflow-hidden bg-[var(--bg-primary)]"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="hero-atmosphere__wash" />
          <div className="hero-atmosphere__lamp" />
          <div className="hero-atmosphere__vignette" />
          <div className="hero-atmosphere__grain" />
        </div>

        <div
          ref={heroReadableRef}
          className="hero-readable hero-pad relative z-10 flex min-h-[calc(100dvh-max(6rem,env(safe-area-inset-top,0px)+5.5rem))] w-full min-w-0 flex-col pb-10 pt-4 sm:pb-14"
        >
          <div className="hero-stage flex w-full flex-1 flex-col justify-center">
            <div className="hero-layout">
              <div className="hero-copy">
                <div className="hero-headline">
                  <HeroContent />
                </div>

                <div className="hero-cta-wrap mt-8 sm:mt-10" data-hero="stage">
                  <motion.button
                    type="button"
                    onClick={scrollToContact}
                    whileHover={{ scale: UI_HOVER_SCALE, transition: UI_HOVER_TRANSITION }}
                    whileTap={{ scale: UI_TAP_SCALE, transition: UI_HOVER_TRANSITION }}
                    className="btn-primary btn-primary--hero w-full max-w-xs sm:w-auto"
                  >
                    Start Now
                    <ArrowRight className="hero-cta-arrow" strokeWidth={2.4} />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={scrollToStory}
                    whileHover={{ scale: UI_HOVER_SCALE, transition: UI_HOVER_TRANSITION }}
                    whileTap={{ scale: UI_TAP_SCALE, transition: UI_HOVER_TRANSITION }}
                    className="hero-story-btn"
                  >
                    <span className="hero-story-play" aria-hidden="true">
                      <Play className="hero-story-play-icon" fill="currentColor" strokeWidth={0} />
                    </span>
                    Watch Our Story
                  </motion.button>
                </div>
              </div>

              <div className="hero-visual" data-hero="stage" aria-hidden="true">
                <div className="hero-visual-glow" />
                <div className="hero-visual-rim" />
                <div className="hero-visual-frame">
                  <video
                    className="hero-visual-img hero-visual-video"
                    src="/updated/Man_breathing_on_agency_website_20260923121812_20260923123712.mp4"
                    poster="/updated/hero-character.png"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                </div>
                <div className="hero-visual-reflect" />
              </div>
            </div>
          </div>

          <div className="relative mt-auto w-full">
            <div className="hero-pills-rail" data-hero="stage" aria-hidden>
              <HeroPills />
            </div>

            <div data-hero="stage">
              <HeroTicker />
            </div>
          </div>
        </div>
      </section>

      <WhoWeAreSection />

      <ScrollVerticalStack>
        <ServicesShowcase services={SERVICES} />

        <ToolsSection />

        <section id="work" className="stack-section w-full">
          <GsapReveal className="site-shell w-full" stagger={0.12} y={30}>
            <div className="mb-6 flex flex-col items-center text-center md:mb-8">
              <p
                className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs"
                data-reveal
              >
                Portfolio
              </p>
              <HandwriteAccent as="h2" size="title" masked>
                Featured Work
              </HandwriteAccent>
              <HandwriteAccent tone="soft" className="mt-2 md:mt-3" masked>
                Proof Over Promises
              </HandwriteAccent>
              <p
                className="editorial-body mt-3 max-w-2xl text-sm md:mt-4 md:text-base"
                data-reveal
              >
                Selected shipped products across sports, dining, marketplace, and catering ops—Flutter apps, React web, FastAPI backends on AWS.
              </p>
            </div>
            <div data-reveal>
              <FeaturedWorkCarousel projects={FEATURED_PROJECTS} onCtaClick={scrollToContact} />
            </div>
          </GsapReveal>
        </section>

        <WhyChooseUsSection />

        <TestimonialsSection />

        <section id="contact" className="contact-section stack-section w-full bg-[var(--bg-primary)]">
          <GsapReveal className="site-shell w-full" stagger={0.1} y={26}>
            <ul
              className="contact-trust mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-secondary sm:mb-10"
              data-reveal
            >
              <li>Reply within 24h</li>
              <li>Chandigarh, India</li>
              <li>NDA on request</li>
            </ul>
            <div className="text-center">
              <HandwriteAccent as="h2" size="title" masked>
                Let's Build Something
              </HandwriteAccent>
              <HandwriteAccent tone="soft" className="mt-2 md:mt-3" masked>
                Let's Build What's Next
              </HandwriteAccent>
              <a
                href={MAILTO}
                className="mt-4 inline-block break-all transition-opacity hover:opacity-80 focus-visible:opacity-90 md:mt-5"
                data-reveal
              >
                <BrandedEmail />
              </a>
            </div>

            <div
              className="mt-8 flex flex-col items-center gap-10 lg:mt-10 lg:flex-row lg:items-start lg:justify-center lg:gap-14"
              data-reveal
            >
            <form
              onSubmit={handleSubmit}
              className="contact-form w-full max-w-xl space-y-5 text-left sm:space-y-6"
            >
              {formStatus === 'success' ? (
                <p className="form-feedback form-feedback--success" role="status" aria-live="polite">
                  Message received — we&apos;ll be in touch within one business day.
                </p>
              ) : null}
              {[
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your Name' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your.email@example.com' },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-2 block text-xs uppercase tracking-[0.2em] text-secondary">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full rounded-none border-0 border-b border-[var(--glass-border)] bg-transparent py-3 text-[var(--text-primary)] placeholder:text-secondary transition-colors focus:border-[var(--text-accent)] focus:outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.2em] text-secondary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none rounded-none border-0 border-b border-[var(--glass-border)] bg-transparent py-3 text-[var(--text-primary)] placeholder:text-secondary transition-colors focus:border-[var(--text-accent)] focus:outline-none"
                  />
                </div>
                <MagneticSubmitButton className="mt-2 flex w-full items-center justify-center rounded-full bg-[#ff6b00] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors sm:w-auto">
                  Send Message
                </MagneticSubmitButton>
              </form>

              <div className="flex w-full max-w-none flex-col items-center gap-6 text-center sm:max-w-sm sm:gap-8 lg:w-auto lg:max-w-none lg:items-start lg:pt-2 lg:text-left">
                <div className="space-y-5">
                  <a
                    href="tel:+918219268903"
                    className="flex items-center justify-center gap-3 text-secondary transition-colors hover:text-[var(--text-primary)] lg:justify-start"
                  >
                    <HiOutlinePhone className="shrink-0 text-xl text-[#ff6b00]" />
                    <span>+91 8219268903</span>
                  </a>
                  <div className="flex items-center justify-center gap-3 text-secondary lg:justify-start">
                    <HiOutlineMapPin className="shrink-0 text-xl text-[#ff6b00]" />
                    <span>Chandigarh, India</span>
                  </div>
                </div>
                <div className="flex justify-center gap-5 lg:justify-start">
                  {[
                    { icon: FaLinkedin, url: 'https://www.linkedin.com/company/northvaultstudios/', label: 'LinkedIn' },
                    {
                      icon: FaInstagram,
                      url: 'https://www.instagram.com/northvaultstudios?igsh=MWVhejFtcjd4Nmo2aQ%3D%3D&utm_source=qr',
                      label: 'Instagram',
                    },
                  ].map(({ icon: Icon, url, label }) =>
                    url ? (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-secondary transition-colors hover:text-[#ff6b00]"
                        aria-label={label}
                      >
                        <Icon />
                      </a>
                    ) : (
                      <span
                        key={label}
                        className="cursor-not-allowed text-xl text-secondary/30"
                        title="Coming soon"
                        aria-label={`${label} (Coming soon)`}
                      >
                        <Icon />
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </GsapReveal>
        </section>
      </ScrollVerticalStack>
    </div>
  )
}

export default memo(Home)
