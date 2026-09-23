import { memo } from 'react'
import { TrustedUsers } from './lightswind/trusted-users'

const trustedAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
]

function MaskedLine({ className, children }) {
  return (
    <span className="hero-reveal-mask">
      <span className={`hero-reveal-inner ${className || ''}`.trim()} data-hero="line">
        {children}
      </span>
    </span>
  )
}

function HeroContent() {
  return (
    <div className="hero-copy-inner w-full max-w-none">
      <p className="hero-handwrite hero-handwrite--top" data-hero="fade" aria-hidden="true">
        More Than a Development Agency
      </p>

      <p className="hero-eyebrow" data-hero="fade">
        NorthVaultStudios · AI-Driven Digital Studio
      </p>

      <h1 className="hero-display hero-display--stack mb-5 sm:mb-7">
        <MaskedLine className="hero-display-line">Your Vision,</MaskedLine>
        <MaskedLine className="hero-display-accent">Our Expertise.</MaskedLine>
      </h1>

      <p className="hero-handwrite hero-handwrite--mid" data-hero="fade" aria-hidden="true">
        Ideas → Impact
      </p>

      <p className="hero-lead mb-5 w-full max-w-xl sm:mb-7" data-hero="fade">
        We design, develop and grow digital products
        <br className="hidden sm:block" />
        that make businesses stronger, faster and future-ready.
      </p>

      <div data-hero="fade">
        <TrustedUsers
          avatars={trustedAvatars}
          totalUsersText={250}
          caption="Trusted by"
          label="clients"
          className="mb-0"
        />
      </div>
    </div>
  )
}

export default memo(HeroContent)
