"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, MotionConfig, type Variants } from "motion/react"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"

// Same photograph the FixMate demo site uses for the promise panel.
const PROMISE_IMAGE =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85"

const PROMISE_POINTS = [
  "Technicians reviewed before they join",
  "Upfront starting prices, no guesswork",
  "Follow your request from start to finish",
  "Payment only after your repair is done",
]

// Parent wrappers reveal their children one after another.
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// Shared fade-up used by every block that scrolls into view.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const viewport = { once: true, amount: 0.2 }

export default function PromiseSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="promise-heading"
        className="mx-auto grid max-w-[1184px] grid-cols-2 items-center gap-[88px] py-28 max-[761px]:mx-0 max-[761px]:grid-cols-1 max-[761px]:gap-[31px] max-[761px]:px-5 max-[761px]:py-[72px] min-[761px]:max-[1051px]:gap-[35px] min-[761px]:max-[1101px]:mx-[30px] min-[1051px]:max-[1101px]:gap-[50px]"
      >
        {/* Photo with the rotated lime "good people" stamp */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative h-[380px] min-[761px]:max-[1051px]:h-[330px] max-[761px]:mr-[13px] max-[761px]:h-[300px]"
        >
          <Image
            src={PROMISE_IMAGE}
            alt="Technician carefully repairing a home appliance"
            fill
            quality={85}
            sizes="(min-width: 1184px) 548px, (min-width: 761px) calc(50vw - 79px), calc(100vw - 40px)"
            className="rounded-[7px_56px_7px_7px] object-cover"
          />
          <div className="absolute -right-[21px] bottom-5 flex size-[116px] rotate-[8deg] flex-col items-center justify-center gap-1.5 rounded-full bg-[#c6f36a] text-center text-[#435233] max-[761px]:-right-3 max-[761px]:size-[93px]">
            <ShieldCheck aria-hidden className="size-6" />
            <span className="text-[8px] leading-[1.5] tracking-[1px] [font-weight:750]">
              GOOD PEOPLE.
              <br />
              GOOD WORK.
            </span>
          </div>
        </motion.div>

        {/* Eyebrow, heading, copy, checklist and link */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.span
            variants={fadeUp}
            className="block text-[10px] tracking-[1.65px] text-[#717970] dark:text-[#a9b3a6] [font-weight:750]"
          >
            THE FIXMATE PROMISE
          </motion.span>

          <motion.h2
            id="promise-heading"
            variants={fadeUp}
            className="mt-[15px] max-w-[400px] text-[39px] leading-[1.15] tracking-[-1.6px] max-[761px]:text-[32px] [font-weight:550]"
          >
            Repair should feel{" "}
            <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
              this good.
            </em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-[14px] mb-[21px] max-w-[430px] text-[12px] leading-[1.8] text-[#7a837a] dark:text-[#9aa49b]"
          >
            Finding someone you trust should be the easy part. We bring good
            people, clear expectations, and a little more peace of mind to every
            repair.
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="mb-[23px] grid list-none gap-[12px]"
          >
            {PROMISE_POINTS.map((point) => (
              <motion.li
                key={point}
                variants={fadeUp}
                className="flex items-center gap-[10px] text-[11px] text-[#48534a] dark:text-[#b4bdb0]"
              >
                <span className="grid size-5 place-items-center rounded-full bg-[#edf4e4] text-[#6d8a44] dark:bg-[#2a3a22] dark:text-[#a8cf5f]">
                  <Check aria-hidden className="size-[15px]" />
                </span>
                {point}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[12px] text-[#354138] dark:text-[#dfe8d1] [font-weight:650]"
            >
              A little more about us
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-[3px]"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
