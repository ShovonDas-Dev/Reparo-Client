"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"

// The closing call-to-action panel at the bottom of the About page.
export default function AboutCta() {
  // When reduced motion is on, everything renders in its final state.
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-background px-5 py-16 md:px-8 md:py-24">
      {/* Rounded green panel: fades up once when it comes into view */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: "easeOut" },
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl bg-[#edf0e9] px-6 py-14 text-center dark:bg-[#16211b] md:px-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717970] dark:text-[#a9b3a6]">
          Ready when you are
        </p>
        <h2 className="mt-4 font-heading text-3xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl">
          Let&apos;s get things{" "}
          <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
            working.
          </em>
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Find the right repair and get back to your day.
        </p>

        {/* Button scales up gently on hover and down on tap */}
        <motion.span
          whileHover={
            prefersReducedMotion
              ? undefined
              : { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }
          }
          whileTap={
            prefersReducedMotion
              ? undefined
              : { scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } }
          }
          className="mt-8 inline-block"
        >
          <Link
            href="/services"
            className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[7px] bg-[#c6f36a] px-6 text-sm font-semibold text-[#18221e] transition-colors hover:bg-[#b7e653]"
          >
            Explore services
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.span>
      </motion.div>
    </section>
  )
}
