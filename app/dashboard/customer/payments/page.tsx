"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import {
  getCustomerBookings,
  getCustomerPayments,
  type Booking,
  type Payment,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// One staggered reveal for the page, its cards and its table rows.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function CustomerPaymentsPage() {
  const { data: session, isPending } = useSession();
  const customerId = session?.user?.id;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerId) return;

    let active = true;

    // Keep the checked value in a simple variable for the async function.
    const customerMongoId = customerId;

    async function load() {
      try {
        // Get the JWT for this signed-in customer.
        const token = await getClientToken();

        const [paymentList, bookingList] = await Promise.all([
          getCustomerPayments(customerMongoId, token),
          getCustomerBookings(customerMongoId, token),
        ]);

        if (!active) return;
        setPayments(paymentList);
        setBookings(bookingList);
        setError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Could not load your payments.";
        setError(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [customerId]);

  const serviceName = (payment: Payment) =>
    bookings.find((booking) => booking._id === payment.bookingId)
      ?.serviceName ?? "Repair service";

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const showLoading = isPending || (loading && Boolean(customerId));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My payments</h1>
        <p className="text-sm text-muted-foreground">
          Every payment you made for a completed repair.
        </p>
      </motion.div>

      <motion.div variants={container} className="mb-6 grid gap-4 sm:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total paid</p>
          <p className="mt-1 text-3xl font-bold">
            ৳{totalPaid.toLocaleString("en-US")}
          </p>
        </motion.div>
        <motion.div variants={item} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Payments</p>
          <p className="mt-1 text-3xl font-bold">{payments.length}</p>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-border">
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-semibold">Payment history</h2>
          <p className="text-sm text-muted-foreground">
            Receipts for your completed jobs.
          </p>
        </div>

        {showLoading && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        )}

        {!isPending && !customerId && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Please sign in to see your payments.
          </p>
        )}

        {!isPending && customerId && !loading && error !== "" && (
          <p className="py-10 text-center text-sm text-destructive">{error}</p>
        )}

        {!isPending &&
          customerId &&
          !loading &&
          error === "" &&
          payments.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              You have no payments yet.
            </p>
          )}

        {!isPending &&
          customerId &&
          !loading &&
          error === "" &&
          payments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Transaction</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <motion.tbody variants={container} className="divide-y divide-border">
                  {payments.map((payment) => (
                    <motion.tr
                      key={payment._id}
                      variants={item}
                      className="hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        {formatDate(payment.paidAt)}
                      </td>
                      <td className="px-4 py-3">{serviceName(payment)}</td>
                      <td className="px-4 py-3 font-medium">
                        ৳{payment.amount.toLocaleString("en-US")}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {payment.transactionId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Paid
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
      </motion.div>
    </motion.div>
  );
}
