import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import {
  getAdminBookings,
  getAdminPayments,
  getAdminServices,
  getUsers,
  type AdminPayment,
  type Booking,
  type Service,
  type User,
} from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

import BookingStatusSummary from "./rootComponents/BookingStatusSummary";
import DashboardStatCards from "./rootComponents/DashboardStatCards";
import PendingActions from "./rootComponents/PendingActions";
import QuickLinks from "./rootComponents/QuickLinks";
import RecentBookings from "./rootComponents/RecentBookings";
import RecentTransactions from "./rootComponents/RecentTransactions";

// The admin overview page. It only loads data and puts the panels on screen.
// The page reveal starts the variant-driven panels (rows and cards).
const page: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default async function AdminDashboardPage() {
  // The real data from the backend. Everything starts empty.
  let payments: AdminPayment[] = [];
  let bookings: Booking[] = [];
  let users: User[] = [];
  let services: Service[] = [];
  let error = "";

  // Load the four lists at the same time so the page opens fast.
  try {
    // Get the JWT for this signed-in admin from Better Auth.
    const token = await getServerToken();

    const [paymentList, bookingList, userList, serviceList] =
      await Promise.all([
        getAdminPayments(token),
        getAdminBookings(token),
        getUsers(token),
        getAdminServices(token),
      ]);

    payments = paymentList;
    bookings = bookingList;
    users = userList;
    services = serviceList;
  } catch (err) {
    // One short, friendly message when something goes wrong.
    error =
      err instanceof Error
        ? err.message
        : "We could not load the dashboard right now. Please try again later.";
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
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your platform
        </p>
      </motion.div>

      {/* Friendly error message when the dashboard cannot be loaded */}
      {error !== "" && (
        <ErrorFallback
          title={error}
          message="We could not load the dashboard right now. Please try again later."
        />
      )}

      {/* The panels only show when everything loaded */}
      {error === "" && (
        <>
          {/* The six overview numbers */}
          <DashboardStatCards
            payments={payments}
            bookings={bookings}
            users={users}
          />

          {/* The two lists, side by side on big screens */}
          <motion.div
            variants={item}
            className="mb-6 grid gap-6 lg:grid-cols-2"
          >
            <RecentTransactions payments={payments} />
            <RecentBookings bookings={bookings} />
          </motion.div>

          {/* Things that need the admin, and the booking counts */}
          <motion.div
            variants={item}
            className="mb-6 grid gap-6 lg:grid-cols-2"
          >
            <PendingActions bookings={bookings} services={services} />
            <BookingStatusSummary bookings={bookings} />
          </motion.div>

          {/* Short cuts to the other admin pages */}
          <motion.div variants={item}>
            <QuickLinks />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
