"use client"

import Link from "next/link"
import {
  ArrowRight,
  Fan,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

type ServiceCategory = {
  title: string
  description: string
  icon: LucideIcon
  href: string
  // Tile background + icon color, with dark mode pairs.
  tileClasses: string
}

// The service categories shown on the deployed FixMate site.
const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: "Smartphone",
    description: "Screen, battery & more",
    icon: Smartphone,
    href: "/services?category=Smartphone",
    tileClasses: "bg-[#e3edda] text-[#55702f] dark:bg-[#2a3a22] dark:text-[#a8cf5f]",
  },
  {
    title: "Laptop & PC",
    description: "Repairs that keep you moving",
    icon: Laptop,
    href: "/services?category=Laptop%20%26%20PC",
    tileClasses: "bg-[#f4e7da] text-[#a17548] dark:bg-[#3a2e20] dark:text-[#e6bc7a]",
  },
  {
    title: "AC",
    description: "Cool comfort, restored",
    icon: Fan,
    href: "/services?category=AC",
    tileClasses: "bg-[#dbf0e9] text-[#33816c] dark:bg-[#1d332c] dark:text-[#6fc0a6]",
  },
  {
    title: "Refrigerator",
    description: "Fresh fixes for your fridge",
    icon: Refrigerator,
    href: "/services?category=Refrigerator",
    tileClasses: "bg-[#f8e3db] text-[#bd6f4e] dark:bg-[#3a2722] dark:text-[#e2a285]",
  },
  {
    title: "TV",
    description: "Picture-perfect repairs",
    icon: Tv,
    href: "/services?category=TV",
    tileClasses: "bg-[#e7e5f6] text-[#7263b8] dark:bg-[#282540] dark:text-[#aba0e8]",
  },
  {
    title: "Washing Machine",
    description: "Laundry days, uninterrupted",
    icon: WashingMachine,
    href: "/services?category=Washing%20Machine",
    tileClasses: "bg-[#dfeaf7] text-[#4a79b6] dark:bg-[#1f2c3d] dark:text-[#8fb2e0]",
  },
  {
    title: "Electrical",
    description: "Safe, expert electrical work",
    icon: Zap,
    href: "/services?category=Electrical",
    tileClasses: "bg-[#f7ecd0] text-[#a9873a] dark:bg-[#3a3018] dark:text-[#e2c274]",
  },
]

type CategoryCardProps = {
  category: ServiceCategory
  // The position of the card. Used to show the cards one after another.
  index: number
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = category.icon

  // true when the visitor asked their device for less motion
  const prefersReducedMotion = useReducedMotion()

  return (
    // The card slides up when it comes into view, and lifts a little on hover.
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{
        opacity: 1,
        y: 0,
        // Each card starts a little later than the one before it.
        transition: { duration: 0.5, delay: index * 0.07, ease: "easeOut" },
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -4, transition: { duration: 0.2 } }
      }
      viewport={{ once: true, amount: 0.3 }}
    >
      <Link
        href={category.href}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-input hover:shadow-md"
      >
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl ${category.tileClasses}`}
        >
          <Icon aria-hidden className="size-6" strokeWidth={2} />
        </span>
        <span>
          <span className="block text-sm font-semibold">{category.title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {category.description}
          </span>
        </span>
        <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground opacity-0 transition-all group-hover:opacity-100">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </Link>
    </motion.div>
  )
}

export default function ServiceCaregorise() {
  // true when the visitor asked their device for less motion
  const prefersReducedMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="service-categories-heading"
      className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20 lg:px-12"
    >
      {/* Section header: eyebrow + heading on the left, browse link on the right.
          It fades in once when it comes into view. */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            A good place to start
          </p>
          <h2
            id="service-categories-heading"
            className="mt-3 font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-[2.6rem] md:leading-[1.1]"
          >
            What needs a little love?
          </h2>
        </div>

        <Link
          href="/services"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
        >
          Browse all services
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>

      {/* Category cards: 1 column on mobile, 2 on small, 3 on medium, 4 on large */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {SERVICE_CATEGORIES.map((category, index) => (
          <CategoryCard key={category.title} category={category} index={index} />
        ))}
      </div>
    </section>
  )
}