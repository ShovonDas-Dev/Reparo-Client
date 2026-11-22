"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
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
  type Booking,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

import AlartDeleteBtn from "./AlartDeleteBtn";
import { useRouter } from "next/navigation";
import {
  STATUS_MAP,
  formatDate,
} from "../rootComponents/bookingDisplay";

// The choices of the "All statuses" dropdown.
const filterOptions = [
  { value: "all", label: "All statuses" },
  ...Object.entries(STATUS_MAP).map(([value, info]) => ({
    value,
    label: info.label,
  })),
];

// One staggered reveal for the page, its cards and its table rows.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function CustomerBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  // Bumping this number loads the list again (used after a cancel).
  const [reloadKey, setReloadKey] = useState(0);

  // The MongoDB _id of the logged in customer.
  const customerId = session?.user?.id;

  // Load the bookings of this customer from the backend.
  // The reload key runs this again after a cancel.
  useEffect(() => {
    if (!customerId) return;

    // This flag stops us from saving data after the page is gone.
    let active = true;

    // Keep the checked value in a simple variable for the async function.
    const customerMongoId = customerId;

    async function load() {
      try {
        // Get the JWT for this signed-in customer.
        const token = await getClientToken();
        const data = await getCustomerBookings(customerMongoId, token);

        if (!active) return;
        setBookings(data);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [customerId, reloadKey]);

  // Ask first, then cancel the booking and load the list again.
  const handleCancel = async (booking: Booking) => {
    try {
      // Get the JWT for this signed-in customer.
      const token = await getClientToken();
      await cancelBooking(booking._id, token);
      toast.success("Booking cancelled.");

      // Ask the effect to load the list again.
      setReloadKey((key) => key + 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel the booking.",
      );
    }
  };

  // Send the customer to the simulated checkout. The booking only becomes
  // paid after the checkout page calls the backend.
  const handlePay = (booking: Booking) => {
    router.push(`/checkout?bookingId=${encodeURIComponent(booking._id)}`);
  };

  // Only the bookings that match the chosen status are shown.
  const visibleBookings = bookings.filter(
    (booking) => statusFilter === "all" || booking.status === statusFilter,
  );
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      {/* Page title */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My bookings</h1>
        <p className="text-sm text-muted-foreground">
          Keep track of your repair requests in one place.
        </p>
      </motion.div>

      {/* The 3 cards are counted from the list */}
      <motion.div variants={container} className="mb-6 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            className="rounded-xl border border-border p-4"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.hint}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bookings panel */}
      <motion.div variants={item} className="rounded-xl border border-border">
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
              <motion.tbody variants={container} className="divide-y divide-border">
                {visibleBookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    variants={item}
                    className="hover:bg-muted/40"
                  >
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
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </motion.div>

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
    </motion.div>
  );
}
