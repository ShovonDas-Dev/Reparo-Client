import type { Service } from "@/lib/API/service";

// Shows the four service counts at the top of the page.
type ServiceStatCardsProps = {
  services: Service[];
};

export default function ServiceStatCards({ services }: ServiceStatCardsProps) {
  // Count the services for each card.
  const totalServices = services.length;
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved",
  ).length;
  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending",
  ).length;
  const rejectedServices = services.filter(
    (service) => service.approvalStatus === "rejected",
  ).length;

  const statCards = [
    { label: "Total services", value: totalServices },
    { label: "Approved", value: approvedServices },
    { label: "Waiting for approval", value: pendingServices },
    { label: "Rejected", value: rejectedServices },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
