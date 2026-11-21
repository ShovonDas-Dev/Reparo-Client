import Link from "next/link";
import type { AdminPayment } from "@/lib/API/service";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/dashboard/customer/rootComponents/bookingDisplay";

// The 5 newest payments on the dashboard.
type RecentTransactionsProps = {
  payments: AdminPayment[];
};

export default function RecentTransactions({
  payments,
}: RecentTransactionsProps) {
  // Sort the newest payments first, then keep only 5.
  const recentPayments = [...payments]
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border">
      {/* Panel header with a link to the full list */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          <p className="text-sm text-muted-foreground">
            The latest payments on Reparo.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/admin/transactions" />}
        >
          View all
        </Button>
      </div>

      {/* Empty text when there are no payments yet */}
      {recentPayments.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No transactions yet
        </p>
      )}

      {/* One row per payment: service, customer, date and amount */}
      {recentPayments.length > 0 && (
        <div className="divide-y divide-border">
          {recentPayments.map((payment) => (
            <div
              key={payment._id}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{payment.serviceName}</p>
                <p className="text-xs text-muted-foreground">
                  {payment.customerName} · {formatDate(payment.paidAt)}
                </p>
              </div>

              <span className="text-sm font-medium">
                ৳{payment.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
