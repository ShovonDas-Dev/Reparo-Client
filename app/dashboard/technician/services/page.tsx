"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  deleteTechnicianService,
  getTechnicianServices,
  updateServiceAvailability,
  type Service,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";

// Every approval status has a short label and a colour.
const APPROVAL_MAP: Record<
  Service["approvalStatus"],
  { label: string; color: string }
> = {
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

// The choices of the filter dropdown: All, Approved, Pending, Rejected.
const filterOptions = [
  { value: "all", label: "All" },
  ...Object.entries(APPROVAL_MAP).map(([value, info]) => ({
    value,
    label: info.label,
  })),
];

export default function TechnicianServicesPage() {
  const { data: session, isPending } = useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");

  // The email of the logged in technician.
  const email = session?.user?.email;

  // Load the services of this technician from the backend.
  // The same function is used again after a change or a delete.
  const loadServices = () => {
    if (!email) return Promise.resolve();

    return getTechnicianServices(email)
      .then((data) => {
        setServices(data);
        setError("");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load the list as soon as we know who is logged in.
  useEffect(() => {
    if (!email) return;
    loadServices();
    // We only want a new load when the technician changes. The switch
    // and the delete button reload the list by hand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // Turn one service on or off, then load the list again.
  const handleToggle = async (service: Service) => {
    const newValue = !service.isAvailable;

    try {
      await updateServiceAvailability(service._id, newValue);
      toast.success(newValue ? "Service is now on." : "Service is now off.");
      await loadServices();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update the service.",
      );
    }
  };

  // Ask first, then delete the service and load the list again.
  const handleDelete = async (service: Service) => {
    if (!email) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );
    if (!confirmed) return;

    try {
      await deleteTechnicianService(service._id, email);
      toast.success("Service deleted.");
      await loadServices();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the service.",
      );
    }
  };

  // Only the services that match the chosen filter are shown.
  const visibleServices = services.filter(
    (service) =>
      approvalFilter === "all" || service.approvalStatus === approvalFilter,
  );

  // The 3 cards are counted from the real list.
  const totalServices = services.length;
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved",
  ).length;
  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending",
  ).length;

  const statCards = [
    { label: "Total services", value: totalServices, hint: "All your services" },
    {
      label: "Approved services",
      value: approvedServices,
      hint: "Available to customers",
    },
    {
      label: "Pending review",
      value: pendingServices,
      hint: "Waiting for admin review",
    },
  ];

  // Only one of these messages is shown above the table.
  const showLoading = isPending || (loading && Boolean(email));
  const showSignIn = !isPending && !email;
  const showError =
    !showLoading && !showSignIn && error !== "" && services.length === 0;
  const showEmpty =
    !showLoading && !showSignIn && !showError && services.length === 0;
  const showNoMatch =
    !showLoading &&
    !showSignIn &&
    !showError &&
    services.length > 0 &&
    visibleServices.length === 0;
  const showTable =
    !showLoading && !showSignIn && !showError && visibleServices.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title and the Add a service button */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Services</h1>
          <p className="text-sm text-muted-foreground">
            Keep track of your services in one place.
          </p>
        </div>

        <Button render={<Link href="/dashboard/technician/add-service" />}>
          Add a service
        </Button>
      </div>

      {/* The 3 cards are counted from the list */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* Services panel */}
      <div className="rounded-xl border border-border">
        {/* Panel header with the approval filter */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">My Services</h2>
            <p className="text-sm text-muted-foreground">
              Turn a service on or off, or delete it.
            </p>
          </div>

          <select
            aria-label="Filter by approval"
            value={approvalFilter}
            onChange={(event) => setApprovalFilter(event.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Loading, error and empty messages */}
        {showLoading && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        )}

        {showSignIn && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Please sign in to see your services.
          </p>
        )}

        {showError && (
          <p className="py-10 text-center text-sm text-destructive">{error}</p>
        )}

        {showEmpty && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              You have not added any service yet
            </p>
            <Button
              className="mt-4"
              render={<Link href="/dashboard/technician/add-service" />}
            >
              Add a service
            </Button>
          </div>
        )}

        {showNoMatch && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No services with this approval status.
          </p>
        )}

        {/* The table with the services */}
        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Base price</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Approval</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleServices.map((service) => (
                  <tr key={service._id} className="hover:bg-muted/40">
                    {/* Service image, title and the service mode below */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={40}
                            height={40}
                            // Images come from different hosts, so show as-is.
                            unoptimized
                            className="size-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-xs text-muted-foreground">
                            IMG
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{service.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {service.serviceMode}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">{service.category}</td>

                    {/* Base price */}
                    <td className="px-4 py-3 font-medium">
                      ৳{service.basePrice}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3">{service.estimatedDuration}</td>

                    {/* Approval badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${APPROVAL_MAP[service.approvalStatus].color}`}
                      >
                        {APPROVAL_MAP[service.approvalStatus].label}
                      </span>
                    </td>

                    {/* On / off switch (only approved services can be turned on) */}
                    <td className="px-4 py-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={service.isAvailable}
                          disabled={service.approvalStatus !== "approved"}
                          onChange={() => handleToggle(service)}
                          aria-label={`Turn ${service.title} on or off`}
                          className="size-4 cursor-pointer accent-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <span className="text-xs text-muted-foreground">
                          {service.isAvailable ? "On" : "Off"}
                        </span>
                      </label>
                    </td>

                    {/* Delete button */}
                    <td className="px-4 py-3">
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => handleDelete(service)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
