import { getAdminPayments, type AdminPayment } from "@/lib/API/service";

import TransactionStatCards from "./rootComponents/TransactionStatCards";
import TransactionsTable from "./rootComponents/TransactionsTable";

export default async function AdminTransactionsPage() {
  // Load every payment record from the backend.
  let payments: AdminPayment[] = [];
  let error = "";

  try {
    payments = await getAdminPayments();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "We could not load the transactions right now. Please try again later.";
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
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
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
