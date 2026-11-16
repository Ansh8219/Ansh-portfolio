import { memo } from 'react'

const EMAIL = 'ansh.dev721@gmail.com'
const MAILTO = `mailto:${EMAIL}`

function BrandedEmail({ className = '' }) {
  const [local, domain] = EMAIL.split('@')
  return (
    <span className={`branded-email inline break-all ${className}`}>
      <span className="text-[var(--text-accent-ink)]">{local}</span>
      <span className="text-secondary">@{domain}</span>
    </span>
  )
}

export { MAILTO, EMAIL }
export default memo(BrandedEmail)
