import { useRef, useState, useCallback, memo, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { HiOutlineGlobeAlt, HiOutlineComputerDesktop, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2'
import {
  FaMobileAlt,
  FaBullhorn,
  FaPaintBrush,
  FaCloud,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from 'react-icons/fa'
import { scrollToSection } from '../utils/scrollToSection'
import ScrollVerticalStack from '../components/ScrollVerticalStack'
import FeaturedWorkCarousel from '../components/FeaturedWorkCarousel'
import TestimonialsMarquee from '../components/TestimonialsMarquee'
import HeroContent from '../components/HeroContent'
import HeroTicker from '../components/HeroTicker'
import ServicesShowcase from '../components/ServicesShowcase'
import { LoopingWords } from '../components/lightswind/looping-words'
import { WordReveal, LineReveal } from '../components/TextReveal'
import {
  SCROLL_VIEWPORT,
  SCROLL_VIEWPORT_LOOSE,
  revealUp,
  staggerContainer as scrollStaggerContainer,
  staggerItem as scrollStaggerItem,
} from '../components/ScrollReveal'

const EASE = [0.25, 0.1, 0.25, 1]
const SPRING_CONFIG = { stiffness: 75, damping: 18 }
const SPRING_WHY = { stiffness: 70, damping: 18 }
const SPRING_TRANSITION = { type: 'spring', stiffness: 75, damping: 18 }
const SPRING_WHY_TRANSITION = { type: 'spring', stiffness: 70, damping: 18 }

const SERVICES = [
  {
    name: 'Website Development',
    icon: HiOutlineGlobeAlt,
    title: 'Website Development',
    description:
      'Custom, responsive websites built with modern technologies. From simple landing pages to complex web applications, we create digital experiences that engage and convert.',
    image: '/ourServices/websitedev_icon.jpg',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Modern Stack'],
  },
  {
    name: 'Mobile Apps',
    icon: FaMobileAlt,
    title: 'Mobile Apps',
    description:
      'Native and cross-platform mobile applications for iOS and Android. We build apps that are intuitive, performant, and deliver exceptional user experiences.',
    image: '/ourServices/mobileAppDev_image.jpg',
    features: ['iOS & Android', 'Cross-Platform', 'UI/UX Design', 'App Store Optimization'],
  },
  {
    name: 'Marketing & Branding',
    icon: FaBullhorn,
    title: 'Marketing & Branding',
    description:
      'Complete branding solutions that tell your story. From logo design to comprehensive brand guidelines, we help you stand out in the digital landscape.',
    image: '/ourServices/marketingAndBranding_icon.jpg',
    features: ['Brand Identity', 'Logo Design', 'Marketing Strategy', 'Content Creation'],
  },
  {
    name: 'Social Media Management',
    icon: FaBullhorn,
    title: 'Social Media Management',
    description:
      'Strategic social media management that grows your audience and engagement. We create compelling content and manage your presence across all platforms.',
    image: '/ourServices/marketingAndBranding_icon.jpg',
    features: ['Content Strategy', 'Community Management', 'Analytics & Reporting', 'Campaign Management'],
  },
  {
    name: 'UI/UX Design',
    icon: FaPaintBrush,
    title: 'UI/UX Design',
    description:
      'User-centered design that combines aesthetics with functionality. We create interfaces that are beautiful, intuitive, and drive user engagement.',
    image: '/ourServices/websitedev_icon.jpg',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    name: 'IT & Cloud Solutions',
    icon: FaCloud,
    title: 'IT & Cloud Solutions',
    description:
      'Scalable IT infrastructure and cloud solutions for businesses of all sizes. From cloud migration to DevOps, we ensure your technology scales with you.',
    image: '/ourServices/itSolutions_icon.jpg',
    features: ['Cloud Migration', 'DevOps', 'Infrastructure Setup', 'Security & Compliance'],
  },
]

const FEATURED_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description:
      'A high-converting storefront with real-time inventory, streamlined checkout, and performance tuned for global traffic.',
    tech: 'React, Node.js, MongoDB',
    image: '/ourServices/websitedev_icon.jpg',
    year: '2024',
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Apps',
    description:
      'Secure, intuitive banking on iOS and Android—biometric login, instant transfers, and a polished native feel.',
    tech: 'React Native, Firebase',
    image: '/ourServices/mobileAppDev_image.jpg',
    year: '2024',
  },
  {
    title: 'Brand Identity Design',
    category: 'Branding',
    description:
      'End-to-end rebrand for a tech startup—logo system, typography, and guidelines built for scale across channels.',
    tech: 'Figma, Adobe Creative Suite',
    image: '/ourServices/marketingAndBranding_icon.jpg',
    year: '2023',
  },
  {
    title: 'Cloud Infrastructure',
    category: 'Cloud & DevOps',
    description:
      'Enterprise-grade cloud architecture with auto-scaling, container orchestration, and 99.9% uptime targets.',
    tech: 'AWS, Docker, Kubernetes',
    image: '/ourServices/itSolutions_icon.jpg',
    year: '2025',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    title: 'CEO',
    company: 'TechStart Inc.',
    initials: 'SJ',
    content:
      'NVS transformed our digital presence. Their innovative approach and attention to detail exceeded our expectations.',
  },
  {
    name: 'Michael Chen',
    title: 'Founder',
    company: 'InnovateLab',
    initials: 'MC',
    content:
      'Working with NVS was a game-changer. They delivered a stunning mobile app that our users love.',
  },
  {
    name: 'Emily Rodriguez',
    title: 'Marketing Director',
    company: 'BrandCo',
    initials: 'ER',
    content:
      'The team at NVS understands branding like no other. Our new identity perfectly captures our vision.',
  },
]

const WHY_CHOOSE_US = [
  { title: 'Innovation First', description: 'Cutting-edge solutions for modern challenges' },
  { title: 'Expert Team', description: 'Talented professionals with years of experience' },
  { title: 'Client Focused', description: 'Your success is our priority' },
  { title: 'Fast Delivery', description: 'Efficient processes without compromising quality' },
]

const WHY_LOOP_WORDS = ['Innovation', 'Expertise', 'Partnership', 'Velocity']

const WHY_ITEM_VARIANTS = [
  {
    hidden: { opacity: 0, x: -120, rotateY: 25, y: 0, rotateX: 0 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      y: 0,
      rotateX: 0,
      transition: SPRING_WHY_TRANSITION,
    },
  },
  {
    hidden: { opacity: 0, y: 100, rotateX: 20, x: 0, rotateY: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      x: 0,
      rotateY: 0,
      transition: SPRING_WHY_TRANSITION,
    },
  },
  {
    hidden: { opacity: 0, y: 100, rotateX: 20, x: 0, rotateY: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      x: 0,
      rotateY: 0,
      transition: SPRING_WHY_TRANSITION,
    },
  },
  {
    hidden: { opacity: 0, x: 120, rotateY: -25, y: 0, rotateX: 0 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      y: 0,
      rotateX: 0,
      transition: SPRING_WHY_TRANSITION,
    },
  },
]

const TESTIMONIAL_CARD_VARIANTS = {
  hidden: { opacity: 0, rotateY: 60 },
  visible: (i) => ({
    opacity: 1,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 75, damping: 18, delay: i * 0.2 },
  }),
}

