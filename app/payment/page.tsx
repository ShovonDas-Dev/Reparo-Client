"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const booking = {
  service: "AC Repair & Servicing",
  technician: "Rakib Hasan",
  date: "20 Nov 2026",
  amount: 1500,
};

export default function PaymentPage() {
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    toast.info("Stripe checkout will be connected here soon.");
    setPaying(false);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-[-0.02em]">
          Complete your payment
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review your booking and pay securely to finish the request.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <CreditCard aria-hidden className="size-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-semibold">Payment method</h2>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="card-name" className="text-sm font-medium">
                Name on card
              </label>
              <Input id="card-name" placeholder="Full name" autoComplete="cc-name" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="card-number" className="text-sm font-medium">
                Card number
              </label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                autoComplete="cc-number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="card-expiry" className="text-sm font-medium">
                  Expiry
                </label>
                <Input
                  id="card-expiry"
                  placeholder="MM / YY"
                  autoComplete="cc-exp"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="card-cvc" className="text-sm font-medium">
                  CVC
                </label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            Card details are handled by Stripe. Nothing is charged on this page
            until checkout is connected.
          </p>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Order summary
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Service</span>
                <span className="text-right font-medium">{booking.service}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Technician</span>
                <span className="text-right font-medium">
                  {booking.technician}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Date</span>
                <span className="text-right font-medium">{booking.date}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <strong className="font-heading text-2xl font-bold">
                ৳{booking.amount.toLocaleString("en-US")}
              </strong>
            </div>

            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? "Redirecting..." : `Pay ৳${booking.amount}`}
            </Button>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              Secure payment powered by Stripe.
            </p>

            <p className="mt-4 border-t border-border pt-4 text-center text-sm text-muted-foreground">
              <Link
                href="/dashboard/customer/bookings"
                className="font-medium text-foreground underline underline-offset-2"
              >
                Back to bookings
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
