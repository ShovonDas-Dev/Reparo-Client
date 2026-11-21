import type { AdminPayment, Booking, User } from "@/lib/API/service";

// The six overview numbers at the top of the dashboard.
type DashboardStatCardsProps = {
  payments: AdminPayment[];
  bookings: Booking[];
  users: User[];
};

export default function DashboardStatCards({
  payments,
  bookings,
  users,
}: DashboardStatCardsProps) {
  // Add up the amount of every payment.
  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  // Only count the payments made in the current month and year.
  const now = new Date();
  const thisMonthRevenue = payments
    .filter((payment) => {
      const paidDate = new Date(payment.paidAt);
      if (Number.isNaN(paidDate.getTime())) return false;
      return (
        paidDate.getMonth() === now.getMonth() &&
        paidDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  // How many customers and technicians signed up.
  const totalCustomers = users.filter(
    (user) => user.role === "customer",
  ).length;
  const totalTechnicians = users.filter(
    (user) => user.role === "technician",
  ).length;

  // How many bookings exist, and how many still wait for a technician.
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  // The six cards in the order the dashboard shows them.
  const statCards = [
    { label: "Total revenue", value: `৳${totalRevenue.toLocaleString()}` },
    {
      label: "This month revenue",
      value: `৳${thisMonthRevenue.toLocaleString()}`,
    },
    { label: "Total customers", value: totalCustomers },
    { label: "Total technicians", value: totalTechnicians },
    { label: "Total bookings", value: totalBookings },
    { label: "Pending bookings", value: pendingBookings },
  ];

  return (
    <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
