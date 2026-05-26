import { memo } from 'react'

const MAILTO = 'mailto:hello@northvaultstudios.com'

function BrandedEmail({ localPart = 'hello', className = '' }) {
  return (
    <span className={`inline break-all ${className}`}>
      <span className="text-secondary">{localPart}@</span>
      <span className="text-[#ff6b00]">northvault</span>
      <span className="text-[var(--text-primary)]">studios</span>
      <span className="text-secondary">.com</span>
    </span>
  )
}

export { MAILTO }
export default memo(BrandedEmail)
