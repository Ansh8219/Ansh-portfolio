import { memo } from 'react'
import { cn } from './lib/utils'

export function splitRevealWords(text) {
  return String(text ?? '')
    .split(/(\s+)/)
    .filter((part) => part.length > 0)
}

/** Inline masked words for GSAP yPercent rise (`data-reveal-word`). */
function MaskedWords({ text, className = '' }) {
  const parts = splitRevealWords(text)

  return (
    <span className={cn('reveal-words', className)}>
      {parts.map((part, i) =>
        /^\s+$/.test(part) ? (
          <span key={`sp-${i}`}>{' '}</span>
        ) : (
          <span key={`w-${i}`} className="reveal-word-mask">
            <span className="reveal-word-inner" data-reveal-word>
              {part}
            </span>
          </span>
        ),
      )}
    </span>
  )
}

export default memo(MaskedWords)
