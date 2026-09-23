import { memo, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'

/**
 * One-shot GSAP enter reveal.
 * - `[data-reveal]` → fade + rise
 * - `[data-reveal-word]` → masked word rise (titles / taglines)
 */
function GsapReveal({
  children,
  className = '',
  as: Tag = 'div',
  stagger = 0.1,
  y = 28,
  duration = 0.72,
  start = 'top 82%',
  wordStagger = 0.045,
  wordDuration = 0.72,
  ...rest
}) {
  const rootRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const words = Array.from(root.querySelectorAll('[data-reveal-word]'))
    const items = Array.from(root.querySelectorAll('[data-reveal]'))
    const targets = items.length > 0 ? items : words.length === 0 ? [root] : []

    if (prefersReducedMotion) {
      gsap.set([...words, ...targets], { clearProps: 'all' })
      return undefined
    }

    const ctx = gsap.context(() => {
      if (words.length) gsap.set(words, { yPercent: 115 })
      if (targets.length) gsap.set(targets, { autoAlpha: 0, y })

      ScrollTrigger.create({
        trigger: root,
        start,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: EASE, overwrite: 'auto' } })

          if (words.length) {
            const masks = words
              .map((word) => word.parentElement)
              .filter(Boolean)

            masks.forEach((mask) => mask.classList.add('is-masked'))

            tl.to(
              words,
              {
                yPercent: 0,
                duration: wordDuration,
                stagger: wordStagger,
                onComplete: () => {
                  masks.forEach((mask) => mask.classList.remove('is-masked'))
                },
              },
              0,
            )
          }

          if (targets.length) {
            tl.to(
              targets,
              { autoAlpha: 1, y: 0, duration, stagger },
              words.length ? 0.1 : 0,
            )
          }
        },
      })
    }, root)

    return () => ctx.revert()
  }, [prefersReducedMotion, stagger, y, duration, start, wordStagger, wordDuration])

  return (
    <Tag ref={rootRef} className={className} {...rest}>
      {children}
    </Tag>
  )
}

export default memo(GsapReveal)
