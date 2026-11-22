"use client";

import { motion } from "framer-motion";

type SpinnerProps = {
  size?: number;
  className?: string;
};

export default function Spinner({ size = 48, className = "" }: SpinnerProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`text-lime-300/40 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="8"
          x2="50"
          y2="38"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </motion.svg>
  );
}