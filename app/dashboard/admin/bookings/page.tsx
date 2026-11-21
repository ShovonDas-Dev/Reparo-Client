import { getAdminBookings, type Booking } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import BookingStatCards from "./Components/BookingStatCards";
import BookingsTable from "./Components/BookingsTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

export default async function AdminBookingsPage() {
  // Load every booking from the backend.
  let bookings: Booking[] = [];
  let error = "";

  try {
    // Get the JWT for this signed-in admin from Better Auth.
    const token = await getServerToken();
    bookings = await getAdminBookings(token);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
       
        :  error = "We could not load the bookings right now. Please try again later.";
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
        <ErrorFallback
          title={error}
          message="Something went wrong while loading Services."
        />
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
