import { memo } from 'react'

/** Small section marker: an orange square plus a mono label (decorative context, not a heading). */
function SectionLabel({ children, className = '' }) {
  return (
    <p className={`at-label ${className}`}>
      <span className="at-label__mark" aria-hidden="true" />
      {children}
    </p>
  )
}

export default memo(SectionLabel)
