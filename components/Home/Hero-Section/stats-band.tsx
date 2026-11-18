"use client"

import { motion, type Variants } from "motion/react"

type Stat = {
  value: string
  /** Small unit rendered right after the number (k, +, /5…). */
  suffix?: string
  /** Units like "+" and "/5" are lime green, units like "k" stay dark. */
  accentSuffix?: boolean
  label: string
}

// Sample statistics shown on the deployed FixMate site.
const STATS: Stat[] = [
  { value: "120", suffix: "+", accentSuffix: true, label: "sample verified pros" },
  { value: "2.4", suffix: "k", label: "demo repairs completed" },
  { value: "4.9", suffix: "/5", accentSuffix: true, label: "sample customer rating" },
  { value: "7", label: "repair categories" },
]

const bandContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const bandItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function StatItem({ stat }: { stat: Stat }) {
  return (
    <motion.div variants={bandItem} className="flex flex-col gap-1">
      <p className="font-stat text-4xl leading-none md:text-[2.75rem]">
        {stat.value}
        {stat.suffix && (
          <span className={stat.accentSuffix ? "text-ring" : undefined}>
            {stat.suffix}
          </span>
        )}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  )
}

/**
 * Stats band shown below the hero columns.
 * Entrance animations run once when the band scrolls into view.
 */
export function StatsBand() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-24 lg:px-12 lg:pb-28">
      <motion.div
        variants={bandContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-8 rounded-3xl border border-border bg-card px-8 py-8 sm:grid-cols-2 sm:gap-6 md:px-10 lg:grid-cols-5 lg:gap-0"
      >
        {/* Left label */}
        <motion.div variants={bandItem} className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground">A simpler way to</p>
          <p className="text-sm font-semibold">get it working.</p>
        </motion.div>

        {/* Stats — divider lines appear between columns on large screens */}
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="border-border/80 lg:border-l lg:px-8"
          >
            <StatItem stat={stat} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
