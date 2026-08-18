import type { Variants, Transition } from 'framer-motion'
import { easing } from './tokens'

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 }
export const softSpring: Transition = { type: 'spring', stiffness: 220, damping: 28 }

/** Page-level enter/exit used by <MotionPage>. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easing.entrance } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: 'easeIn' } },
}

/** Container that reveals children one after another. */
export const staggerContainer = (stagger = 0.06, delayChildren = 0.04): Variants => ({
  initial: {},
  animate: { transition: { staggerChildren: stagger, delayChildren } },
})

/** The child paired with staggerContainer. */
export const riseItem: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing.entrance } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easing.entrance } },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
}

/** Reusable hover/tap feedback for interactive cards. */
export const hoverLift = {
  whileHover: { y: -6, transition: spring },
  whileTap: { scale: 0.985 },
}
