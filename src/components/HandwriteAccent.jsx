import { memo } from 'react'
import { cn } from './lib/utils'
import MaskedWords from './MaskedWords'

/**
 * Caveat script line — use size="title" for section names,
 * default for unique taglines per section.
 * Pass `masked` for enter-only GSAP word rise (via GsapReveal).
 */
function HandwriteAccent({
  children,
  className = '',
  tone = 'accent',
  align = 'center',
  size = 'md',
  as: Tag = 'p',
  masked = false,
}) {
  const content =
    masked && (typeof children === 'string' || typeof children === 'number') ? (
      <MaskedWords text={String(children)} />
    ) : (
      children
    )

  return (
    <Tag
      className={cn(
        'handwrite-accent',
        size === 'title' && 'handwrite-accent--title',
        size === 'sm' && 'handwrite-accent--sm',
        tone === 'soft' && 'handwrite-accent--soft',
        align === 'left' && 'handwrite-accent--left',
        className,
      )}
    >
      {content}
    </Tag>
  )
}

export default memo(HandwriteAccent)
