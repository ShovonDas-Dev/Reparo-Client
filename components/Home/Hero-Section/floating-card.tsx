"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import { cardEntrance, floatKeyframes, floatTransition } from "./animations"

type FloatingCardProps = {
  /** Position in the entrance stagger (0, 1, 2…). */
  index: number
  /** Extra delay so cards drift out of sync with each other. */
  floatDelay?: number
  className?: string
  children: ReactNode
}

/**
 * A hero floating card.
 *
 * The outer div handles the staggered entrance; the inner div runs the
 * gentle up-and-down float so the two animations never fight each other.
 */
export function FloatingCard({ index, floatDelay = 0, className, children }: FloatingCardProps) {
  return (
    <motion.div
      variants={cardEntrance}
      custom={index}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.div animate={floatKeyframes} transition={floatTransition(floatDelay)}>
        {children}
      </motion.div>
    </motion.div>
  )
}
