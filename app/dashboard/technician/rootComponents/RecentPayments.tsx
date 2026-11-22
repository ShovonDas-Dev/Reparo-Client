import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { Booking, Payment } from "@/lib/API/service";

import { formatDate } from "./bookingDisplay";

// Shows the latest 3 payments the technician received.
type RecentPaymentsProps = {
  payments: Payment[];
  bookings: Booking[];
};

// Rows follow the page reveal with a small stagger of their own.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function RecentPayments({
  payments,
  bookings,
}: RecentPaymentsProps) {
  // Sort the newest payments first, then keep only 3.
  const recentPayments = [...payments]
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    )
    .slice(0, 3);

  // Find the service name that belongs to a payment.
  const findServiceName = (payment: Payment) => {
    const booking = bookings.find((item) => item._id === payment.bookingId);
    return booking?.serviceName ?? "Repair service";
  };

  return (
    <div className="rounded-xl border border-border">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Recent payments</h2>
        <p className="text-sm text-muted-foreground">
          Money you received for completed jobs.
        </p>
      </div>

      {recentPayments.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          You have no payments yet.
        </p>
      )}

      {recentPayments.length > 0 && (
        <motion.div variants={list} className="divide-y divide-border">
          {recentPayments.map((payment) => (
            <motion.div
              key={payment._id}
              variants={row}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{findServiceName(payment)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(payment.paidAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium">
                  ৳{payment.amount.toLocaleString("en-US")}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {payment.transactionId}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
