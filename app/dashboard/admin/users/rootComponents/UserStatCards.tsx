import type { User } from "@/lib/API/service";

// Shows the four user counts at the top of the page.
type UserStatCardsProps = {
  users: User[];
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
