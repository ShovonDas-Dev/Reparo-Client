"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { payBooking } from "@/lib/API/service";

type Status = "loading" | "success" | "failed";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";

  const [status, setStatus] = useState<Status>("loading");
  // Ref guard so StrictMode / re-renders never call payBooking twice.
  const ranRef = useRef(false);

  useEffect(() => {
    if (!sessionId || ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const res = await fetch(
          `/api/checkout_sessions/verify?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json().catch(() => null)) as {
          paid?: boolean;
          bookingId?: string;
        } | null;

        if (!res.ok || !data?.paid || !data.bookingId) {
          setStatus("failed");
          return;
        }

        // Stripe says paid — mark the booking paid on our backend.
        // The webhook does the same thing, so this is safe if it already ran.
        try {
          await payBooking(data.bookingId);
        } catch {
          // Already marked paid by the webhook — treat as success.
        }
        setStatus("success");
      } catch {
        setStatus("failed");
      }
    })();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Confirming your payment...
      </p>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Payment not completed
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was not confirmed. You can try again from your bookings.
        </p>
        <Button className="mt-6" render={<Link href="/dashboard/customer/bookings" />}>
          Back to bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold tracking-tight">
        Payment successful!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you — your booking has been marked as paid.
      </p>
      <Button className="mt-6" render={<Link href="/dashboard/customer/bookings" />}>
        Back to bookings
      </Button>
    </div>
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
