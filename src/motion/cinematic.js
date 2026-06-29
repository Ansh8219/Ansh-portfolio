/** Shared luxury easing + viewport for bidirectional scroll reveals. */
export const CINEMATIC_EASE = [0.22, 0.03, 0.26, 1]

/** Site-wide UI motion (hover/tap/scroll). */
export const MOTION_DURATION = 0.55
export const MOTION_STAGGER = 0.07
export const MOTION_HOVER = 0.2
export const UI_HOVER_SCALE = 1.02
export const UI_TAP_SCALE = 0.98
export const UI_TRANSITION = { duration: MOTION_DURATION, ease: CINEMATIC_EASE }
export const UI_HOVER_TRANSITION = { duration: MOTION_HOVER, ease: CINEMATIC_EASE }

/** One-shot — avoids re-triggering animations while Lenis scrolls through a section. */
export const TEXT_REVEAL_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px 48px 0px',
}

export function getMotionOffset(prefersReducedMotion, isMobile) {
  if (prefersReducedMotion || isMobile) return 0
  return 8
}

export function getWordOffset(prefersReducedMotion, isMobile) {
  if (prefersReducedMotion || isMobile) return 0
  return 6
}

export function createRevealVariants(prefersReducedMotion, isMobile) {
  const y = getMotionOffset(prefersReducedMotion, isMobile)
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: CINEMATIC_EASE },
    },
  }
}

export function createStaggerItemVariants(prefersReducedMotion, isMobile) {
  const y = getMotionOffset(prefersReducedMotion, isMobile)
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: CINEMATIC_EASE },
    },
  }
}

export function createWordVariants(prefersReducedMotion, isMobile) {
  const y = getWordOffset(prefersReducedMotion, isMobile)
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.52, ease: CINEMATIC_EASE },
    },
  }
}

export function createLineVariants(prefersReducedMotion, isMobile) {
  const y = getWordOffset(prefersReducedMotion, isMobile)
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: CINEMATIC_EASE },
    },
  }
}

export function createStaggerContainer(delayChildren = 0.04, staggerChildren = 0.06) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  }
}
