import Link from "next/link";
import { Button } from "@/components/ui/button";

// Shows a warning when completed jobs are still waiting for payment.
type PaymentBannerProps = {
  count: number;
};

export default function PaymentBanner({ count }: PaymentBannerProps) {
  // Nothing to show when every completed job is already paid.
  if (count === 0) {
    return null;
  }

  // "job" stays singular when the count is 1.
  const jobWord = count === 1 ? "job" : "jobs";

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-amber-800">
          You have {count} {jobWord} waiting for payment
        </p>
        <p className="text-sm text-amber-700">
          Pay for a completed job to close it out.
        </p>
      </div>

      <Button render={<Link href="/dashboard/customer/bookings" />}>
        Go to bookings
      </Button>
    </div>
  );
}
