import { getAdminPayments, type AdminPayment } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import TransactionStatCards from "./Components/TransactionStatCards";
import TransactionsTable from "./Components/TransactionsTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

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
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Every payment made on Reparo, in one place.
        </p>
      </div>

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
    </div>
  );
}
