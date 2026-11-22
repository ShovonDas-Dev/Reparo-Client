"use client";

import { useState, type ChangeEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminPayment } from "@/lib/API/service";
import { formatDate } from "@/app/dashboard/customer/rootComponents/bookingDisplay";

import TransactionDetailsDialog from "./TransactionDetailsDialog";

// How many transactions are shown on one page.
const TRANSACTIONS_PER_PAGE = 10;

// Rows follow the page reveal with their own stagger.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// The client part of the page: search, table and pagination.
type TransactionsTableProps = {
  payments: AdminPayment[];
};

export default function TransactionsTable({ payments }: TransactionsTableProps) {
  // The search text, the page we are on and the selected payment.
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
    null,
  );

  // A new search always starts again from page 1.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  // Keep the payments that match the search text.
  const filteredPayments = payments.filter((payment) => {
    const transactionId = payment.transactionId ?? "";
    const serviceName = payment.serviceName ?? "";
    const customerName = payment.customerName ?? "";
    const customerEmail = payment.customerEmail ?? "";
    const technicianName = payment.technicianName ?? "";
    const technicianEmail = payment.technicianEmail ?? "";
    const search = searchText.toLowerCase();

    return (
      transactionId.toLowerCase().includes(search) ||
      serviceName.toLowerCase().includes(search) ||
      customerName.toLowerCase().includes(search) ||
      customerEmail.toLowerCase().includes(search) ||
      technicianName.toLowerCase().includes(search) ||
      technicianEmail.toLowerCase().includes(search)
    );
  });

  // Work out which payments belong on the current page.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / TRANSACTIONS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visiblePayments = filteredPayments.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE,
  );

  // These flags pick which message is shown instead of the table.
  const showEmptyList = payments.length === 0;
  const showNoMatch = payments.length > 0 && filteredPayments.length === 0;
  const showTable = filteredPayments.length > 0;

  return (
    <div className="rounded-xl border border-border">
      {/* Toolbar with the search box */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          aria-label="Search transactions"
          placeholder="Search by transaction, service or person"
          value={searchText}
          onChange={handleSearchChange}
          className="h-9 w-full sm:w-64"
        />

        {/* How many payments match the search */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {payments.length} transactions
        </p>
      </div>

      {showEmptyList && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No transactions yet
        </p>
      )}

      {showNoMatch && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No transactions match your search
        </p>
      )}

      {showTable && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <motion.tbody variants={list} className="divide-y divide-border">
              {visiblePayments.map((payment) => (
                <motion.tr
                  key={payment._id}
                  variants={row}
                  onClick={() => setSelectedPayment(payment)}
                  className="cursor-pointer hover:bg-muted/40"
                >
                  {/* Paid date */}
                  <td className="px-4 py-3">{formatDate(payment.paidAt)}</td>

                  {/* Transaction ID in a small monospace font */}
                  <td className="px-4 py-3 font-mono text-xs">
                    {payment.transactionId || "-"}
                  </td>

                  {/* Service name */}
                  <td className="px-4 py-3 font-medium">
                    {payment.serviceName || "-"}
                  </td>

                  {/* Customer name and email */}
                  <td className="px-4 py-3">
                    <p>{payment.customerName || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.customerEmail || "-"}
                    </p>
                  </td>

                  {/* Technician name and email */}
                  <td className="px-4 py-3">
                    <p>{payment.technicianName || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.technicianEmail || "-"}
                    </p>
                  </td>

                  {/* Amount in taka, bold */}
                  <td className="px-4 py-3 font-semibold">
                    ৳{payment.amount}
                  </td>

                  {/* Method, first letter capital */}
                  <td className="px-4 py-3">
                    {payment.method
                      ? payment.method.charAt(0).toUpperCase() +
                        payment.method.slice(1)
                      : "-"}
                  </td>

                  {/* Green paid badge */}
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {payment.status
                        ? payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)
                        : "-"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Pagination footer */}
      {showTable && (
        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Details dialog for the selected payment */}
      <TransactionDetailsDialog
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
