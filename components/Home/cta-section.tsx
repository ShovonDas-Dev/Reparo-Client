"use client"

import Link from "next/link"
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react"
import { ArrowRight } from "lucide-react"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const viewport = { once: true, amount: 0.3 }

export interface CtaSectionProps {
  eyebrow?: string
  title?: string
  highlightedTitle?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  headingId?: string
}

export default function CtaSection({
  eyebrow = "YOUR TO-DO LIST CAN BREATHE",
  title = "Ready to get it",
  highlightedTitle = "working?",
  subtitle = "Good local help is closer than you think.",
  buttonText = "Explore services",
  buttonHref = "/services",
  headingId = "cta-heading",
}: CtaSectionProps) {
  // Null while the media query is still unknown, so SSR and the first client
  // render stay identical and the spin only starts after mount.
  const prefersReducedMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby={headingId}
        className="relative mx-auto mt-[70px] mb-[78px] flex min-h-[193px] max-w-[1184px] items-center justify-between overflow-hidden rounded-[8px] bg-[#1c2a22] px-[45px] py-[38px] text-white max-[761px]:mx-5 max-[761px]:mt-[47px] max-[761px]:mb-[47px] max-[761px]:min-h-[200px] max-[761px]:flex-col max-[761px]:items-start max-[761px]:gap-[18px] max-[761px]:px-[23px] max-[761px]:py-[28px] min-[761px]:max-[1101px]:mx-[30px]"
      >
        {/* Slowly spinning asterisk tucked behind the copy */}
        <motion.span
          aria-hidden
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -top-[66px] right-[195px] text-[230px] leading-none text-[#25382a] max-[761px]:-top-[44px] max-[761px]:right-2 max-[761px]:text-[170px]"
        >
          ✳
        </motion.span>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative z-[1]"
        >
          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className="block text-[10px] tracking-[1.65px] text-[#c1d0b6] [font-weight:750]"
            >
              {eyebrow}
            </motion.span>
          )}

          <motion.h2
            id={headingId}
            variants={fadeUp}
            className="relative z-[1] mt-3 text-[34px] leading-[1.15] tracking-[-1.6px] max-[761px]:text-[28px] [font-weight:550]"
          >
            {title}{" "}
            {highlightedTitle && (
              <em className="font-stat font-normal italic text-[#c6f36a]">
                {highlightedTitle}
              </em>
            )}
          </motion.h2>

          {subtitle && (
            <motion.p
              variants={fadeUp}
              className="mt-[9px] text-[11px] text-[#b2bdb4]"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* Hover lift + tap feedback wrapper around the lime button */}
        <motion.span
          initial={{ opacity: 0, y: 22 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: "easeOut" },
          }}
          viewport={viewport}
          whileHover={{
            y: -2,
            transition: { type: "spring", stiffness: 400, damping: 24 },
          }}
          whileTap={{ scale: 0.97, transition: { duration: 0.12 } }}
          className="relative z-[2]"
        >
          <Link
            href={buttonHref}
            className="group inline-flex min-h-[48px] items-center justify-center gap-2.5 whitespace-nowrap rounded-[7px] bg-[#c6f36a] px-[22px] text-[13px] text-[#18221e] transition-colors hover:bg-[#b7e653] [font-weight:650]"
          >
            {buttonText}
            <ArrowRight
              aria-hidden
              className="size-[17px] transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.span>
      </section>
    </MotionConfig>
  )
}