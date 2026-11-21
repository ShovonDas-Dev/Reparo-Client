"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminPayment } from "@/lib/API/service";

// Turn "2026-11-20T18:30:00Z" into "20 Nov 2026, 18:30".
const formatDateTime = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Shows all the details of one payment in a dialog.
type TransactionDetailsDialogProps = {
  payment: AdminPayment | null;
  onClose: () => void;
};

export default function TransactionDetailsDialog({
  payment,
  onClose,
}: TransactionDetailsDialogProps) {
  // Nothing to show while no payment is selected.
  if (!payment) {
    return null;
  }

  const details = [
    { label: "Transaction ID", value: payment.transactionId || "-" },
    { label: "Booking ID", value: payment.bookingId || "-" },
    { label: "Service", value: payment.serviceName || "-" },
    { label: "Customer", value: payment.customerName || "-" },
    { label: "Customer email", value: payment.customerEmail || "-" },
    { label: "Technician", value: payment.technicianName || "-" },
    { label: "Technician email", value: payment.technicianEmail || "-" },
    { label: "Amount", value: `৳${payment.amount}` },
    { label: "Currency", value: payment.currency || "-" },
    {
      label: "Method",
      value: payment.method
        ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1)
        : "-",
    },
    {
      label: "Status",
      value: payment.status
        ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1)
        : "-",
    },
    { label: "Paid date and time", value: formatDateTime(payment.paidAt) },
  ];

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction details</DialogTitle>
          <DialogDescription>
            Everything about this payment.
          </DialogDescription>
        </DialogHeader>

        {/* The rest of the details */}
        <div className="space-y-2 text-sm">
          {details.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-4"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-right font-medium break-all">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
