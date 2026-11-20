import Link from "next/link";
import type { Service } from "@/lib/API/service";
import { Button } from "@/components/ui/button";

// Shows a small summary of the services the technician added.
type ServicesSummaryProps = {
  services: Service[];
};

export default function ServicesSummary({ services }: ServicesSummaryProps) {
  // Count the services for each small card.
  const totalServices = services.length;
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved",
  ).length;
  const waitingServices = services.filter(
    (service) => service.approvalStatus !== "approved",
  ).length;
  const availableServices = services.filter(
    (service) => service.isAvailable,
  ).length;

  const summaryCards = [
    { label: "Total services", value: totalServices },
    { label: "Approved", value: approvedServices },
    { label: "Waiting for approval", value: waitingServices },
    { label: "Available now", value: availableServices },
  ];

  return (
    <div className="rounded-xl border border-border">
      {/* Panel header with a link to the full services list */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-lg font-semibold">Services summary</h2>
          <p className="text-sm text-muted-foreground">
            How your services are doing.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard/technician/services" />}
        >
          View all
        </Button>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border p-3">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
