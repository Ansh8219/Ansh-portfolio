import { Children, memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { SCROLL_VIEWPORT } from './ScrollReveal'
import {
  TEXT_REVEAL_VIEWPORT,
  createLineVariants,
  createStaggerContainer,
  createStaggerItemVariants,
  createWordVariants,
} from '../motion/cinematic'

const MOTION_TAGS = {
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  div: motion.div,
}

function useRevealMotion() {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  return { prefersReducedMotion, isMobile, skip: prefersReducedMotion }
}

/**
 * Word-by-word reveal. Plays once when the section enters view (Lenis-safe).
 * Use `segments` for manual line breaks: [{ word: 'We', breakAfter: true }]
 */
export const WordReveal = memo(function WordReveal({
  text,
  segments,
  as = 'span',
  className = '',
  viewport = TEXT_REVEAL_VIEWPORT,
  delayChildren = 0,
  staggerChildren = 0.05,
}) {
  const { prefersReducedMotion, isMobile, skip } = useRevealMotion()
  const MotionTag = MOTION_TAGS[as] ?? motion.span
  const wordVariants = createWordVariants(prefersReducedMotion, isMobile)
  const containerVariants = createStaggerContainer(delayChildren, staggerChildren)

  const items =
    segments ??
    (text ? text.split(/\s+/).filter(Boolean).map((word) => ({ word, breakAfter: false })) : [])

  if (!items.length) return null
  if (skip) {
    const plain = items.map((s) => s.word).join(' ')
    const Tag = as
    return <Tag className={className}>{plain}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {items.map(({ word, breakAfter }, index) => (
        <span key={`${word}-${index}`}>
          <span
            className={`inline-block overflow-hidden align-bottom ${
              index < items.length - 1 ? 'mr-[0.35em]' : ''
            }`}
          >
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
          {breakAfter ? <br className="hidden md:block" /> : null}
        </span>
      ))}
    </MotionTag>
  )
})

/**
 * Line-by-line reveal with overflow clip. Ideal for multi-line headings.
 */
export const LineReveal = memo(function LineReveal({
  lines,
  as = 'h2',
  className = '',
  viewport = TEXT_REVEAL_VIEWPORT,
  delayChildren = 0.02,
  staggerChildren = 0.1,
}) {
  const { prefersReducedMotion, isMobile, skip } = useRevealMotion()
  const MotionTag = MOTION_TAGS[as] ?? motion.h2
  const lineVariants = createLineVariants(prefersReducedMotion, isMobile)
  const containerVariants = createStaggerContainer(delayChildren, staggerChildren)

  if (!lines?.length) return null
  if (skip) {
    const Tag = as
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <motion.span className="block" variants={lineVariants}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
})

/**
 * Staggers direct children (opacity + subtle y). Each child should be a text block element.
 */
export const StaggerTextReveal = memo(function StaggerTextReveal({
  children,
  className = '',
  viewport = TEXT_REVEAL_VIEWPORT,
  delayChildren = 0.03,
  staggerChildren = 0.08,
  as = 'div',
}) {
  const { prefersReducedMotion, isMobile, skip } = useRevealMotion()
  const itemVariants = createStaggerItemVariants(prefersReducedMotion, isMobile)
  const containerVariants = createStaggerContainer(delayChildren, staggerChildren)

  if (skip) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = MOTION_TAGS[as] ?? motion.div
  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={child?.key ?? index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </MotionTag>
  )
})

export { TEXT_REVEAL_VIEWPORT, SCROLL_VIEWPORT }
export default WordReveal
