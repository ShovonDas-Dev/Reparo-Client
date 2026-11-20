import type { Booking } from "@/lib/API/service";

// Every status has a short label and a colour for the badge.
export const STATUS_MAP: Record<Booking["status"], { label: string; color: string }> =
  {
    pending: { label: "Requested", color: "bg-blue-100 text-blue-700" },
    confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-700" },
    in_progress: { label: "In progress", color: "bg-amber-100 text-amber-700" },
    completed: { label: "Completed", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

// Turn "2026-11-20" into "20 Nov 2026".
export const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};
