import { memo } from 'react'
import { TrustedUsers } from './lightswind/trusted-users'

const trustedAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
]

function HeroContent() {
  return (
    <div className="w-full max-w-none">
      <p className="hero-eyebrow">NorthVaultStudios · AI-Driven Digital Studio</p>

      <h1 className="hero-display hero-display--row mb-5 sm:mb-7">
        <span>Digital growth,&nbsp;</span>
        <span className="hero-display-accent">built to scale.</span>
      </h1>

      <p className="hero-lead mb-5 w-full max-w-2xl sm:mb-7">
        Marketing, web, apps, and custom software—one team, one roof, built for brands that want to
        move fast without sacrificing quality.
      </p>

      <TrustedUsers
        avatars={trustedAvatars}
        rating={5}
        totalUsersText={250}
        caption="Trusted by "
        starColorClass="text-[#ff6b00]"
        ringColors={[
          'ring-[#ff6b00]/55',
          'ring-[#ff8533]/55',
          'ring-[#ff6b00]/45',
          'ring-[#ff8533]/45',
        ]}
        linkHref="#contact"
        linkLabel="clients"
        className="mb-0 w-full flex-col items-start gap-4 px-0 py-0 text-[var(--text-primary)] sm:flex-row sm:items-center sm:gap-6"
      />
    </div>
  )
}

export default memo(HeroContent)
