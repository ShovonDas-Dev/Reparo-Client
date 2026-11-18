import type { Transition, Variants } from "motion/react"

// Parent container: staggers its children so each entrance step
// follows the previous one with a small delay.
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

// Promotional badge: fades in while moving slightly downward.
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// Headline: reveals with a smooth upward movement.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

// Softer entrance for the description and trust indicators.
export const fadeSoft: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// Search bar: slides upward with a subtle scale effect.
export const scaleUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
}

// Floating cards: staggered entrance driven by the `custom` index prop.
export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.55 + index * 0.15, duration: 0.5, ease: "easeOut" },
  }),
}

// Gentle infinite floating motion for the cards.
export const floatKeyframes = { y: [0, -8, 0] }

export const floatTransition = (delay = 0): Transition => ({
  duration: 3.6,
  repeat: Infinity,
  ease: "easeInOut",
  delay,
})
