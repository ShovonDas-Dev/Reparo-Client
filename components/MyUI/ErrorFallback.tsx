
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  message = "We could not load the bookings right now. Please try again later.",
  title = "Failed to load bookings.",
  onRetry,
}: ErrorFallbackProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-red-100 bg-white px-6 py-12 text-center shadow-xl shadow-gray-200/40 transition-colors duration-300 dark:border-[#293a2f] dark:bg-[#121c16] dark:shadow-black/20 sm:px-10"
      >

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-100/50 blur-3xl dark:bg-red-500/5" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl dark:bg-lime-400/5" />

        {/* Animated Error Icon */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] bg-red-50 ring-1 ring-red-100 dark:bg-red-500/10 dark:ring-red-500/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-red-500 dark:text-red-400"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              d="M12 9v4m0 4h.01M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Error Content */}
        <div className="relative space-y-3">

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-500 dark:text-red-400">
            Something went wrong
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {title}
          </h2>

          <p className="mx-auto max-w-sm text-sm leading-7 text-gray-500 dark:text-[#9aa99e]">
            {message}
          </p>

        </div>

        {/* Retry Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleRetry}
          className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-[#151c17] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#26372b] dark:bg-[#c6ff6b] dark:text-[#142016] dark:shadow-lime-400/10 dark:hover:bg-[#b2ed54]"
        >
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M20 7v5h-5M4 17v-5h5m-4.5-2a7.5 7.5 0 0 1 12.8-3.2L20 12M4 12l2.7 5.2A7.5 7.5 0 0 0 19 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>

          Try Again
        </motion.button>

        {/* Footer */}
        <p className="relative mt-6 text-xs text-gray-400 dark:text-[#718077]">
          Don't worry, your data is safe.
        </p>

      </motion.div>
    </div>
  );
}
