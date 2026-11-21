"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

// Shown by Next.js whenever a URL does not match any page.
// Put this file at: app/not-found.tsx
// Light mode colours are written first, the `dark:` ones are used in dark mode.
// Sizes are written for phones first, then `sm:`, `md:` and `lg:` make them bigger.
export default function NotFound() {
  const router = useRouter();

  // true when the visitor asked their device for less motion
  const prefersReducedMotion = useReducedMotion();

  return (
    // The page covers the whole screen. If the screen is very short
    // (a phone turned sideways), the visitor can scroll up and down.
    <main className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-[#f3f5ef] text-[#0f1a13] dark:bg-[#0f1a13] dark:text-[#ece8da]">
      {/* Background decoration (404 and the star). It is cut at the screen edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Big outlined "404", only a hint of it */}
        <span className="absolute -bottom-[2vw] -left-[1vw] select-none font-serif text-[42vw] font-bold leading-none text-transparent [-webkit-text-stroke:2px_#d3dccf] dark:[-webkit-text-stroke:2px_#25382a] md:text-[26rem]">
          404
        </span>

        {/* The slowly turning star */}
        <motion.span
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-11 right-2 text-[170px] leading-none text-[#dfe7da] dark:text-[#25382a] md:-top-[66px] md:right-24 md:text-[230px] lg:right-[195px]"
        >
          ✳
        </motion.span>
      </div>

      {/* The message, centered up and down on tall screens */}
      <div className="relative z-10 flex min-h-full items-center px-6 py-12 sm:px-12 lg:px-24">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            This page isn&rsquo;t here.
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-[#4d6455] dark:text-[#a9bcae] sm:mt-6 sm:text-lg">
            The link may be broken, or the page may have moved. Check the web
            address, or go back and find what you need from the home page.
          </p>

          {/* Buttons: stacked and full width on phones, side by side on bigger screens */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="w-full rounded-full bg-[#0f1a13] px-6 py-3 text-center text-sm font-semibold text-[#ece8da] transition-colors hover:bg-[#1f3326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f1a13] dark:bg-[#ece8da] dark:text-[#0f1a13] dark:hover:bg-white dark:focus-visible:outline-[#ece8da] sm:w-auto"
            >
              Back to home
            </Link>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-full border border-[#b9c8bc] px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-[#e6ece1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f1a13] dark:border-[#3a5642] dark:text-[#ece8da] dark:hover:bg-[#1a2a20] dark:focus-visible:outline-[#ece8da] sm:w-auto"
            >
              Go back
            </button>
          </div>

          <p className="mt-10 text-sm text-[#6f8776] sm:mt-12">
            Error 404: page not found
          </p>
        </motion.div>
      </div>
    </main>
  );
}