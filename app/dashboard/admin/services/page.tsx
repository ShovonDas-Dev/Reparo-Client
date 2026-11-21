import { getAdminServices, type Service } from "@/lib/API/service";

import ServiceStatCards from "./Components/ServiceStatCards";
import ServicesTable from "./Components/ServicesTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

export default async function AdminServicesPage() {
  // Load every service from the backend.
  let services: Service[] = [];
  let error = "";

  try {
    services = await getAdminServices();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "We could not load the services right now. Please try again later.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-sm text-muted-foreground">
          Every service on Reparo, with a quick way to approve or reject them.
        </p>
      </div>

      {/* Friendly error message when the services cannot be loaded */}
      {error !== "" && (
        <ErrorFallback
          title={error}
          message="We could not load the services right now. Please try again later."
        />
      )}

      {/* The cards and the table only show when the services loaded */}
      {error === "" && (
        <>
          <ServiceStatCards services={services} />

          <ServicesTable services={services} />
        </>
      )}
    </div>
  );
}
