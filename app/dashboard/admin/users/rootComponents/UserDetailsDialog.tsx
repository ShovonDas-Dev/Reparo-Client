"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/API/service";

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

// The initials shown when a user has no picture.
const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Shows all the details of one user in a dialog.
type UserDetailsDialogProps = {
  user: User | null;
  onClose: () => void;
};

export default function UserDetailsDialog({
  user,
  onClose,
}: UserDetailsDialogProps) {
  // Nothing to show while no user is selected.
  if (!user) {
    return null;
  }

  const details = [
    { label: "Name", value: user.name || "-" },
    { label: "Email", value: user.email || "-" },
    { label: "Role", value: user.role || "-" },
    { label: "Email verified", value: user.emailVerified ? "Yes" : "No" },
    { label: "Joined", value: formatDate(user.createdAt) },
    { label: "User ID", value: user._id },
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
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>
            Everything about this account.
          </DialogDescription>
        </DialogHeader>

        {/* Avatar, name and email */}
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={48}
              height={48}
              unoptimized
              className="size-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {getInitials(user.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-medium">{user.name || "-"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email || "-"}
            </p>
          </div>
        </div>

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
