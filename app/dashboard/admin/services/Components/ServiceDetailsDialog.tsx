"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Service } from "@/lib/API/service";

// Turn "2026-11-20T..." into "20 Nov 2026".
const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Shows all the details of one service in a dialog.
type ServiceDetailsDialogProps = {
  service: Service | null;
  onClose: () => void;
};

export default function ServiceDetailsDialog({
  service,
  onClose,
}: ServiceDetailsDialogProps) {
  // Nothing to show while no service is selected.
  if (!service) {
    return null;
  }

  const details = [
    { label: "Category", value: service.category || "-" },
    { label: "Description", value: service.description || "-" },
    { label: "Price", value: `৳${service.basePrice}` },
    { label: "Estimated duration", value: service.estimatedDuration || "-" },
    { label: "Mode", value: service.serviceMode || "-" },
    { label: "Service area", value: service.serviceArea || "-" },
    { label: "Technician", value: service.technicianName || "-" },
    { label: "Technician email", value: service.technicianEmail || "-" },
    {
      label: "Availability",
      value: service.isAvailable ? "Available" : "Unavailable",
    },
    { label: "Approval status", value: service.approvalStatus || "-" },
    { label: "Posted", value: formatDate(service.postedAt) },
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
          <DialogTitle>Service details</DialogTitle>
          <DialogDescription>
            Everything about this service.
          </DialogDescription>
        </DialogHeader>

        {/* Service image */}
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
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

        {/* Title */}
        <p className="text-base font-semibold">{service.title || "-"}</p>

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
