import Link from "next/link";
import { Button } from "@/components/ui/button";

// Shows a warning when new repair requests are waiting.
type NewRequestsBannerProps = {
  count: number;
};

export default function NewRequestsBanner({ count }: NewRequestsBannerProps) {
  // Nothing to show when there are no new requests.
  if (count === 0) {
    return null;
  }

  // "request" stays singular when the count is 1.
  const requestWord = count === 1 ? "request" : "requests";

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-amber-800">
          You have {count} new {requestWord}
        </p>
        <p className="text-sm text-amber-700">
          Accept a request to start planning the work.
        </p>
      </div>

      <Button render={<Link href="/dashboard/technician/requests" />}>
        View requests
      </Button>
    </div>
  );
}
