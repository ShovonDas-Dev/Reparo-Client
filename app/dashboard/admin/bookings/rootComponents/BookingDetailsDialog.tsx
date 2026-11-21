"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Booking } from "@/lib/API/service";
import {
  STATUS_MAP,
  formatDate,
} from "@/app/dashboard/customer/rootComponents/bookingDisplay";

// Shows all the details of one booking in a dialog.
type BookingDetailsDialogProps = {
  booking: Booking | null;
  onClose: () => void;
};

export default function BookingDetailsDialog({
  booking,
  onClose,
}: BookingDetailsDialogProps) {
  // Nothing to show while no booking is selected.
  if (!booking) {
    return null;
  }

  const details = [
    { label: "Service", value: booking.serviceName || "-" },
    { label: "Category", value: booking.category || "-" },
    { label: "Customer", value: booking.customerName || "-" },
    { label: "Customer email", value: booking.customerEmail || "-" },
    { label: "Phone", value: booking.phone || "-" },
    { label: "Address", value: booking.address || "-" },
    { label: "Technician", value: booking.technicianName || "-" },
    { label: "Technician email", value: booking.technicianEmail || "-" },
    { label: "Preferred date", value: formatDate(booking.preferredDate) },
    { label: "Issue", value: booking.issueDescription || "-" },
    { label: "Amount", value: `৳${booking.amount}` },
    { label: "Status", value: STATUS_MAP[booking.status].label },
    {
      label: "Payment",
      value: booking.paymentStatus === "paid" ? "Paid" : "Unpaid",
    },
    { label: "Paid date", value: booking.paidAt ? formatDate(booking.paidAt) : "-" },
    { label: "Booked on", value: formatDate(booking.createdAt) },
    { label: "Booking ID", value: booking._id },
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
          <DialogTitle>Booking details</DialogTitle>
          <DialogDescription>
            Everything about this booking.
          </DialogDescription>
        </DialogHeader>

        {/* Service image */}
        {booking.image ? (
          <Image
            src={booking.image}
            alt={booking.serviceName}
            width={480}
            height={240}
            unoptimized
            className="h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <span className="grid h-40 w-full place-items-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
            IMG
          </span>
        )}

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
