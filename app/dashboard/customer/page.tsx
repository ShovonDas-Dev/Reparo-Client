"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  getCustomerBookings,
  getCustomerPayments,
  type Booking,
  type Payment,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

import PaymentBanner from "./rootComponents/PaymentBanner";
import RecentBookings from "./rootComponents/RecentBookings";
import RecentPayments from "./rootComponents/RecentPayments";
import StatCard from "./rootComponents/StatCard";
import StatusSummary from "./rootComponents/StatusSummary";
import Spinner from "@/components/MyUI/Loading/Spinner";

// Pick the right greeting for the current local time.
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// The page and the stat cards share one staggered reveal.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function CustomerOverviewPage() {
  const { data: session, isPending } = useSession();

  // The MongoDB _id of the logged in customer.
  const customerId = session?.user?.id;

  // The greeting depends on the clock, so we read it after the page loads.
  const [greeting, setGreeting] = useState("");

  // The real data that comes from the backend.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Work out the greeting once the page is open in the browser.
  // The small timer keeps the clock out of the first build.
  useEffect(() => {
    const timer = setTimeout(() => {
      setGreeting(getGreeting());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Load the bookings and the payments of this customer.
  useEffect(() => {
    if (!customerId) return;

    // This flag stops us from saving data after the page is gone.
    let active = true;

    // Keep the checked value in a simple variable for the async function.
    const customerMongoId = customerId;

    async function load() {
      try {
        // Get the JWT for this signed-in customer.
        const token = await getClientToken();

        const [bookingList, paymentList] = await Promise.all([
          getCustomerBookings(customerMongoId, token),
          getCustomerPayments(customerMongoId, token),
        ]);

        if (!active) return;
        setBookings(bookingList);
        setPayments(paymentList);
        setError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [customerId]);

  // Count the numbers shown on the stat cards.
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" || booking.status === "in_progress",
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;
  const unpaidCompleted = bookings.filter(
    (booking) =>
      booking.status === "completed" && booking.paymentStatus === "unpaid",
  ).length;
  const totalPaid = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  // Only one of these messages is shown on the page.
  const showLoading = isPending || (loading && Boolean(customerId));
  const showSignIn = !isPending && !customerId;
  const showError =
    !showLoading && !showSignIn && error !== "" && bookings.length === 0;
  const showEmpty =
    !showLoading && !showSignIn && !showError && bookings.length === 0;
  const showContent =
    !showLoading && !showSignIn && !showError && bookings.length > 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      {/* Greeting with the real name of the signed in customer */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting && session?.user?.name
            ? `${greeting}, ${session.user.name}`
            : session?.user?.name || "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is what is happening with your repairs.
        </p>
      </motion.div>

      {showLoading && (
        <div className="flex justify-center align-middle">
                  <Spinner/>
                </div>
      )}

      {showSignIn && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Please sign in to see your overview.
        </p>
      )}

      {showError && (
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
      )}

      {showEmpty && (
        <div className="rounded-xl border border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            You have no bookings yet
          </p>
          <Button className="mt-4" render={<Link href="/services" />}>
            Browse services
          </Button>
        </div>
      )}

      {showContent && (
        <>
          {/* Warning when completed jobs are still unpaid */}
          <PaymentBanner count={unpaidCompleted} />

          {/* The 5 cards are counted from the real bookings and payments */}
          <motion.div
            variants={container}
            className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <StatCard
              label="Total bookings"
              value={totalBookings}
              hint="All your requests"
            />
            <StatCard
              label="Active jobs"
              value={activeBookings}
              hint="Confirmed or in progress"
            />
            <StatCard
              label="Completed jobs"
              value={completedBookings}
              hint="Work that is done"
            />
            <StatCard
              label="Pending payment"
              value={unpaidCompleted}
              hint="Completed and unpaid"
            />
            <StatCard
              label="Total paid"
              value={`৳${totalPaid.toLocaleString("en-US")}`}
              hint="All your payments"
            />
          </motion.div>

          {/* Count of each of the 5 statuses */}
          <div className="mb-6">
            <StatusSummary bookings={bookings} />
          </div>

          {/* Latest bookings and payments side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentBookings bookings={bookings} />
            <RecentPayments payments={payments} bookings={bookings} />
          </div>
        </>
      )}
    </motion.div>
  );
}
