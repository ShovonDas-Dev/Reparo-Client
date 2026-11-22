import Link from "next/link";
import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";

// Short cuts to the admin pages that exist.
const quickLinks = [
  {
    label: "Users",
    href: "/dashboard/admin/users",
    hint: "Every account on Reparo",
  },
  {
    label: "Bookings",
    href: "/dashboard/admin/bookings",
    hint: "Every repair request",
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    hint: "Every payment made",
  },
  {
    label: "Services",
    href: "/dashboard/admin/services",
    hint: "Approve or reject services",
  },
];

// The link cards fade in one after another once the panel itself appears.
// There is no initial/animate here on purpose: the page's reveal wrapper
// starts this, so the cards follow the panel instead of running on their own.
// "framer-motion/client" works in a server component, so no "use client".
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// A small grid of links to the other admin pages.
export default function QuickLinks() {
  return (
    <div className="rounded-xl border border-border">
      {/* Panel header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Quick links</h2>
        <p className="text-sm text-muted-foreground">
          Jump to any admin page.
        </p>
      </div>

      {/* One link card per page */}
      <motion.div
        variants={grid}
        className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {quickLinks.map((link) => (
          // The wrapper is a grid so the Link still stretches to fill the cell.
          <motion.div key={link.href} variants={card} className="grid">
            <Link
              href={link.href}
              className="rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <p className="font-medium">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.hint}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}