"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"

// The About page hero: text on the left, picture on the right.
export default function AboutHero() {
  // When reduced motion is on, everything renders in its final state.
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-background px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Text column: eyebrow, heading, paragraph and button stagger in on load */}
        <div>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0, ease: "easeOut" },
            }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717970] dark:text-[#a9b3a6]"
          >
            A better way to repair
          </motion.p>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.1, ease: "easeOut" },
            }}
            className="mt-4 font-heading text-4xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl"
          >
            Less time broken.
            <br />
            <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
              More time being you.
            </em>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
            }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            FixMate brings good people and good repairs together. Because fixing
            the things you love should feel simple, fair, and a little more
            human.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
            }}
            className="mt-8"
          >
            <Link
              href="/services"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[7px] bg-[#c6f36a] px-6 text-sm font-semibold text-[#18221e] transition-colors hover:bg-[#b7e653]"
            >
              Find your fix
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Picture column: fades in and scales up gently on load */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, delay: 0.1, ease: "easeOut" },
          }}
        >
          <Image
            src="/fixmate-hero.png"
            alt="FixMate technician ready to help with a home appliance"
            priority
            width={960}
            height={720}
            className="h-auto w-full rounded-[10px_48px_10px_10px] object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}
