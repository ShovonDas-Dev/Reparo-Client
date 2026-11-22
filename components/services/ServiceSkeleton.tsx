import * as motion from "framer-motion/client";
import { Skeleton } from "@/components/ui/skeleton";

// One placeholder card — same size as a real ServiceCard so the layout
// does not shift when the real data arrives.
export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-4 h-9 w-full" />
      </div>
    </div>
  );
}

// Grid of placeholder cards shown while services are loading.
export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </motion.div>
  );
}

// Whole-page placeholder used as the Suspense fallback on first load.
export function ServicesPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 lg:px-12"
    >
      <Skeleton className="h-3 w-44" />
      <Skeleton className="mt-4 h-11 w-72" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-8 h-11 w-full rounded-xl" />

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="space-y-5 rounded-2xl border border-border bg-card p-4">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-5 w-28" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="mt-6">
            <ServiceGridSkeleton />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
