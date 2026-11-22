
"use client";

import Link from "next/link";
import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

// Shows a warning when new repair requests are waiting.
type NewRequestsBannerProps = {
  count: number;
};

// Follows the parent page reveal without starting its own.
const banner: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function NewRequestsBanner({
  count,
}: NewRequestsBannerProps) {
  // Nothing to show when there are no new requests.
  if (count === 0) {
    return null;
  }

  // "request" stays singular when the count is 1.
  const requestWord = count === 1 ? "request" : "requests";

  return (
    <motion.div
      variants={banner}
      className="group relative mb-6 flex flex-col gap-4 overflow-hidden border-b border-amber-200/70 bg-gradient-to-r from-amber-50 via-amber-50/70 to-transparent px-5 py-4 transition-colors duration-300 hover:from-amber-100/80 hover:via-amber-50 dark:border-amber-400/15 dark:from-amber-400/[0.08] dark:via-amber-400/[0.04] dark:to-transparent dark:hover:from-amber-400/[0.12] dark:hover:via-amber-400/[0.07] sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left Content */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Alert Icon */}
        <motion.span
          animate={{
            scale: [1, 1.06, 1],
            opacity: [1, 0.75, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-amber-200 bg-amber-100 text-amber-700 transition-colors duration-300 group-hover:border-amber-300 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </motion.span>

        {/* Text */}
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.2px] text-amber-950 dark:text-amber-200">
            You have {count} new {requestWord}
          </p>

          <p className="mt-1 text-xs text-amber-800/75 dark:text-amber-200/60">
            Accept a request to start planning the work.
          </p>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex shrink-0 items-center gap-3 pl-[52px] sm:pl-0">

        {/* Count Badge */}
        <motion.span
          key={count}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          className="inline-flex min-w-8 items-center justify-center rounded-full border border-amber-300/80 bg-amber-100 px-3 py-1 text-xs font-semibold tabular-nums text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
        >
          {count}
        </motion.span>

        {/* View Requests Button */}
        <Button
          render={<Link href="/dashboard/technician/requests" />}
          className="h-9 gap-2 rounded-lg border border-amber-300/70 bg-amber-500 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-md dark:border-amber-400/20 dark:bg-amber-400/15 dark:text-amber-200 dark:hover:bg-amber-400/25 dark:hover:text-amber-100"
        >
          View requests

          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            whileHover={{ x: 3 }}
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </motion.svg>
        </Button>
      </div>
    </motion.div>
  );
}
