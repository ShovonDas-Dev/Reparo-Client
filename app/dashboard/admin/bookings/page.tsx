import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import { getAdminBookings, type Booking } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import BookingStatCards from "./Components/BookingStatCards";
import BookingsTable from "./Components/BookingsTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

// The page reveal starts the cards and the table rows.
const page: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

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
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      {/* Page title */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Every booking on Reparo, across all customers.
        </p>
      </motion.div>

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
    </motion.div>
  );
}
