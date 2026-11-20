"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Booking details come from the URL (?bookingId=...&amount=...&service=...),
// with demo fallbacks so the page works on its own.
function PaymentContent async({ searchParams }) {
  const searchParams = useSearchParams();

   const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }
  const bookingId = searchParams.get("bookingId") ?? "";
  const service = searchParams.get("service") ?? "Repair service";
  const amount = searchParams.get("amount") ?? "1500";

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  // TODO: replace with a call to the Stripe Checkout session API.
  const handlePay = async () => {
    setProcessing(true);
    try {
      // Simulated redirect to Stripe Checkout for now.
      toast.info("Stripe Checkout will be connected here.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
        <p className="text-sm text-muted-foreground">
          Review your booking details and pay securely.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Payment information */}
        <div className="rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">Payment details</h2>

          <div className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="card-number"
                className="text-sm text-muted-foreground"
              >
                Card number
              </label>
              <div className="relative mt-1">
                <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="expiry" className="text-sm text-muted-foreground">
                  Expiry
                </label>
                <Input
                  id="expiry"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(event) => setExpiry(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="text-sm text-muted-foreground">
                  CVC
                </label>
                <Input
                  id="cvc"
                  placeholder="123"
                  inputMode="numeric"
                  value={cvc}
                  onChange={(event) => setCvc(event.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Your card details are handled by Stripe. We never store them.
          </p>
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Service</span>
              <span className="text-right font-medium">{service}</span>
            </div>
            {bookingId && (
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="text-right font-medium">{bookingId}</span>
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-right font-medium">৳{amount}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-border pt-2">
              <span className="font-medium">Total</span>
              <span className="text-right text-lg font-bold">৳{amount}</span>
            </div>
          </div>

          <Button
            className="mt-4 w-full"
            size="lg"
            disabled={processing}
            onClick={handlePay}
          >
            {processing ? "Redirecting..." : `Pay ৳${amount}`}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Secured by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <p className="py-10 text-center text-sm text-muted-foreground">
          Loading...
        </p>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
