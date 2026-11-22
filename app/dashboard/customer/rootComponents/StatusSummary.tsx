import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { Booking } from "@/lib/API/service";

import { STATUS_MAP } from "./bookingDisplay";

// Shows how many bookings are in each of the 5 statuses.
type StatusSummaryProps = {
  bookings: Booking[];
};

// The five status cards follow the page reveal with their own stagger.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// The 5 statuses in the order we want to show them.
const STATUSES: Booking["status"][] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

export default function StatusSummary({ bookings }: StatusSummaryProps) {
  return (
    <div className="rounded-xl border border-border">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Status summary</h2>
        <p className="text-sm text-muted-foreground">
          Where your bookings stand right now.
        </p>
      </div>

      <motion.div
        variants={list}
        className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {STATUSES.map((status) => {
          // Count the bookings that have this status.
          const count = bookings.filter(
            (booking) => booking.status === status,
          ).length;

          return (
            <motion.div
              key={status}
              variants={card}
              className="rounded-lg border border-border p-3"
            >
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[status].color}`}
              >
                {STATUS_MAP[status].label}
              </span>
              <p className="mt-2 text-2xl font-bold">{count}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
