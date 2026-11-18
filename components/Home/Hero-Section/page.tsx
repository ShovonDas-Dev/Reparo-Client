"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, MotionConfig, useTransform } from "motion/react"
import { BadgeCheck, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  fadeDown,
  fadeSoft,
  fadeUp,
  heroContainer,
  scaleUp,
} from "./animations"
import { FloatingCard } from "./floating-card"
import { StatsBand } from "./stats-band"
import { usePointerParallax } from "./use-parallax"

// Reusing the technician image that already ships with the project.
const HERO_IMAGE = "/artifact-LrJJDLKIS2uN68SgtSjS88Ob.png"

// How far each layer drifts with the mouse (in pixels).
const IMAGE_PARALLAX = 12
const BACKGROUND_PARALLAX = -26

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Spring-smoothed pointer offsets (0 on touch devices / reduced motion).
  const { handleMouseMove, handleMouseLeave, x, y } = usePointerParallax()

  const imageX = useTransform(x, (value) => value * IMAGE_PARALLAX)
  const imageY = useTransform(y, (value) => value * IMAGE_PARALLAX)
  const backgroundX = useTransform(x, (value) => value * BACKGROUND_PARALLAX)
  const backgroundY = useTransform(y, (value) => value * BACKGROUND_PARALLAX)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = query.trim()
    router.push(term ? `/services?search=${encodeURIComponent(term)}` : "/services")
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label="Hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-x-clip"
      >
        {/* Soft decorative background shapes (parallax slightly against the pointer) */}
        <motion.div
          aria-hidden
          style={{ x: backgroundX, y: backgroundY }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 right-[-8%] size-[420px] rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute bottom-[-22%] left-[-6%] size-[340px] rounded-full bg-chart-1/20 blur-3xl" />
          <div className="absolute left-[46%] top-14 hidden size-[210px] rounded-full border border-accent/40 lg:block" />
        </motion.div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-14 pt-10 md:px-8 md:pb-16 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-12 lg:pb-20">
          {/* Left column: badge → headline → description → search → trust */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.span
              variants={fadeDown}
              className="inline-flex items-center gap-2.5 rounded-full border border-accent/50 bg-accent/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-ring" />
              The fix is in
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-heading text-[2.4rem] font-bold leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              {/* Each line is a block so the three-line break holds everywhere */}
              <span className="block">Your devices</span>
              <span className="block">deserve better.</span>
              <span className="block">
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 italic">Get them fixed.</span>
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.85, duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-x-0 bottom-1.5 z-0 h-[0.2em] origin-left rounded-full bg-accent/70"
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeSoft}
              className="mt-4 font-heading text-lg font-semibold tracking-tight sm:text-xl"
            >
              A simpler way to get it working.
            </motion.p>

            <motion.p
              variants={fadeSoft}
              className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Find trusted repair professionals for your devices and home
              appliances. Book with confidence. Pay only when the job is done.
            </motion.p>

            {/* Service search bar */}
            <motion.form
              variants={scaleUp}
              onSubmit={handleSearch}
              className="mt-8 max-w-lg"
              role="search"
            >
              <motion.div
                animate={{ scale: isSearchFocused ? 1.01 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border bg-card p-2 pl-4 shadow-sm transition-colors",
                  isSearchFocused
                    ? "border-ring ring-3 ring-ring/30"
                    : "border-border hover:border-input"
                )}
              >
                <Search
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="What needs fixing?"
                  aria-label="Search repair services"
                  className="h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85 sm:px-5"
                >
                  Find a pro
                </motion.button>
              </motion.div>
            </motion.form>

            {/* Trust indicators */}
            <motion.div
              variants={fadeSoft}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5"
            >
              <div aria-hidden className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-chart-4 text-chart-4"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span>{" "}
                from sample customer reviews
              </p>
            </motion.div>
          </motion.div>

          {/* Right column: hero image + floating cards */}
          <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <motion.div style={{ x: imageX, y: imageY }} className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-xl shadow-foreground/5"
              >
                <Image
                  src={HERO_IMAGE}
                  alt="FixMate technician checking a refrigerator with a tablet in a bright kitchen"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
                  className="object-cover"
                />
              </motion.div>

              <FloatingCard
                index={0}
                floatDelay={0.2}
                className="absolute -top-3 right-4 sm:-top-6 sm:-right-3"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 pr-5 shadow-lg shadow-foreground/5 backdrop-blur-sm">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <BadgeCheck className="size-5" strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      Vetted local pros
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Repair, sorted.
                    </p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                index={1}
                floatDelay={1.1}
                className="absolute bottom-4 left-4 sm:-bottom-6 sm:-left-3"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 pr-5 shadow-lg shadow-foreground/5 backdrop-blur-sm">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    JL
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      Jordan Lee
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      Verified technician
                      <span className="inline-flex items-center gap-0.5 font-medium text-foreground">
                        · 4.9
                        <Star
                          aria-hidden
                          className="size-3 fill-chart-4 text-chart-4"
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </motion.div>
          </div>
        </div>

        <StatsBand />
      </section>
    </MotionConfig>
  )
}
