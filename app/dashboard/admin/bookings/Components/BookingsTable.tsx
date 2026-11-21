"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Booking } from "@/lib/API/service";
import {
  STATUS_MAP,
  formatDate,
} from "@/app/dashboard/customer/rootComponents/bookingDisplay";

import BookingDetailsDialog from "./BookingDetailsDialog";

// How many bookings are shown on one page.
const BOOKINGS_PER_PAGE = 10;

// The client part of the page: search, filters, table and pagination.
type BookingsTableProps = {
  bookings: Booking[];
};

export default function BookingsTable({ bookings }: BookingsTableProps) {
  // The search text, the filters and the page we are on.
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // The booking shown in the details dialog.
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  // A new payment filter also starts again from page 1.
  const handlePaymentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPaymentFilter(event.target.value);
    setCurrentPage(1);
  };

  // The five status choices come from the shared STATUS_MAP.
  const statusOptions = Object.entries(STATUS_MAP).map(([value, info]) => ({
    value,
    label: info.label,
  }));

  // Keep the bookings that match the search text and both filters.
  const filteredBookings = bookings.filter((booking) => {
    const serviceName = booking.serviceName ?? "";
    const customerName = booking.customerName ?? "";
    const customerEmail = booking.customerEmail ?? "";
    const technicianName = booking.technicianName ?? "";
    const technicianEmail = booking.technicianEmail ?? "";
    const search = searchText.toLowerCase();

    const matchesSearch =
      serviceName.toLowerCase().includes(search) ||
      customerName.toLowerCase().includes(search) ||
      customerEmail.toLowerCase().includes(search) ||
      technicianName.toLowerCase().includes(search) ||
      technicianEmail.toLowerCase().includes(search);
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Work out which bookings belong on the current page.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const visibleBookings = filteredBookings.slice(
    startIndex,
    startIndex + BOOKINGS_PER_PAGE,
  );

  // These flags pick which message is shown instead of the table.
  const showEmptyList = bookings.length === 0;
  const showNoMatch = bookings.length > 0 && filteredBookings.length === 0;
  const showTable = filteredBookings.length > 0;

  return (
    <div className="rounded-xl border border-border">
      {/* Toolbar with the search box and the filters */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            aria-label="Search bookings"
            placeholder="Search by service, customer or technician"
            value={searchText}
            onChange={handleSearchChange}
            className="h-9 w-full sm:w-64"
          />

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by payment"
            value={paymentFilter}
            onChange={handlePaymentChange}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* How many bookings match the search and filters */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      </div>

      {showEmptyList && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings yet
        </p>
      )}

      {showNoMatch && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No bookings match your filters
        </p>
      )}

      {showTable && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Preferred date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-muted/40">
                  {/* Small image, name and category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {booking.image ? (
                        <Image
                          src={booking.image}
                          alt={booking.serviceName}
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
                        <p className="font-medium">
                          {booking.serviceName || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.category || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Customer name and email */}
                  <td className="px-4 py-3">
                    <p>{booking.customerName || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerEmail || "-"}
                    </p>
                  </td>

                  {/* Technician name and email */}
                  <td className="px-4 py-3">
                    <p>{booking.technicianName || "-"}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.technicianEmail || "-"}
                    </p>
                  </td>

                  {/* Preferred date */}
                  <td className="px-4 py-3">
                    {formatDate(booking.preferredDate)}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_MAP[booking.status].color}`}
                    >
                      {STATUS_MAP[booking.status].label}
                    </span>
                  </td>

                  {/* Amount in taka */}
                  <td className="px-4 py-3 font-medium">
                    ৳{booking.amount}
                  </td>

                  {/* Payment badge */}
                  <td className="px-4 py-3">
                    {booking.paymentStatus === "paid" ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Unpaid
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
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

      {/* Details dialog for the selected booking */}
      <BookingDetailsDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
