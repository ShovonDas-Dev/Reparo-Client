import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { ServicesPageSkeleton } from "@/components/services/ServiceSkeleton";

export const metadata: Metadata = {
  title: "Explore Services — Reparo",
  description:
    "Search and filter trusted repair services by category, service mode and price.",
};

// The page is a client component that reads the URL with useSearchParams(),
// so it needs a Suspense boundary above it for prerendering to work.
export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<ServicesPageSkeleton />}>{children}</Suspense>;
}
