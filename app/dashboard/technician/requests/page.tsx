"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getTechnicianBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";

// Every status has a short label and a colour for the badge.
const STATUS_MAP: Record<Booking["status"], { label: string; color: string }> = {
  pending: { label: "Requested", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In progress", color: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

// The next step of a booking. Finished or cancelled bookings have no button.
const nextStep = (
  booking: Booking
): { label: string; status: Booking["status"] } | null => {
  if (booking.status === "pending") {
    return { label: "Accept", status: "confirmed" };
  }
  if (booking.status === "confirmed") {
    return { label: "Start work", status: "in_progress" };
  }
  if (booking.status === "in_progress") {
    return { label: "Mark completed", status: "completed" };
  }
  return null;
};

// Turn "2026-11-20" into "20 Nov 2026".
const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

export default function TechnicianRequests() {
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The email of the logged in technician.
  const email = session?.user?.email;

  // Load the bookings of this technician from the backend.
  // The same function is used again after every status change.
  const loadBookings = () => {
    if (!email) return Promise.resolve();

    return getTechnicianBookings(email)
      .then((data) => {
        setBookings(data);
        setError("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load the list as soon as we know who is logged in.
  useEffect(() => {
    if (!email) return;
    loadBookings();
    // We only want a new load when the technician changes. The buttons
    // below reload the list by hand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // Move the booking to the next status and load the list again.
  const handleStatus = async (booking: Booking, status: Booking["status"]) => {
    try {
      await updateBookingStatus(booking._id, status);
      toast.success("Booking updated.");
      await loadBookings();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update the booking."
      );
    }
  };

  // Only one of these messages is shown above the table.
  const showLoading = isPending || (loading && Boolean(email));
  const showSignIn = !isPending && !email;
  const showError =
    !showLoading && !showSignIn && error !== "" && bookings.length === 0;
  const showEmpty =
    !showLoading && !showSignIn && !showError && bookings.length === 0;
  const showTable =
    !showLoading && !showSignIn && !showError && bookings.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Repair requests</h1>
        <p className="text-sm text-muted-foreground">
          Accept a request and update it while you work.
        </p>
      </div>

      {/* Bookings panel */}
      <div className="rounded-xl border border-border">
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-sm text-muted-foreground">
            {bookings.length} request{bookings.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* Loading, error and empty messages */}
        {showLoading && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        )}

        {showSignIn && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Please sign in to see your bookings.
          </p>
        )}

        {showError && (
          <p className="py-10 text-center text-sm text-destructive">{error}</p>
        )}

        {showEmpty && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            You have no bookings yet
          </p>
        )}

        {/* The table with the bookings */}
        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Preferred date</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => {
                  const step = nextStep(booking);

                  return (
                    <tr key={booking._id} className="hover:bg-muted/40">
                      {/* Service name */}
                      <td className="px-4 py-3 font-medium">
                        {booking.serviceName}
                      </td>

                      {/* Customer name */}
                      <td className="px-4 py-3">{booking.customerName}</td>

                      {/* Preferred date */}
                      <td className="px-4 py-3">
                        {formatDate(booking.preferredDate)}
                      </td>

                      {/* Address */}
                      <td className="px-4 py-3">{booking.address || "-"}</td>

                      {/* Status badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[booking.status].color}`}
                        >
                          {STATUS_MAP[booking.status].label}
                        </span>
                      </td>

                      {/* One button for the next step */}
                      <td className="px-4 py-3">
                        {step && (
                          <Button
                            size="xs"
                            onClick={() => handleStatus(booking, step.status)}
                          >
                            {step.label}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
