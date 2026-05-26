import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin, FaInstagram } from 'react-icons/fa'
import BrandLogo from './BrandLogo'
import { SCROLL_VIEWPORT_LOOSE as VIEWPORT } from './ScrollReveal'
import { CINEMATIC_EASE, MOTION_DURATION, MOTION_STAGGER } from '../motion/cinematic'

const footerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION,
      ease: CINEMATIC_EASE,
      staggerChildren: MOTION_STAGGER + 0.03,
      delayChildren: 0.06,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_DURATION, ease: CINEMATIC_EASE },
  },
}

const brandVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: MOTION_DURATION + 0.1, ease: CINEMATIC_EASE },
  },
}

const socialLinks = [
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/company/northvaultstudios/' },
  {
    name: 'Instagram',
    icon: FaInstagram,
    url: 'https://www.instagram.com/northvaultstudios?igsh=MWVhejFtcjd4Nmo2aQ%3D%3D&utm_source=qr',
  },
]

const Footer = () => (
  <footer className="relative overflow-x-clip border-t border-[var(--glass-border)] bg-[var(--bg-primary)]">
    <motion.div
      className="site-shell relative z-[1] section-pad py-14 md:py-16"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="footer-brand-wrap flex w-full max-w-full items-center justify-center py-8 md:py-12"
          variants={brandVariants}
        >
          <span
            className="footer-brand-mark pointer-events-none select-none font-black"
            aria-hidden
          >
            <span
              style={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              NV
            </span>
            <span className="text-[var(--text-primary)]" style={{ fontWeight: 900 }}>
              Studios..
            </span>
          </span>
        </motion.div>

        <motion.div variants={childVariants} className="mt-2 max-w-md">
          <p className="text-lg font-semibold tracking-tight">
            <BrandLogo className="brand-logo--footer" />
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            AI-driven digital growth — marketing, web, apps, and custom software under one roof.
          </p>
        </motion.div>

        <motion.div variants={childVariants} className="mt-8 md:mt-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-secondary">Follow Us</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              if (!social.url) {
                return (
                  <span
                    key={social.name}
                    className="cursor-not-allowed text-lg text-secondary/40"
                    title="Coming soon"
                    aria-label={`${social.name} (Coming soon)`}
                  >
                    <Icon />
                  </span>
                )
              }
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, color: '#ff6b00' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
                  className="text-lg text-secondary transition-colors hover:text-[#ff6b00] focus-visible:text-[#ff6b00]"
                  aria-label={social.name}
                >
                  <Icon />
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="footer-divider-glow mt-10 md:mt-12" aria-hidden />
      <div className="mt-8 border-t border-[var(--glass-border)] pt-6 md:mt-10 md:pt-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-secondary">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-[#ff6b00]">NorthVault</span>
          <span className="text-[var(--text-primary)]">Studios</span>. All rights reserved.
        </p>
      </div>
    </motion.div>
  </footer>
)

export default memo(Footer)
