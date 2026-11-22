import Link from "next/link";
import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { Booking } from "@/lib/API/service";
import { Button } from "@/components/ui/button";
import { STATUS_MAP } from "@/app/dashboard/customer/rootComponents/bookingDisplay";

// The 5 newest bookings on the dashboard.
type RecentBookingsProps = {
  bookings: Booking[];
};

// The rows fade in one after another once the panel itself appears.
// There is no initial/animate here on purpose: the page's reveal wrapper
// starts this, so the rows follow the panel instead of running on their own.
// "framer-motion/client" works in a server component, so no "use client".
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  // Sort the newest bookings first, then keep only 5.
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border">
      {/* Panel header with a link to the full list */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-lg font-semibold">Recent bookings</h2>
          <p className="text-sm text-muted-foreground">
            The newest repair requests.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/admin/bookings" />}
        >
          View all
        </Button>
      </div>

      {/* Empty text when there are no bookings yet */}
      {recentBookings.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings yet
        </p>
      )}

      {/* One row per booking: service, customer and status badge */}
      {recentBookings.length > 0 && (
        <motion.div variants={list} className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <motion.div
              key={booking._id}
              variants={row}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{booking.serviceName}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.customerName}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[booking.status].color}`}
              >
                {STATUS_MAP[booking.status].label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}