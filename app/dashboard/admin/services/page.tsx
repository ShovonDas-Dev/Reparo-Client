import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import { getAdminServices, type Service } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import ServiceStatCards from "./Components/ServiceStatCards";
import ServicesTable from "./Components/ServicesTable";
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

export default async function AdminServicesPage() {
  // Load every service from the backend.
  let services: Service[] = [];
  let error = "";

  try {
    // Get the JWT for this signed-in admin from Better Auth.
    const token = await getServerToken();
    services = await getAdminServices(token);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "We could not load the services right now. Please try again later.";
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
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-sm text-muted-foreground">
          Every service on Reparo, with a quick way to approve or reject them.
        </p>
      </motion.div>

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
    </motion.div>
  );
}
