import { memo } from 'react'
import { cn } from './lib/utils'

/**
 * Caveat script line — use size="title" for section names,
 * default for unique taglines per section.
 */
function HandwriteAccent({
  children,
  className = '',
  tone = 'accent',
  align = 'center',
  size = 'md',
  as: Tag = 'p',
}) {
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
      {children}
    </Tag>
  )
}

export default memo(HandwriteAccent)
