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
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your platform
        </p>
      </div>

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
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <RecentTransactions payments={payments} />
            <RecentBookings bookings={bookings} />
          </div>

          {/* Things that need the admin, and the booking counts */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <PendingActions bookings={bookings} services={services} />
            <BookingStatusSummary bookings={bookings} />
          </div>

          {/* Short cuts to the other admin pages */}
          <QuickLinks />
        </>
      )}
    </div>
  );
}
