"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Booking } from "@/lib/API/service";

interface AlartDeleteBtnProps {
  booking: Booking;
  onConfirm: (booking: Booking) => Promise<void>;
}

export default function AlartDeleteBtn({
  booking,
  onConfirm,
}: AlartDeleteBtnProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await onConfirm(booking);

      // API Success হলে Dialog Close হবে
      setOpen(false);
    } catch (error) {
      // Error হলে Dialog Open থাকবে
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          disabled={booking.status !== "pending" || loading}
        >
          Cancel
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to cancel this booking?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            No, Keep Booking
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Cancelling..." : "Yes, Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}