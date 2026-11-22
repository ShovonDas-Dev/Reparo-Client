
"use client"

import Link from "next/link"
import { motion, MotionConfig, type Variants } from "motion/react"
import { Wrench } from "lucide-react"

type FooterColumn = {
  title: string
  links: { label: string; href: string }[]
}

const EXPLORE: FooterColumn = {
  title: "Explore",
  links: [
    { label: "All services", href: "/services" },
    { label: "How it works", href: "/about" },
    { label: "Become a technician", href: "/sign-up" },
  ],
}

const POPULAR_REPAIRS: FooterColumn = {
  title: "Popular repairs",
  links: [
    { label: "Smartphone", href: "/services?category=Smartphone" },
    { label: "Laptop & PC", href: "/services?category=Laptop%20%26%20PC" },
    { label: "AC", href: "/services?category=AC" },
    { label: "Refrigerator", href: "/services?category=Refrigerator" },
  ],
}

const SAY_HELLO = {
  title: "Say hello",
  email: "hello@fixmate.example",
  hours: "Mon–Sat, 8am–8pm",
  social: [
    { label: "X", href: "https://x.com", glyph: "𝕏" },
    { label: "Instagram", href: "https://instagram.com", glyph: "◎" },
  ],
}

const columnClass = "flex flex-col items-start gap-[13px]"

const linkClass =
  "text-[13px] leading-[1.6] text-[#788178] transition-colors hover:text-[#354138] dark:text-[#9aa49b] dark:hover:text-[#eef2ea]"

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const viewport = { once: true, amount: 0.2 }

export default function Footer() {
  return (
    <MotionConfig reducedMotion="user">
      <footer className="border-t border-[#e6e9e3] bg-[#f7f8f5] px-12 pt-[42px] pb-[18px] dark:border-[#24302a] dark:bg-[#0d1411] max-[761px]:px-[21px] max-[761px]:pt-[35px] max-[761px]:pb-[15px] min-[761px]:max-[1101px]:px-[30px]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto grid max-w-[1184px] grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 pb-[35px] max-[761px]:grid-cols-2 max-[761px]:gap-x-5 max-[761px]:gap-y-[27px]"
        >
          {/* Brand + tagline */}
          <motion.div variants={fadeUp} className={columnClass}>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-[24px] tracking-[-1.2px] [font-weight:750]"
              >
                <span className="grid size-[34px] place-items-center rounded-[11px] bg-[#c6f36a] text-[#18221e]">
                  <Wrench aria-hidden className="size-[19px]" />
                </span>
                <span>
                  Reparo<span className="text-[#8fb545]">.</span>
                </span>
              </Link>
            </motion.div>

            <p className="my-[3px] text-[13px] leading-[1.7] text-[#808880] dark:text-[#9aa49b]">
              Good repairs. Good people.
              <br />
              A better way to get things working.
            </p>
          </motion.div>

          {/* Link columns */}
          {[EXPLORE, POPULAR_REPAIRS].map((column) => (
            <motion.div
              key={column.title}
              variants={fadeUp}
              className={columnClass}
            >
              <b className="mb-1 text-[14px] font-semibold">
                {column.title}
              </b>

              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          ))}

          {/* Contact column */}
          <motion.div variants={fadeUp} className={columnClass}>
            <b className="mb-1 text-[14px] font-semibold">
              {SAY_HELLO.title}
            </b>

            <a
              href={`mailto:${SAY_HELLO.email}`}
              className={linkClass}
            >
              {SAY_HELLO.email}
            </a>

            <span className="text-[13px] text-[#788178] dark:text-[#9aa49b]">
              {SAY_HELLO.hours}
            </span>

            <div className="flex gap-[13px]">
              {SAY_HELLO.social.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="text-[19px] text-[#3e4940] dark:text-[#dfe8d1]"
                >
                  {item.glyph}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-[1184px] justify-between border-t border-[#e6e9e3] pt-[17px] text-[12px] text-[#929990] dark:border-[#24302a] dark:text-[#7c857c] max-[761px]:flex-col max-[761px]:gap-2 max-[761px]:text-[11px]"
        >
          <span>© 2026 Reparo. Repair made simple.</span>
          <span>Demo experience · Sample listings and statistics</span>
        </motion.div>
      </footer>
    </MotionConfig>
  )
}
