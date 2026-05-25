import { motion } from 'framer-motion'
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'
import { SCROLL_VIEWPORT_LOOSE as VIEWPORT } from './ScrollReveal'
const EASE = [0.25, 0.1, 0.25, 1]

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
}

const blockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 75, damping: 18, delay: 0.2 + i * 0.12 },
  }),
}

const socialLinks = [
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/company/northvaultstudios' },
  { name: 'Twitter', icon: FaTwitter, url: null },
  {
    name: 'Instagram',
    icon: FaInstagram,
    url: 'https://www.instagram.com/northvaultstudio?igsh=MTNtMmlkZTRicWZ1Yw%3D%3D&utm_source=qr',
  },
  { name: 'Facebook', icon: FaFacebook, url: null },
]

const Footer = () => (
  <footer
    className="relative overflow-hidden border-t border-[var(--glass-border)] bg-[var(--bg-primary)]"
  >
    <motion.div
      className="site-shell relative z-[1] section-pad py-14 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.div className="flex flex-col items-center text-center">
        <motion.div
          className="footer-brand-wrap flex w-full max-w-full items-center justify-center py-8 md:py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <span
            className="footer-brand-mark pointer-events-none select-none font-black"
            style={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-hidden
          >
            NVStudios..
          </span>
        </motion.div>

        <motion.div
          custom={0}
          variants={blockVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-2 max-w-md"
        >
          <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">NorthVaultStudios</p>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            AI-driven digital growth — marketing, web, apps, and custom software under one roof.
          </p>
        </motion.div>

        <motion.div
          custom={1}
          variants={blockVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-8 md:mt-10"
        >
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
                  whileHover={{ y: -3, color: '#ff6b00' }}
                  className="text-lg text-secondary transition-colors hover:text-[#ff6b00]"
                  aria-label={social.name}
                >
                  <Icon />
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-12 border-t border-[var(--glass-border)] pt-6 md:mt-14 md:pt-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-secondary">
          &copy; {new Date().getFullYear()} NorthVaultStudios. All rights reserved.
        </p>
      </div>
    </motion.div>
  </footer>
)

export default Footer
