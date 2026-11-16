import { memo } from 'react'

function BrandLogo({ compact = false, onDark = false, className = '' }) {
  return (
    <span
      className={`brand-logo inline-flex items-baseline leading-none ${compact ? 'brand-logo--compact' : ''} ${
        onDark ? 'text-white' : 'text-[var(--text-primary)]'
      } ${className}`}
    >
      <span className="brand-logo__mark text-[#ff6b00]">Ansh</span>
      <span className="brand-logo__word">.dev</span>
    </span>
  )
}

export default memo(BrandLogo)
