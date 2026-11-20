import Link from "next/link";
import type { Booking } from "@/lib/API/service";
import { Button } from "@/components/ui/button";

import { STATUS_MAP, formatDate } from "./bookingDisplay";

// Shows the latest 5 bookings of the technician.
type RecentBookingsProps = {
  bookings: Booking[];
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
      {/* Panel header with a link to the full request list */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-lg font-semibold">Recent bookings</h2>
          <p className="text-sm text-muted-foreground">
            Your latest repair jobs.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/technician/requests" />}
        >
          View all
        </Button>
      </div>

      {recentBookings.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings yet.
        </p>
      )}

      {recentBookings.length > 0 && (
        <div className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{booking.serviceName}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.customerName || "-"} ·{" "}
                  {formatDate(booking.preferredDate)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[booking.status].color}`}
                >
                  {STATUS_MAP[booking.status].label}
                </span>

                <span className="text-sm font-medium">৳{booking.amount}</span>

                <span className="text-xs text-muted-foreground">
                  {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
