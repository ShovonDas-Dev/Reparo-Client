import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import type { User } from "@/lib/API/service";

// Shows the four user counts at the top of the page.
type UserStatCardsProps = {
  users: User[];
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

export default function UserStatCards({ users }: UserStatCardsProps) {
  // Count the users for each card.
  const totalUsers = users.length;
  const customers = users.filter((user) => user.role === "customer").length;
  const technicians = users.filter((user) => user.role === "technician").length;
  const admins = users.filter((user) => user.role === "admin").length;

  const statCards = [
    { label: "Total users", value: totalUsers },
    { label: "Customers", value: customers },
    { label: "Technicians", value: technicians },
    { label: "Admins", value: admins },
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
