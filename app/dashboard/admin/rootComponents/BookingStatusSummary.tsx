import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { Booking } from "@/lib/API/service";

// How many bookings sit in each of the four main statuses.
type BookingStatusSummaryProps = {
  bookings: Booking[];
};

// The four status cards follow the page reveal with their own stagger.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// The four statuses in the order we want to show them.
const statusCards: { status: Booking["status"]; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "confirmed", label: "Confirmed" },
  { status: "completed", label: "Completed" },
  { status: "cancelled", label: "Cancelled" },
];

export default function BookingStatusSummary({
  bookings,
}: BookingStatusSummaryProps) {
  return (
    <div className="rounded-xl border border-border">
      {/* Panel header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Booking status summary</h2>
        <p className="text-sm text-muted-foreground">
          Where the bookings stand right now.
        </p>
      </div>

      {/* Four simple number cards, one per status */}
      <motion.div
        variants={list}
        className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statusCards.map((card) => {
          // Count the bookings that have this status.
          const count = bookings.filter(
            (booking) => booking.status === card.status,
          ).length;

          return (
            <motion.div
              key={card.status}
              variants={cardVariants}
              className="rounded-lg border border-border p-3"
            >
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-3xl font-bold">{count}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
