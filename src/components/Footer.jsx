import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaLinkedin, FaInstagram } from 'react-icons/fa'
import BrandLogo from './BrandLogo'
import GsapReveal from './GsapReveal'
import { CINEMATIC_EASE } from '../motion/cinematic'

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
    <GsapReveal
      className="site-shell relative z-[1] section-pad py-14 md:py-16"
      stagger={0.1}
      y={24}
      start="top 90%"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="footer-brand-wrap flex w-full max-w-full items-center justify-center py-8 md:py-12"
          data-reveal
        >
          <span className="footer-brand-mark pointer-events-none select-none" aria-hidden>
            <span className="footer-brand-mark__nv">NV</span>
            <span className="footer-brand-mark__studios">Studios..</span>
          </span>
        </div>

        <div className="mt-2 max-w-md" data-reveal>
          <p className="text-lg font-semibold tracking-tight">
            <BrandLogo className="brand-logo--footer" />
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            AI-driven digital growth — marketing, web, apps, and custom software under one roof.
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-secondary">
            <li>Reply within 24h</li>
            <li>Chandigarh, India</li>
            <li>NDA on request</li>
          </ul>
        </div>

        <div className="mt-8 md:mt-10" data-reveal>
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
        </div>
      </div>

      <div className="footer-divider-glow mt-10 md:mt-12" aria-hidden data-reveal />
      <div className="mt-8 border-t border-[var(--glass-border)] pt-6 md:mt-10 md:pt-8" data-reveal>
        <p className="text-center text-xs uppercase tracking-[0.2em] text-secondary">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-[#ff6b00]">NorthVault</span>
          <span className="text-[var(--text-primary)]">Studios</span>. All rights reserved.
        </p>
      </div>
    </GsapReveal>
  </footer>
)

export default memo(Footer)
