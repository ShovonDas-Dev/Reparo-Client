import type { Metadata } from "next";
import { Suspense } from "react";
import ServicesExplorer from "@/components/services/ServicesExplorer";
import { ServicesPageSkeleton } from "@/components/services/ServiceSkeleton";

export const metadata: Metadata = {
  title: "Explore Services — Reparo",
  description:
    "Search and filter trusted repair services by category, service mode and price.",
};

export default function ServicesPage() {
  // useSearchParams() needs a Suspense boundary on a prerendered route.
  return (
    <Suspense fallback={<ServicesPageSkeleton />}>
      <ServicesExplorer />
    </Suspense>
  );
}