const WHO_WE_ARE_P1 =
  'NorthVaultStudios is a futuristic digital agency at the forefront of innovation. We specialize in creating exceptional digital experiences that blend cutting-edge technology with stunning design.'

const WHO_WE_ARE_P2 =
  'From web development to mobile apps, marketing to IT solutions, we transform your vision into reality with precision, creativity, and excellence.'

const WHO_WE_ARE_HEADING_WORDS = [
  { word: 'Who', breakAfter: false },
  { word: 'We', breakAfter: true },
  { word: 'Are', breakAfter: false },
]

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
}

function WhoWeAreSection() {
  useEffect(() => {
    const img = new Image()
    img.decoding = 'async'
    img.src = '/homePageImage.jpg'
  }, [])

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
            Who We Are
          </span>

          <WordReveal
            as="h2"
            className="section-heading mb-6 md:mb-8"
            segments={WHO_WE_ARE_HEADING_WORDS}
          />

          <div className="space-y-4 md:space-y-6">
            {bodyLines.map((line, index) => (
              <p key={index} className="editorial-body text-base md:text-lg">
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="h-[min(36vh,280px)] w-full overflow-hidden rounded-2xl sm:h-[min(42vh,380px)] lg:h-[min(52vh,460px)]"
          variants={revealUp}
        >
          <img
            src="/homePageImage.jpg"
            alt="NorthVaultStudios team and work"
            width={1200}
            height={500}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

function usePreloadImages(urls) {
  useEffect(() => {
    urls.forEach((src) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
    })
  }, [urls])
}

function MagneticSubmitButton({ children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, SPRING_CONFIG)
  const smoothY = useSpring(y, SPRING_CONFIG)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = ((e.clientX - centerX) / rect.width) * 16
    const offsetY = ((e.clientY - centerY) / rect.height) * 16
    x.set(Math.max(-8, Math.min(8, offsetX)))
    y.set(Math.max(-8, Math.min(8, offsetY)))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="submit"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
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
      whileHover={{ scale: 1.05, backgroundColor: '#ff8533' }}
      whileTap={{ scale: 0.98 }}
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
  usePreloadImages([
    ...SERVICES.map((s) => s.image),
    ...FEATURED_PROJECTS.map((p) => p.image),
  ])

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (process.env.NODE_ENV === 'development') {
        console.log('Form submitted:', formData)
      }
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    },
    [formData],
  )

  const scrollToContact = () => scrollToSection('contact', 80)

  return (
    <div className="page-root relative">
      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="hero-section page-hero-pad relative min-h-[100dvh] overflow-hidden bg-[var(--bg-primary)]"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="hero-readable hero-pad relative z-10 flex min-h-[calc(100dvh-max(6rem,env(safe-area-inset-top,0px)+5.5rem))] w-full max-w-[100vw] flex-col pb-10 pt-4 sm:pb-14"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex w-full flex-1 flex-col justify-center">
            <motion.div variants={fadeUp}>
              <HeroContent />
            </motion.div>

            <motion.button
              type="button"
              onClick={scrollToContact}
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full max-w-xs sm:w-auto"
            >
              Start Now
            </motion.button>
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
        <ServicesShowcase services={SERVICES} onExploreClick={scrollToContact} />

        <section id="work" className="stack-section w-full">
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <div className="mb-8 flex flex-col items-center text-center md:mb-10">
              <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-secondary md:text-xs">Portfolio</p>
              <WordReveal as="h2" className="section-heading" text="Featured Work" />
              <motion.p
                className="editorial-body mt-4 max-w-2xl text-sm md:mt-5 md:text-base"
                variants={revealUp}
                initial="hidden"
                whileInView="visible"
                viewport={SCROLL_VIEWPORT}
              >
                Selected projects across web, mobile, brand, and cloud—built for growth and long-term scale.
              </motion.p>
            </div>
            <motion.div variants={revealUp}>
              <FeaturedWorkCarousel projects={FEATURED_PROJECTS} />
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
              <p className="hero-eyebrow mx-auto mb-5 max-w-2xl text-center sm:mb-6">
                The NorthVault difference
              </p>
              <div className="why-choose-headline mx-auto w-full max-w-6xl">
                <p className="type-display mx-auto mb-3 w-full text-center text-[clamp(1.35rem,3.5vw,2.25rem)] font-bold leading-tight text-[var(--text-primary)]/90 md:mb-4">
                  Why choose us for
                </p>
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
                <p className="editorial-body mx-auto mt-6 max-w-lg text-center text-sm text-secondary md:mt-8 md:text-base">
                  One studio for web, apps, brand, and cloud—built to move fast without cutting corners.
                </p>
              </div>
            </motion.div>
            <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-10">
              {WHY_CHOOSE_US.map((item, index) => (
                <motion.article
                  key={item.title}
                  variants={scrollStaggerItem}
                  className="why-choose-card group relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-sm transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#ff6b00]/50 hover:shadow-[0_12px_40px_rgba(255,107,0,0.12)] md:p-8"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#ff6b00]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="mb-4 block font-mono text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-none text-[#ff6b00]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="type-display-sm mb-3 md:text-2xl">{item.title}</h3>
                  <p className="editorial-body text-sm text-secondary md:text-base">{item.description}</p>
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
            <WordReveal
              as="h2"
              className="section-heading mb-6 text-center sm:mb-8"
              text="What Our Clients Say"
            />
            <motion.div variants={revealUp}>
              <TestimonialsMarquee testimonials={TESTIMONIALS} />
            </motion.div>
          </motion.div>
        </section>

        <section id="contact" className="stack-section w-full bg-[var(--bg-primary)]">
          <motion.div
            className="site-shell w-full"
            variants={scrollStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={SCROLL_VIEWPORT}
          >
            <div className="text-center">
              <LineReveal
                as="h2"
                className="display-heading"
                lines={["Let's Build Something"]}
              />
              <motion.a
                href="mailto:hello@northvaultstudios.com"
                className="mt-4 inline-block break-all text-lg font-light tracking-tight text-[#ff6b00] transition-opacity hover:opacity-80 md:mt-5 md:text-2xl"
                variants={revealUp}
                initial="hidden"
                whileInView="visible"
                viewport={SCROLL_VIEWPORT}
              >
                hello@northvaultstudios.com
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
                      className="w-full rounded-none border-0 border-b border-[var(--glass-border)] bg-transparent py-3 text-[var(--text-primary)] placeholder:text-secondary transition-colors focus:border-[#ff6b00] focus:outline-none"
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
                    className="w-full resize-none rounded-none border-0 border-b border-[var(--glass-border)] bg-transparent py-3 text-[var(--text-primary)] placeholder:text-secondary transition-colors focus:border-[#ff6b00] focus:outline-none"
                  />
                </div>
                <MagneticSubmitButton className="mt-2 flex w-full items-center justify-center rounded-full bg-[#ff6b00] px-10 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors sm:w-auto">
                  Send Message
                </MagneticSubmitButton>
              </form>

              <div className="flex w-full max-w-none flex-col items-center gap-6 text-center sm:max-w-sm sm:gap-8 lg:w-auto lg:max-w-none lg:items-start lg:pt-2 lg:text-left">
                <div className="space-y-5">
                  <a
                    href="tel:+15551234567"
                    className="flex items-center justify-center gap-3 text-secondary transition-colors hover:text-[var(--text-primary)] lg:justify-start"
                  >
                    <HiOutlinePhone className="shrink-0 text-xl text-[#ff6b00]" />
                    <span>+1 (555) 123-4567</span>
                  </a>
                  <div className="flex items-center justify-center gap-3 text-secondary lg:justify-start">
                    <HiOutlineMapPin className="shrink-0 text-xl text-[#ff6b00]" />
                    <span>Chandigarh, India</span>
                  </div>
                </div>
                <div className="flex justify-center gap-5 lg:justify-start">
                  {[
                    { icon: FaLinkedin, url: 'https://www.linkedin.com/company/northvaultstudios', label: 'LinkedIn' },
                    { icon: FaTwitter, url: null, label: 'Twitter' },
                    {
                      icon: FaInstagram,
                      url: 'https://www.instagram.com/northvaultstudio?igsh=MTNtMmlkZTRicWZ1Yw%3D%3D&utm_source=qr',
                      label: 'Instagram',
                    },
                    { icon: FaFacebook, url: null, label: 'Facebook' },
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
