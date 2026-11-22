"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  getTechnicianBookings,
  getTechnicianPayments,
  getTechnicianServices,
  type Booking,
  type Payment,
  type Service,
} from "@/lib/API/service";
import { useSession } from "@/lib/auth-client";
import { getClientToken } from "@/lib/getClientToken";

import NewRequestsBanner from "./rootComponents/NewRequestsBanner";
import RecentBookings from "./rootComponents/RecentBookings";
import RecentPayments from "./rootComponents/RecentPayments";
import ServicesSummary from "./rootComponents/ServicesSummary";
import StatCard from "./rootComponents/StatCard";
import Spinner from "@/components/MyUI/Loading/Spinner";
import { div } from "motion/react-client";

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

export default function TechnicianOverviewPage() {
  const { data: session, isPending } = useSession();

  // The identity of the logged in technician.
  const email = session?.user?.email;
  const technicianId = session?.user?.id;

  // The greeting depends on the clock, so we read it after the page loads.
  const [greeting, setGreeting] = useState("");

  // The real data that comes from the backend.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
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

  // Load the bookings, services and payments of this technician.
  useEffect(() => {
    if (!email || !technicianId) return;

    // This flag stops us from saving data after the page is gone.
    let active = true;

    // Keep the checked values in simple variables for the async function.
    const technicianEmail = email;
    const technicianMongoId = technicianId;

    async function load() {
      try {
        // Get the JWT for this signed-in technician.
        const token = await getClientToken();

        const [bookingList, serviceList, paymentList] = await Promise.all([
          getTechnicianBookings(technicianEmail, token),
          getTechnicianServices(technicianEmail, token),
          getTechnicianPayments(technicianMongoId, token),
        ]);

        if (!active) return;
        setBookings(bookingList);
        setServices(serviceList);
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
  }, [email, technicianId]);

  // Count the numbers shown on the stat cards.
  const totalJobs = bookings.length;
  const newRequests = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const activeJobs = bookings.filter(
    (booking) =>
      booking.status === "confirmed" || booking.status === "in_progress",
  ).length;
  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;
  const awaitingPayment = bookings.filter(
    (booking) =>
      booking.status === "completed" && booking.paymentStatus === "unpaid",
  ).length;
  const totalEarnings = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  // Only one of these messages is shown on the page.
  const showLoading = isPending || (loading && Boolean(email));
  const showSignIn = !isPending && !email;
  const showError = !showLoading && !showSignIn && error !== "";
  const showEmpty =
    !showLoading && !showSignIn && !showError && bookings.length === 0;
  const showContent = !showLoading && !showSignIn && !showError;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      {/* Greeting with the real name of the signed in technician */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting && session?.user?.name
            ? `${greeting}, ${session.user.name}`
            : session?.user?.name || "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is what is happening with your work.
        </p>
      </motion.div>

      {showLoading && (
        <div className="flex justify-center align-middle">
          <Spinner/>
        </div>
         

        // <p className="py-10 text-center text-sm text-muted-foreground">
        //   Loading...
        // </p>
      )}

      {showSignIn && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Please sign in to see your overview.
        </p>
      )}

      {showError && (
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
      )}

      {showContent && (
        <>
          {/* New requests warning, only when something is pending */}
          <NewRequestsBanner count={newRequests} />

          {/* The 6 cards are counted from the real data */}
          <motion.div
            variants={container}
            className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <StatCard
              label="Total jobs"
              value={totalJobs}
              hint="All your bookings"
            />
            <StatCard
              label="New requests"
              value={newRequests}
              hint="Waiting for your answer"
            />
            <StatCard
              label="Active jobs"
              value={activeJobs}
              hint="Confirmed or in progress"
            />
            <StatCard
              label="Completed jobs"
              value={completedJobs}
              hint="Work that is done"
            />
            <StatCard
              label="Awaiting payment"
              value={awaitingPayment}
              hint="Completed and unpaid"
            />
            <StatCard
              label="Total earnings"
              value={`৳${totalEarnings.toLocaleString("en-US")}`}
              hint="All payments received"
            />
          </motion.div>

          {/* Counts for the technician services */}
          <div className="mb-6">
            <ServicesSummary services={services} />
          </div>

          {/* Empty message until the first booking arrives */}
          {showEmpty && (
            <div className="mb-6 rounded-xl border border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No bookings yet</p>

              {services.length === 0 && (
                <Button
                  className="mt-4"
                  render={<Link href="/dashboard/technician/add-service" />}
                >
                  Add your first service
                </Button>
              )}
            </div>
          )}

          {/* Latest bookings and payments side by side */}
          {!showEmpty && (
            <div className="grid gap-6 lg:grid-cols-2">
              <RecentBookings bookings={bookings} />
              <RecentPayments payments={payments} bookings={bookings} />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
