import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CINEMATIC_EASE, createStaggerContainer } from '../motion/cinematic'

/**
 * One-shot viewport — plays once per section, no re-trigger on scroll up/down (Lenis-safe).
 */
export const SCROLL_VIEWPORT = {
  once: true,
  amount: 0.1,
  margin: '0px 0px 48px 0px',
}

export const SCROLL_VIEWPORT_LOOSE = {
  once: true,
  amount: 0.08,
  margin: '0px 0px 64px 0px',
}

/** @deprecated Use SCROLL_VIEWPORT — kept for imports that still reference it. */
export const SCROLL_VIEWPORT_ONCE = SCROLL_VIEWPORT

export { CINEMATIC_EASE, TEXT_REVEAL_VIEWPORT } from '../motion/cinematic'

/** Fade + rise — content feels like it loads upward as you scroll (Lenis-safe with once viewport). */
export const revealUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: CINEMATIC_EASE },
  },
}

export const revealFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: CINEMATIC_EASE },
  },
}

export const staggerContainer = createStaggerContainer(0.03, 0.07)

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: CINEMATIC_EASE },
  },
}

function ScrollReveal({
  children,
  className = '',
  variants = revealUp,
  viewport = SCROLL_VIEWPORT,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export default memo(ScrollReveal)
