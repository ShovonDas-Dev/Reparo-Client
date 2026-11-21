import type { Booking } from "@/lib/API/service";

// Shows the booking counts and revenue at the top of the page.
type BookingStatCardsProps = {
  bookings: Booking[];
};

export default function BookingStatCards({ bookings }: BookingStatCardsProps) {
  // Count the bookings for each card.
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" || booking.status === "in_progress",
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  // Completed bookings that still need to be paid.
  const awaitingPayment = bookings.filter(
    (booking) =>
      booking.status === "completed" && booking.paymentStatus === "unpaid",
  ).length;

  // Add up the amounts of the bookings that are already paid.
  const paidRevenue = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + booking.amount, 0);

  const statCards = [
    { label: "Total bookings", value: totalBookings },
    { label: "Active", value: activeBookings },
    { label: "Completed", value: completedBookings },
    { label: "Cancelled", value: cancelledBookings },
    { label: "Awaiting payment", value: awaitingPayment },
    { label: "Paid revenue", value: `৳${paidRevenue.toLocaleString()}` },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
