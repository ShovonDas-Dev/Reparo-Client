import Link from "next/link";
import type { Booking, Service } from "@/lib/API/service";
import { Button } from "@/components/ui/button";

// The two things that are waiting for the admin to act.
type PendingActionsProps = {
  bookings: Booking[];
  services: Service[];
};

export default function PendingActions({
  bookings,
  services,
}: PendingActionsProps) {
  // Technician services that still need an approve or reject decision.
  const pendingServiceApprovals = services.filter(
    (service) => service.approvalStatus === "pending",
  ).length;

  // Bookings that still wait for a technician to accept them.
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  return (
    <div className="rounded-xl border border-border">
      {/* Panel header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Needs attention</h2>
        <p className="text-sm text-muted-foreground">
          Things that are waiting for you.
        </p>
      </div>

      {/* Service approvals: count and a link to the services page */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div className="min-w-0">
          <p className="font-medium">Technician service approvals</p>
          <p className="text-xs text-muted-foreground">
            Services posted by technicians, waiting for review.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-2xl font-bold">{pendingServiceApprovals}</span>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/dashboard/admin/services" />}
          >
            Review
          </Button>
        </div>
      </div>

      {/* Pending bookings: count and a link to the bookings page */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-medium">Pending bookings</p>
          <p className="text-xs text-muted-foreground">
            Repair requests without a technician yet.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-2xl font-bold">{pendingBookings}</span>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/dashboard/admin/bookings" />}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
