import { getAdminBookings, type Booking } from "@/lib/API/service";

import BookingStatCards from "./rootComponents/BookingStatCards";
import BookingsTable from "./rootComponents/BookingsTable";

export default async function AdminBookingsPage() {
  // Load every booking from the backend.
  let bookings: Booking[] = [];
  let error = "";

  try {
    bookings = await getAdminBookings();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "We could not load the bookings right now. Please try again later.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Every booking on Reparo, across all customers.
        </p>
      </div>

      {/* Friendly error message when the bookings cannot be loaded */}
      {error !== "" && (
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
      )}

      {/* The cards and the table only show when the bookings loaded */}
      {error === "" && (
        <>
          <BookingStatCards bookings={bookings} />

          <BookingsTable bookings={bookings} />
        </>
      )}
    </div>
  );
}
