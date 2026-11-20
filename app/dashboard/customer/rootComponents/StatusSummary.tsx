import type { Booking } from "@/lib/API/service";

import { STATUS_MAP } from "./bookingDisplay";

// Shows how many bookings are in each of the 5 statuses.
type StatusSummaryProps = {
  bookings: Booking[];
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

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATUSES.map((status) => {
          // Count the bookings that have this status.
          const count = bookings.filter(
            (booking) => booking.status === status,
          ).length;

          return (
            <div
              key={status}
              className="rounded-lg border border-border p-3"
            >
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[status].color}`}
              >
                {STATUS_MAP[status].label}
              </span>
              <p className="mt-2 text-2xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
