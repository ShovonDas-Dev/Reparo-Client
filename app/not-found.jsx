
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101913] text-white flex items-center justify-center px-5">

      {/* Animated Star - Side Position */}
      <motion.span
        aria-hidden
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -top-[66px] right-[195px] text-[230px] leading-none text-[#25382a] max-[761px]:-top-[44px] max-[761px]:right-2 max-[761px]:text-[170px]"
      >
        *
      </motion.span>

      {/* Center Content */}
      <div className="relative z-10 w-full max-w-xl text-center">

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[120px] md:text-[170px] font-black leading-none tracking-tighter text-[#c6ff00]"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-3xl md:text-4xl font-bold"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-400 leading-7"
        >
          Sorry, the page you are looking for
          doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex mt-8 items-center gap-3 rounded-xl bg-[#c6ff00] px-8 py-4 font-bold text-[#101913] transition-all duration-300 hover:bg-white hover:-translate-y-1"
          >
            Back to Home <span>→</span>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
