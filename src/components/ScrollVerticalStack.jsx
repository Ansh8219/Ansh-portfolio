import { Children } from 'react'

/** Plain vertical sections — no scroll wrappers that can trap wheel events. */
export default function ScrollVerticalStack({ children, className = '' }) {
  const items = Children.toArray(children).filter(Boolean)
  if (items.length === 0) return null

  return <div className={`flex flex-col ${className}`}>{items}</div>
}
