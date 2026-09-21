import { useRef, useState, useCallback, memo } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { HiOutlineGlobeAlt, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2'
import {
  FaMobileAlt,
  FaBullhorn,
  FaPaintBrush,
  FaCloud,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa'
import { scrollToSection } from '../utils/scrollToSection'
import ScrollVerticalStack from '../components/ScrollVerticalStack'
import FeaturedWorkCarousel from '../components/FeaturedWorkCarousel'
import TestimonialsMarquee from '../components/TestimonialsMarquee'
import BrandedEmail, { MAILTO } from '../components/BrandedEmail'
import HeroContent from '../components/HeroContent'
import HeroTicker from '../components/HeroTicker'
import ServicesShowcase from '../components/ServicesShowcase'
import HandwriteAccent from '../components/HandwriteAccent'
import { LoopingWords } from '../components/lightswind/looping-words'
import {
  SCROLL_VIEWPORT,
  SCROLL_VIEWPORT_LOOSE,
  revealUp,
  staggerContainer as scrollStaggerContainer,
  staggerItem as scrollStaggerItem,
} from '../components/ScrollReveal'
import {
  CINEMATIC_EASE,
  UI_HOVER_SCALE,
  UI_TAP_SCALE,
  UI_HOVER_TRANSITION,
  MOTION_DURATION,
} from '../motion/cinematic'
import { usePrefersFinePointer } from '../hooks/usePrefersFinePointer'
const SPRING_CONFIG = { stiffness: 75, damping: 18 }
const SPRING_TRANSITION = { type: 'spring', stiffness: 75, damping: 18 }

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

const FEATURED_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description:
      'A high-converting storefront with real-time inventory, streamlined checkout, and performance tuned for global traffic.',
    outcome: 'Checkout conversion +38% · 2.1s LCP',
    tech: 'React, Node.js, MongoDB',
    image: '/ourServices/service-website.jpg',
    year: '2024',
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Apps',
    description:
      'Secure, intuitive banking on iOS and Android—biometric login, instant transfers, and a polished native feel.',
    outcome: '4.8★ app rating · launch in 10 weeks',
    tech: 'React Native, Firebase',
    image: '/ourServices/service-mobile.jpg',
    year: '2024',
  },
  {
    title: 'Brand Identity Design',
    category: 'Branding',
    description:
      'End-to-end rebrand for a tech startup—logo system, typography, and guidelines built for scale across channels.',
    outcome: 'Unified system across 12 markets',
    tech: 'Figma, Adobe Creative Suite',
    image: '/ourServices/service-uiux.jpg',
    year: '2023',
  },
  {
    title: 'Cloud Infrastructure',
    category: 'Cloud & DevOps',
    description:
      'Enterprise-grade cloud architecture with auto-scaling, container orchestration, and 99.9% uptime targets.',
    outcome: '99.9% uptime · 40% infra cost cut',
    tech: 'AWS, Docker, Kubernetes',
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

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.14 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: CINEMATIC_EASE },
  },
}

