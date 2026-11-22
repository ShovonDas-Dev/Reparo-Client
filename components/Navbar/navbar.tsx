
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, Wrench, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/Navbar/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useSession } from "@/lib/auth-client"
import { UserMenu } from "./user-menu"
import Spinner from "../MyUI/Loading/Spinner" 

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How it works" },
]

const CTA_CLASSES =
  "h-10 rounded-md px-4 text-xs font-semibold hover:-translate-y-0.5 hover:bg-primary/85"

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string
  label: string
  pathname: string
  onClick?: () => void
}) {
  const active = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative text-[13px] font-medium transition-colors hover:text-foreground",
        active
          ? "text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent"
          : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const session = useSession()
  const user = session?.data?.user
  const isPending = session?.isPending

  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  // Authentication actions
  const AuthActions = () => {
    if (isPending) {
      return (
        <div className="flex items-center justify-center px-4">
          <Spinner />
        </div>
      )
    }

    if (user) {
      return <UserMenu />
    }

    return (
      <>
        <Link
          href="/sign-in"
          onClick={close}
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>

        <Link
          href="/sign-up"
          onClick={close}
          className={cn(buttonVariants(), CTA_CLASSES)}
        >
          Get started
          <ArrowUpRight className="size-[15px]" />
        </Link>
      </>
    )
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[66px] w-full max-w-7xl items-center justify-between px-5 md:h-[78px] md:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.05em]"
        >
          <span className="grid size-[34px] place-items-center rounded-xl bg-accent text-accent-foreground">
            <Wrench className="size-[19px]" strokeWidth={2.4} />
          </span>

          <span>
            Reparo<span className="text-[#8fb545]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="ml-[120px] hidden items-center gap-[38px] md:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle />
          <AuthActions />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            {open ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            aria-label="Mobile"
            className="absolute inset-x-0 top-full flex flex-col gap-4 border-b border-border bg-background px-6 pb-5 pt-4 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                pathname={pathname}
                onClick={close}
              />
            ))}

            {/* Mobile Authentication Actions */}
            <div className="flex items-center gap-5 border-t border-border pt-4">
              <AuthActions />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
