"use client"

import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react"
import { useMotionValue, useSpring } from "motion/react"

// How the springs follow the pointer. Low stiffness keeps the
// movement soft and premium instead of twitchy.
const SPRING_CONFIG = { stiffness: 55, damping: 18, mass: 0.6 }

/**
 * Returns normalized (-0.5 → 0.5) spring-smoothed pointer offsets
 * plus handlers to attach to the hero section.
 *
 * Only active on devices with a fine pointer (mouse/trackpad) and
 * when the user has not asked for reduced motion — on touch devices
 * the values simply stay at 0.
 */
export function usePointerParallax() {
  const [canTrack, setCanTrack] = useState(false)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const x = useSpring(pointerX, SPRING_CONFIG)
  const y = useSpring(pointerY, SPRING_CONFIG)

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    const update = () => setCanTrack(finePointer.matches && !reducedMotion.matches)
    update()

    finePointer.addEventListener("change", update)
    reducedMotion.addEventListener("change", update)
    return () => {
      finePointer.removeEventListener("change", update)
      reducedMotion.removeEventListener("change", update)
    }
  }, [])

  const handleMouseMove = (event: ReactMouseEvent<HTMLElement>) => {
    if (!canTrack) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return { handleMouseMove, handleMouseLeave, x, y }
}
