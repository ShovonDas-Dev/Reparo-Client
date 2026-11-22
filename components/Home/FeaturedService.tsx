import { Suspense } from "react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { ArrowRight } from "lucide-react";
import { getFeaturedServices, type Service } from "@/lib/API/service";
import FeaturedServiceCard from "./FeaturedServiceCard";

// The three cards. It loads the data from the backend.
async function ServicesGrid() {
  let services: Service[] = [];

  // Load the services. If it fails, show a friendly message.
  try {
    services = await getFeaturedServices();
  } catch {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Could not load services right now. Please try again later.
      </p>
    );
  }

  // Nothing to show yet
  if (services.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No services available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <FeaturedServiceCard key={service._id} service={service} index={index} />
      ))}
    </div>
  );
}

// Grey boxes shown while the services are loading.
function GridPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-80 animate-pulse rounded-xl border border-border bg-muted"
        />
      ))}
    </motion.div>
  );
}

export default function FeaturedServices() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      {/* Section title on the left, "See all services" link on the right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Good work, close by
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Meet your next great repair.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A few popular services from local FixMate pros.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          See all services
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>

      {/* The cards (a placeholder is shown until the data arrives) */}
      <Suspense fallback={<GridPlaceholder />}>
        <ServicesGrid />
      </Suspense>
    </section>
  );
}