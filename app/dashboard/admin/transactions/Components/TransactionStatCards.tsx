import type { AdminPayment } from "@/lib/API/service";

// Shows the revenue numbers at the top of the page.
type TransactionStatCardsProps = {
  payments: AdminPayment[];
};

export default function TransactionStatCards({
  payments,
}: TransactionStatCardsProps) {
  // Add up the amount of every payment.
  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  // How many payments there are in total.
  const totalTransactions = payments.length;

  // Only count the payments made in the current month and year.
  const now = new Date();
  const thisMonthPayments = payments.filter((payment) => {
    const paidDate = new Date(payment.paidAt);
    if (Number.isNaN(paidDate.getTime())) return false;
    return (
      paidDate.getMonth() === now.getMonth() &&
      paidDate.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthRevenue = thisMonthPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  // The average payment, rounded, or ৳0 when there are no payments.
  const averagePayment =
    totalTransactions === 0
      ? 0
      : Math.round(totalRevenue / totalTransactions);

  const statCards = [
    { label: "Total revenue", value: `৳${totalRevenue.toLocaleString()}` },
    { label: "Total transactions", value: totalTransactions },
    { label: "This month", value: `৳${thisMonthRevenue.toLocaleString()}` },
    { label: "Average payment", value: `৳${averagePayment.toLocaleString()}` },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
