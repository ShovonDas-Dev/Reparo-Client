"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Service } from "@/lib/API/service";

import ApprovalSelect from "./ApprovalSelect";
import ServiceDetailsDialog from "./ServiceDetailsDialog";

// How many services are shown on one page.
const SERVICES_PER_PAGE = 10;

// Rows follow the page reveal with their own stagger.
const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// The client part of the page: banner, search, filters, table and pagination.
type ServicesTableProps = {
  services: Service[];
};

export default function ServicesTable({ services }: ServicesTableProps) {
  // The search text, the filters and the page we are on.
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // The service shown in the details dialog.
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // A new search always starts again from page 1.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  // A new status filter also starts again from page 1.
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // A new category filter also starts again from page 1.
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  // Clicking the pending banner filters the table down to pending services.
  const handleShowPending = () => {
    setStatusFilter("pending");
    setCurrentPage(1);
  };

  // The categories come from the data, without duplicates.
  const categories: string[] = [];
  services.forEach((service) => {
    if (service.category && !categories.includes(service.category)) {
      categories.push(service.category);
    }
  });

  // How many services are waiting for approval right now.
  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending",
  ).length;

  // Keep the services that match the search text and both filters.
  const filteredServices = services.filter((service) => {
    const title = service.title ?? "";
    const name = service.technicianName ?? "";
    const email = service.technicianEmail ?? "";
    const search = searchText.toLowerCase();

    const matchesSearch =
      title.toLowerCase().includes(search) ||
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search);
    const matchesStatus =
      statusFilter === "all" || service.approvalStatus === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Work out which services belong on the current page.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / SERVICES_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const visibleServices = filteredServices.slice(
    startIndex,
    startIndex + SERVICES_PER_PAGE,
  );

  // These flags pick which message is shown instead of the table.
  const showEmptyList = services.length === 0;
  const showNoMatch = services.length > 0 && filteredServices.length === 0;
  const showTable = filteredServices.length > 0;

  return (
    <div className="rounded-xl border border-border">
      {/* Highlighted banner while services are waiting for approval */}
      {pendingCount > 0 && (
        <button
          type="button"
          onClick={handleShowPending}
          className="w-full border-b border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm font-medium text-amber-800 hover:bg-amber-100"
        >
          {pendingCount} service(s) waiting for your approval
        </button>
      )}

      {/* Toolbar with the search box and the filters */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            aria-label="Search services"
            placeholder="Search by title or technician"
            value={searchText}
            onChange={handleSearchChange}
            className="h-9 w-full sm:w-64"
          />

          <select
            aria-label="Filter by approval status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* How many services match the search and filters */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredServices.length} of {services.length} services
        </p>
      </div>

      {showEmptyList && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No services found
        </p>
      )}

      {showNoMatch && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No services match your filters
        </p>
      )}

      {showTable && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Availability</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={list} className="divide-y divide-border">
              {visibleServices.map((service) => (
                <motion.tr
                  key={service._id}
                  variants={row}
                  className="hover:bg-muted/40"
                >
                  {/* Small image, title and category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={36}
                          height={36}
                          unoptimized
                          className="size-9 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
                          IMG
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium">{service.title || "-"}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.category || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Technician name and email */}
                  <td className="px-4 py-3">
                    <p>{service.technicianName || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.technicianEmail || "-"}
                    </p>
                  </td>

                  {/* Price in taka */}
                  <td className="px-4 py-3">৳{service.basePrice}</td>

                  {/* Service mode */}
                  <td className="px-4 py-3">{service.serviceMode || "-"}</td>

                  {/* Availability badge */}
                  <td className="px-4 py-3">
                    {service.isAvailable ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Unavailable
                      </span>
                    )}
                  </td>

                  {/* Approval dropdown that saves straight away */}
                  <td className="px-4 py-3">
                    <ApprovalSelect
                      serviceId={service._id}
                      currentStatus={service.approvalStatus}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedService(service)}
                    >
                      View details
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Pagination footer */}
      {showTable && (
        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Details dialog for the selected service */}
      <ServiceDetailsDialog
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
