import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import { getAdminPayments, type AdminPayment } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import TransactionStatCards from "./Components/TransactionStatCards";
import TransactionsTable from "./Components/TransactionsTable";
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

export default async function AdminTransactionsPage() {
  // Load every payment record from the backend.
  let payments: AdminPayment[] = [];
  let error = "";

  try {
    // Get the JWT for this signed-in admin from Better Auth.
    const token = await getServerToken();
    payments = await getAdminPayments(token);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : // TODO: we use specific components
          "We could not load the transactions right now. Please try again later.";
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
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Every payment made on Reparo, in one place.
        </p>
      </motion.div>

      {/* Friendly error message when the transactions cannot be loaded */}
      {error !== "" && (
        <ErrorFallback
          title={error}
          message="We could not load the transactions right now. Please try again later."
        />
      )}

      {/* The cards and the table only show when the payments loaded */}
      {error === "" && (
        <>
          <TransactionStatCards payments={payments} />

          <TransactionsTable payments={payments} />
        </>
      )}
    </motion.div>
  );
}
