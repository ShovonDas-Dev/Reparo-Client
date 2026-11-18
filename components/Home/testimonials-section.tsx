"use client"

import { motion, MotionConfig, type Variants } from "motion/react"

type Testimonial = {
  initial: string
  quote: string
  name: string
  service: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    initial: "M",
    quote:
      "Booking took less time than looking up how to fix it myself. Jordan was kind, on time, and my phone looks brand new.",
    name: "Maya R.",
    service: "Phone screen repair",
  },
  {
    initial: "C",
    quote:
      "Clear price, friendly technician, and the washer is back in action. Exactly how a repair should go.",
    name: "Chris T.",
    service: "Appliance repair",
  },
  {
    initial: "N",
    quote:
      "I really appreciated knowing what to expect before anyone came to the door. Such a thoughtful service.",
    name: "Nina K.",
    service: "AC inspection",
  },
]

// Grid parent: reveals the three quote cards one after another.
const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const viewport = { once: true, amount: 0.2 }

export default function TestimonialsSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="testimonials-heading"
        className="bg-white px-12 pt-[78px] pb-[82px] dark:bg-[#131c16] max-[761px]:px-5 max-[761px]:pt-[62px] max-[761px]:pb-[62px]"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            className="block text-[10px] tracking-[1.65px] text-[#717970] dark:text-[#a9b3a6] [font-weight:750]"
          >
            KIND WORDS, SAMPLE STORIES
          </motion.span>
          <motion.h2
            id="testimonials-heading"
            variants={fadeUp}
            className="mt-[13px] text-[36px] leading-[1.15] tracking-[-1.6px] max-[761px]:text-[29px] [font-weight:550]"
          >
            Good fixes.{" "}
            <em className="font-stat font-normal italic text-[#687960] dark:text-[#a8cf5f]">
              Good feelings.
            </em>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto mt-[30px] grid max-w-[1184px] grid-cols-3 gap-[15px] max-[761px]:grid-cols-1 max-[761px]:gap-[10px]"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={fadeUp}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 300, damping: 24 },
              }}
              className="rounded-[7px] border border-[#eaede7] px-[23px] py-[22px] dark:border-[#24302a] max-[761px]:px-[18px] max-[761px]:py-[18px]"
            >
              <p className="text-[12px] tracking-[2px] text-[#a0c655]">
                ★★★★★
              </p>
              <blockquote className="mt-[14px] mb-[21px] text-[17px] leading-[1.5] text-[#3f4940] dark:text-[#eef2ea] max-[761px]:text-[16px] font-stat">
                “{testimonial.quote}”
              </blockquote>
              <div className="flex items-center gap-[10px]">
                <span className="inline-grid size-[35px] flex-none place-items-center rounded-full border-2 border-[#f7f8f5] bg-[#d4e3c2] text-[10px] text-[#3e5842] dark:border-[#131c16] dark:bg-[#2a3a22] dark:text-[#a8cf5f] [font-weight:700]">
                  {testimonial.initial}
                </span>
                <div>
                  <b className="block text-[10px]">{testimonial.name}</b>
                  <small className="mt-1 block text-[9px] text-[#8a918a] dark:text-[#9aa49b]">
                    {testimonial.service} · Sample testimonial
                  </small>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-[18px] text-center text-[9px] text-[#a0a69e] dark:text-[#7c857c]"
        >
          Testimonials shown are illustrative sample content.
        </motion.p>
      </section>
    </MotionConfig>
  )
}
