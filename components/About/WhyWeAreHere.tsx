"use client"

import { motion, useReducedMotion } from "motion/react"

// A centered section that explains why FixMate exists.
export default function WhyWeAreHere() {
  // When reduced motion is on, everything renders in its final state.
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-[#edf0e9] px-5 py-16 dark:bg-[#16211b] md:px-8 md:py-24">
      {/* Narrow text column: eyebrow, heading and paragraph fade up together */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: "easeOut" },
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717970] dark:text-[#a9b3a6]">
          Why we are here
        </p>
        <h2 className="mt-4 font-heading text-3xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl md:text-[2.5rem]">
          Repair is personal. Finding help should be, too.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          We believe a broken appliance should not mean a broken day. FixMate
          helps you discover local repair professionals, understand what comes
          next, and feel good about who you welcome into your home.
        </p>
      </motion.div>
    </section>
  )
}
