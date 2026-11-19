"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelBooking,
  getCustomerBookings,
  payBooking,
  type Booking,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";

import AlartDeleteBtn from "./AlartDeleteBtn";

// Every status has a short label and a colour for the badge.
const STATUS_MAP: Record<Booking["status"], { label: string; color: string }> =
  {
    pending: { label: "Requested", color: "bg-blue-100 text-blue-700" },
    confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-700" },
    in_progress: { label: "In progress", color: "bg-amber-100 text-amber-700" },
    completed: { label: "Completed", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

// The choices of the "All statuses" dropdown.
const filterOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(STATUS_MAP).map(([value, info]) => ({
    value,
    label: info.label,
  })),
];

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

export default function CustomerBookingsPage() {
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  // The MongoDB _id of the logged in customer.
  const customerId = session?.user?.id;

  // Load the bookings of this customer from the backend.
  // The same function is used again after a cancel or a pay.
  const loadBookings = () => {
    if (!customerId) return Promise.resolve();

    return getCustomerBookings(customerId)
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
    if (!customerId) return;
    loadBookings();
    // We only want a new load when the customer changes. The buttons
    // below reload the list by hand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Ask first, then cancel the booking and load the list again.
  const handleCancel = async (booking: Booking) => {
    try {
      await cancelBooking(booking._id);
      toast.success("Booking cancelled.");
      await loadBookings();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel the booking.",
      );
    }
  };

  // Pay for a finished booking and load the list again.
  const handlePay = async (booking: Booking) => {
    try {
      await payBooking(booking._id);
      toast.success("Payment done. Thank you!");
      await loadBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not pay.");
    }
  };

  // Only the bookings that match the chosen status are shown.
  const visibleBookings = bookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter,
  );
  console.log(visibleBookings);
  // The 3 cards are counted from the real list.
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" || booking.status === "in_progress",
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const statCards = [
    {
      label: "Total bookings",
      value: totalBookings,
      hint: "All your requests",
    },
    { label: "Active bookings", value: activeBookings, hint: "On the way" },
    { label: "Completed jobs", value: completedBookings, hint: "Nice work" },
  ];

  // Only one of these messages is shown above the table.
  const showLoading = isPending || (loading && Boolean(customerId));
  const showSignIn = !isPending && !customerId;
  const showError =
    !showLoading && !showSignIn && error !== "" && bookings.length === 0;
  const showEmpty =
    !showLoading && !showSignIn && !showError && bookings.length === 0;
  const showNoMatch =
    !showLoading &&
    !showSignIn &&
    !showError &&
    bookings.length > 0 &&
    visibleBookings.length === 0;
  const showTable =
    !showLoading && !showSignIn && !showError && visibleBookings.length > 0;

  // All the info that the details modal shows.
  const details = selected
    ? [
        { label: "Category", value: selected.category || "-" },
        { label: "Technician", value: selected.technicianName || "-" },
        { label: "Customer", value: selected.customerName || "-" },
        { label: "Preferred date", value: formatDate(selected.preferredDate) },
        { label: "Address", value: selected.address || "-" },
        { label: "Phone", value: selected.phone || "-" },
        { label: "Issue", value: selected.issueDescription || "-" },
        { label: "Amount", value: `৳${selected.amount}` },
        { label: "Status", value: STATUS_MAP[selected.status].label },
        {
          label: "Payment",
          value: selected.paymentStatus === "paid" ? "Paid" : "Unpaid",
        },
        { label: "Booked on", value: formatDate(selected.createdAt) },
      ]
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My bookings</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of your repair requests in one place.
        </p>
      </div>

      {/* The 3 cards are counted from the list */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* Bookings panel */}
      <div className="rounded-xl border border-border">
        {/* Panel header with the status filter */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Bookings</h2>
            <p className="text-sm text-muted-foreground">
              Cancel a request or pay when the work is done.
            </p>
          </div>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        {showNoMatch && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No bookings with this status.
          </p>
        )}

        {/* The table with the bookings */}
        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Preferred date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-muted/40">
                    {/* Service name with a small picture */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {booking.image ? (
                          <Image
                            src={booking.image}
                            alt={booking.serviceName}
                            width={40}
                            height={40}
                            // Images come from different hosts, so show as-is.
                            unoptimized
                            className="size-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                            <span className="text-xs">IMG</span>
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{booking.serviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Technician */}
                    <td className="px-4 py-3">{booking.technicianName}</td>

                    {/* Preferred date */}
                    <td className="px-4 py-3">
                      {formatDate(booking.preferredDate)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[booking.status].color}`}
                      >
                        {STATUS_MAP[booking.status].label}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 font-medium">৳{booking.amount}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <AlartDeleteBtn
                          booking={booking}
                          onConfirm={handleCancel}
                        />

                        {/* Pay only after the work is done and not paid yet */}
                        {booking.status === "completed" &&
                          booking.paymentStatus === "unpaid" && (
                            <Button
                              size="xs"
                              onClick={() => handlePay(booking)}
                            >
                              Pay now
                            </Button>
                          )}

                        {booking.paymentStatus === "paid" && (
                          <span className="text-xs font-medium text-green-600">
                            Paid
                          </span>
                        )}

                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelected(booking)}
                        >
                          View details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details modal with all the info of one booking */}
      {selected && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selected.serviceName}</DialogTitle>
              <DialogDescription>
                Everything about this booking.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 text-sm">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-right font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
