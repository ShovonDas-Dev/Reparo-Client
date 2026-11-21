"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

type Step = {
  number: string
  title: string
  description: string
  icon: ReactNode
}

// The four steps of the FixMate process, as shown on the demo site.
const STEPS: Step[] = [
  {
    number: "01",
    title: "Find your fix",
    description: "Browse trusted pros by device, service, and neighborhood.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Request a repair",
    description: "Tell us what is up and pick a date that works for you.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Get it working",
    description: "Your technician gets to work and keeps you in the loop.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
        <path d="m18 15 4-4" />
        <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Pay when it is done",
    description: "Love the result? Pay securely after the repair is complete.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  // true when the visitor asked their device for less motion
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-[#edf0e9] px-5 py-16 dark:bg-[#16211b] md:px-8 md:py-20 lg:px-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Section header: it fades in once when it comes into view */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#717970] dark:text-[#a9b3a6]">
            From broken to back
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-heading text-3xl font-medium leading-[1.15] tracking-[-0.03em] sm:text-4xl md:text-[2.5rem]"
          >
            Easy as one, two,{" "}
            <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
              fixed.
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[390px] text-sm leading-relaxed text-[#798178] dark:text-[#9aa398]">
            We make getting something repaired feel like the easiest thing on
            your list.
          </p>
        </motion.div>

        {/* Steps: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            // Each card comes in a little after the one before it,
            // and lifts a little when the mouse is over it.
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
                  : { y: -4, transition: { duration: 0.2 } }
              }
              viewport={{ once: true, amount: 0.3 }}
              className="group relative flex flex-col rounded-xl border border-[#e3e8dd] bg-[#f9faf7] p-6 transition-[border-color,box-shadow] hover:border-[#cfd8c8] hover:shadow-md dark:border-[#24302a] dark:bg-[#1b2620] dark:hover:border-[#3a4a41]"
            >
              <span className="absolute right-4 top-4 text-[11px] font-medium tracking-[0.1em] text-[#9aa398] dark:text-[#7c857c]">
                {step.number}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#eff5e4] text-[#677f45] dark:bg-[#2a3a22] dark:text-[#a8cf5f]">
                {step.icon}
              </span>
              <h3 className="mt-5 text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7c857c] dark:text-[#9aa398]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}