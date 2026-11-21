import Link from "next/link";

// Short cuts to the admin pages that exist.
const quickLinks = [
  {
    label: "Users",
    href: "/dashboard/admin/users",
    hint: "Every account on Reparo",
  },
  {
    label: "Bookings",
    href: "/dashboard/admin/bookings",
    hint: "Every repair request",
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    hint: "Every payment made",
  },
  {
    label: "Services",
    href: "/dashboard/admin/services",
    hint: "Approve or reject services",
  },
];

// A small grid of links to the other admin pages.
export default function QuickLinks() {
  return (
    <div className="rounded-xl border border-border">
      {/* Panel header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Quick links</h2>
        <p className="text-sm text-muted-foreground">
          Jump to any admin page.
        </p>
      </div>

      {/* One link card per page */}
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border p-3 transition-colors hover:bg-accent"
          >
            <p className="font-medium">{link.label}</p>
            <p className="text-xs text-muted-foreground">{link.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
