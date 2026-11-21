"use client"

import { motion, useReducedMotion } from "motion/react"

// One step of the repair process.
type Step = {
  number: string
  title: string
  description: string
}

// The four steps, in order, as a simple list we can map over.
const STEPS: Step[] = [
  {
    number: "01",
    title: "Choose a service that fits",
    description:
      "Browse trusted pros by device, service, and neighborhood, with clear prices.",
  },
  {
    number: "02",
    title: "Tell your technician what is up",
    description: "Describe the problem and pick a date that works for you.",
  },
  {
    number: "03",
    title: "Get updates as your repair moves along",
    description:
      "Follow your booking from requested to completed, right from your dashboard.",
  },
  {
    number: "04",
    title: "Pay securely once the job is done",
    description:
      "Pay only after the repair is finished, in one simple step.",
  },
]

// The four-step "how it works" sequence for the About page.
export default function ProcessSteps() {
  // When reduced motion is on, everything renders in its final state.
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="bg-background px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section header: fades up once when it comes into view */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: "easeOut" },
          }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717970] dark:text-[#a9b3a6]">
            A nice, simple process
          </p>
          <h2 className="mt-4 font-heading text-3xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl md:text-[2.5rem]">
            From &ldquo;uh oh&rdquo; to{" "}
            <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
              all good.
            </em>
          </h2>
        </motion.div>

        {/* Steps: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="relative mt-12">
          {/* Desktop only: a thin line draws across the top of the four steps */}
          <motion.span
            aria-hidden
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            whileInView={{
              scaleX: 1,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="absolute left-0 top-0 hidden h-px w-full origin-left bg-border lg:block"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              // Each step fades up after the one before it, and lifts on hover.
              <motion.div
                key={step.number}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: "easeOut",
                  },
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.2, ease: "easeOut" } }
                }
                viewport={{ once: true, amount: 0.3 }}
                className="group border-t border-border pt-6 transition-colors hover:border-[#a9b89a] dark:hover:border-[#3f5044]"
              >
                <span className="block font-stat text-4xl italic leading-none text-[#687960] dark:text-[#a8cf5f]">
                  {step.number}
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
