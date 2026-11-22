"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerBookings, type Booking } from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";
  const { data: session, isPending } = useSession();
  const customerId = session?.user?.id;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId || !bookingId) return;

    let active = true;

    // Keep the checked value in a simple variable for the async function.
    const customerMongoId = customerId;

    async function load() {
      try {
        // Get the JWT for this signed-in customer.
        const token = await getClientToken();
        const bookings = await getCustomerBookings(customerMongoId, token);

        if (!active) return;
        setBooking(bookings.find((item) => item._id === bookingId) ?? null);
      } catch {
        if (active) setBooking(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [customerId, bookingId]);

  const showLoading =
    isPending || (loading && Boolean(customerId) && Boolean(bookingId));

  if (showLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Confirming your payment...
      </p>
    );
  }

  if (!customerId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Please sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to see the status of your payment.
        </p>
        <Button className="mt-6" render={<Link href="/sign-in" />}>
          Sign in
        </Button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Booking not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not find this booking under your account.
        </p>
        <Button
          className="mt-6"
          render={<Link href="/dashboard/customer/bookings" />}
        >
          Back to bookings
        </Button>
      </div>
    );
  }

  if (booking.paymentStatus !== "paid") {
    return (
      <div className="text-center">
        <XCircle
          aria-hidden
          className="mx-auto size-12 text-red-500"
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          Payment not completed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was not confirmed. You can try again from your bookings.
        </p>
        <Button
          className="mt-6"
          render={<Link href="/dashboard/customer/bookings" />}
        >
          Back to bookings
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-center"
    >
      <CheckCircle2
        aria-hidden
        className="mx-auto size-12 text-green-500"
      />
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
        Payment successful!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you — your booking has been marked as paid.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {booking.serviceName} · ৳{booking.amount.toLocaleString("en-US")}
      </p>
      <Button
        className="mt-6"
        render={<Link href="/dashboard/customer/bookings" />}
      >
        Back to bookings
      </Button>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16">
      <Suspense
        fallback={
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
