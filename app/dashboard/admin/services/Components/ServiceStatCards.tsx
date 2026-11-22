import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { Service } from "@/lib/API/service";

// Shows the four service counts at the top of the page.
type ServiceStatCardsProps = {
  services: Service[];
};

// The cards follow the page reveal with their own stagger.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
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
    <motion.div
      variants={list}
      className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {statCards.map((card) => (
        <motion.div
          key={card.label}
          variants={cardVariants}
          className="rounded-xl border border-border p-4"
        >
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-3xl font-bold">{card.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