function WhoWeAreSection() {
  const bodyLines = [WHO_WE_ARE_P1, WHO_WE_ARE_P2]

  return (
    <section id="who-we-are" className="stack-section w-full">
      <motion.div
        className="site-shell grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
        variants={scrollStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={SCROLL_VIEWPORT}
      >
        <motion.div className="flex flex-col" variants={revealUp}>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.35em] text-accent">
            About the studio
          </span>

          <HandwriteAccent as="h2" size="title" align="left">
            Who We Are
          </HandwriteAccent>
          <HandwriteAccent align="left" tone="soft" className="mt-2 mb-6 md:mb-8">
            Purpose → Passion → Product
          </HandwriteAccent>

          <div className="space-y-4 md:space-y-6">
            {bodyLines.map((line, index) => (
              <p key={index} className="editorial-body text-base md:text-lg">
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="who-we-are__media h-[min(42vh,320px)] w-full overflow-hidden rounded-2xl sm:h-[min(48vh,420px)] lg:h-[min(56vh,520px)]"
          variants={revealUp}
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
        </motion.div>
      </motion.div>
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
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: SPRING_TRANSITION,
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={SCROLL_VIEWPORT_LOOSE}
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

        <motion.div
          className="hero-readable hero-pad relative z-10 flex min-h-[calc(100dvh-max(6rem,env(safe-area-inset-top,0px)+5.5rem))] w-full min-w-0 flex-col pb-10 pt-4 sm:pb-14"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-stage flex w-full flex-1 flex-col justify-center">
            <div className="hero-layout">
              <div className="hero-copy">
                <motion.div variants={fadeUp} className="hero-headline">
                  <HeroContent />
                </motion.div>

                <motion.div variants={fadeUp} className="hero-cta-wrap mt-8 sm:mt-10">
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
                </motion.div>
              </div>

              <motion.div variants={fadeUp} className="hero-visual" aria-hidden="true">
                <div className="hero-visual-glow" />
                <div className="hero-visual-rim" />
                <div className="hero-visual-frame">
                  <img
                    src="/updated/hero-character.png"
                    alt=""
                    className="hero-visual-img hero-visual-img--dark"
                    width={1536}
                    height={1024}
                    decoding="async"
                    fetchPriority="high"
                  />
                  <img
                    src="/updated/hero-character-light.png"
                    alt=""
                    className="hero-visual-img hero-visual-img--light"
                    width={1024}
                    height={682}
                    decoding="async"
                  />
                </div>
                <div className="hero-visual-reflect" />
              </motion.div>
            </div>
          </div>

          <div className="relative mt-auto w-full">
            <motion.div
              variants={fadeUp}
              className="hero-pills-rail"
              aria-hidden
            >
              <HeroPills />
            </motion.div>

            <motion.div variants={fadeUp}>
              <HeroTicker />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <WhoWeAreSection />

      <ScrollVerticalStack>
        <ServicesShowcase services={SERVICES} />

        <section id="work" className="stack-section w-full">
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <div className="mb-6 flex flex-col items-center text-center md:mb-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs">Portfolio</p>
              <HandwriteAccent as="h2" size="title">
                Featured Work
              </HandwriteAccent>
              <HandwriteAccent tone="soft" className="mt-2 md:mt-3">
                Proof Over Promises
              </HandwriteAccent>
              <motion.p
                className="editorial-body mt-3 max-w-2xl text-sm md:mt-4 md:text-base"
                variants={revealUp}
              >
                Selected projects across web, mobile, brand, and cloud—built for growth and long-term scale.
              </motion.p>
            </div>
            <motion.div variants={revealUp}>
              <FeaturedWorkCarousel projects={FEATURED_PROJECTS} onCtaClick={scrollToContact} />
            </motion.div>
          </motion.div>
        </section>

        <section id="why-choose-us" className="stack-section w-full bg-[var(--bg-primary)]">
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <motion.div className="why-choose-header mb-12 md:mb-16" variants={revealUp}>
              <p className="hero-eyebrow mx-auto mb-4 max-w-2xl text-center sm:mb-5">
                The NorthVault difference
              </p>
              <HandwriteAccent as="h2" size="title" className="mb-4 md:mb-5">
                Why Choose Us
              </HandwriteAccent>
              <div className="why-choose-headline mx-auto w-full max-w-6xl">
                <div className="why-choose-loop relative flex w-full justify-center py-1 md:py-2">
                  <LoopingWords
                    className="relative z-[1] w-full max-w-3xl px-2 sm:max-w-4xl sm:px-0"
                    textClassName="type-display text-[clamp(1.75rem,9vw,5rem)] font-black"
                    words={WHY_LOOP_WORDS}
                    intervalMs={2600}
                    slotPaddingX={24}
                    selectorPaddingX={16}
                  />
                </div>
                <HandwriteAccent tone="soft" className="mt-4 md:mt-5">
                  Same Team → Bigger Impact
                </HandwriteAccent>
                <p className="editorial-body mx-auto mt-5 whitespace-nowrap px-2 text-center text-[clamp(0.7rem,2.35vw,1rem)] text-secondary md:mt-6">
                  One studio for web, apps, brand, and cloud—built to move fast without cutting corners.
                </p>
              </div>
            </motion.div>
            <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
              {WHY_CHOOSE_US.map((item, index) => (
                <motion.article
                  key={item.title}
                  variants={scrollStaggerItem}
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
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section
          id="testimonials"
          className="stack-section w-full border-y border-[var(--glass-border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
        >
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <p className="mb-2 text-center text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs">
              Client outcomes
            </p>
            <HandwriteAccent as="h2" size="title" className="mb-2 sm:mb-3">
              What Our Clients Say
            </HandwriteAccent>
            <HandwriteAccent tone="soft" className="mb-3 sm:mb-4">
              Real Clients → Real Wins
            </HandwriteAccent>
            <p className="editorial-body mx-auto mb-6 max-w-xl text-center text-sm sm:mb-8">
              Real teams. Measurable results. Built to last.
            </p>
            <motion.div variants={revealUp}>
              <TestimonialsMarquee testimonials={TESTIMONIALS} />
            </motion.div>
          </motion.div>
        </section>

        <section id="contact" className="contact-section stack-section w-full bg-[var(--bg-primary)]">
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <ul className="contact-trust mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-secondary sm:mb-10">
              <li>Reply within 24h</li>
              <li>Chandigarh, India</li>
              <li>NDA on request</li>
            </ul>
            <div className="text-center">
              <HandwriteAccent as="h2" size="title">
                Let's Build Something
              </HandwriteAccent>
              <HandwriteAccent tone="soft" className="mt-2 md:mt-3">
                Let's Build What's Next
              </HandwriteAccent>
              <motion.a
                href={MAILTO}
                className="mt-4 inline-block break-all transition-opacity hover:opacity-80 focus-visible:opacity-90 md:mt-5"
                variants={revealUp}
              >
                <BrandedEmail />
              </motion.a>
            </div>

            <motion.div
              className="mt-8 flex flex-col items-center gap-10 lg:mt-10 lg:flex-row lg:items-start lg:justify-center lg:gap-14"
              variants={revealUp}
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
            </motion.div>
          </motion.div>
        </section>
      </ScrollVerticalStack>
    </div>
  )
}

export default memo(Home)
