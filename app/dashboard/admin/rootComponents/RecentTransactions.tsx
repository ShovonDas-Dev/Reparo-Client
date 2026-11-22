import Link from "next/link";
import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { AdminPayment } from "@/lib/API/service";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/dashboard/customer/rootComponents/bookingDisplay";

// The 5 newest payments on the dashboard.
type RecentTransactionsProps = {
  payments: AdminPayment[];
};

// The rows fade in one after another once the panel itself appears.
// There is no initial/animate here on purpose: the page's reveal wrapper
// starts this, so the rows follow the panel instead of running on their own.
// "framer-motion/client" works in a server component, so no "use client".
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
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
        <motion.div variants={list} className="divide-y divide-border">
          {recentPayments.map((payment) => (
            <motion.div
              key={payment._id}
              variants={row}
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}