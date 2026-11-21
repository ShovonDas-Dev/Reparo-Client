"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCustomerBookings,
  payBooking,
  type Booking,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const customerId = session?.user?.id;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

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
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load booking.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [customerId, bookingId]);

  const handlePay = async () => {
    if (!booking || !customerId) return;

    setPaying(true);
    try {
      // Simulate the round-trip to Stripe Checkout before confirming.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Get the JWT for this signed-in customer.
      const token = await getClientToken();
      await payBooking(booking._id, customerId, token);
      router.push(`/success?bookingId=${encodeURIComponent(booking._id)}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment failed. Please try again.",
      );
      setPaying(false);
    }
  };

  const showLoading =
    isPending || (loading && Boolean(customerId) && Boolean(bookingId));

  if (showLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!customerId) {
    return (
      <MessageCard
        title="Please sign in"
        text="You need to be signed in to pay for a booking."
      />
    );
  }

  if (error) {
    return <MessageCard title="Something went wrong" text={error} />;
  }

  if (!booking) {
    return (
      <MessageCard
        title="Booking not found"
        text="This booking does not exist or does not belong to you."
      />
    );
  }

  if (booking.paymentStatus === "paid") {
    return (
      <MessageCard
        title="Already paid"
        text="This booking has already been paid. No further action is needed."
      />
    );
  }

  if (booking.status !== "completed") {
    return (
      <MessageCard
        title="Not ready to pay"
        text="You can pay once the technician marks this repair as completed."
      />
    );
  }

  const amount = booking.amount.toLocaleString("en-US");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="bg-slate-50 px-6 py-10 text-slate-900 dark:bg-muted/30 dark:text-foreground lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back
          </Link>

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Test mode
          </span>

          <p className="mt-8 text-sm font-medium text-slate-500 dark:text-muted-foreground">
            Reparo
          </p>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-[-0.02em]">
            Pay Repair Service
          </h1>

          <p className="mt-6 font-heading text-4xl font-bold tracking-[-0.02em]">
            ৳{amount}
          </p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-border dark:bg-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-muted dark:text-muted-foreground">
                  <CreditCard aria-hidden className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium">{booking.serviceName}</p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">
                    {booking.technicianName} · {booking.category}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium">৳{amount}</span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-border">
              <span className="font-medium">Total due</span>
              <span className="font-bold">৳{amount}</span>
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 text-xs text-slate-500 dark:text-muted-foreground">
            <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            This is a simulated Stripe Checkout for the demo. No real card is
            charged.
          </p>
        </div>
      </section>

      <section className="flex items-center bg-background px-6 py-10 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-md">
          <h2 className="font-heading text-xl font-semibold">Pay with card</h2>

          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
            Demo card: <b>4242 4242 4242 4242</b> · any future expiry · any CVC
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email ?? ""}
                readOnly
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="card-number" className="text-sm font-medium">
                Card number
              </label>
              <Input
                id="card-number"
                defaultValue="4242 4242 4242 4242"
                readOnly
                className="bg-muted/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="card-expiry" className="text-sm font-medium">
                  Expiry
                </label>
                <Input
                  id="card-expiry"
                  defaultValue="12 / 30"
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="card-cvc" className="text-sm font-medium">
                  CVC
                </label>
                <Input
                  id="card-cvc"
                  defaultValue="123"
                  readOnly
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="card-name" className="text-sm font-medium">
                Name on card
              </label>
              <Input
                id="card-name"
                defaultValue={booking.customerName}
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>

          <Button
            size="lg"
            onClick={handlePay}
            disabled={paying}
            className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {paying ? "Processing..." : `Pay ৳${amount}`}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Powered by Stripe (simulated)
          </p>
        </div>
      </section>
    </div>
  );
}

function MessageCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-heading text-2xl font-bold tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        <Button
          className="mt-6"
          render={<Link href="/dashboard/customer/bookings" />}
        >
          Back to bookings
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center">
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
