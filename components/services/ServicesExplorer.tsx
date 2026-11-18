"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { getService } from "@/lib/API/service";
import type { ServicesResponse } from "@/lib/type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ServiceSearch } from "./ServiceSearch";
import { ServiceFilters } from "./ServiceFilters";
import { ServiceSort } from "./ServiceSort";
import { ServiceList } from "./ServiceList";
import { ServicePagination } from "./ServicePagination";
import { ServiceGridSkeleton } from "./ServiceSkeleton";
import { EmptyServices } from "./EmptyServices";
import { ServiceError } from "./ServiceError";
import { buildServicesUrl, parseServiceQuery, type UpdateQuery } from "./servicesQuery";

const PAGE_SIZE = 6;

type LoadedServices = {
  // The query string + retry number the data belongs to (used to work out
  // whether a request is still pending, and to animate cards on change).
  queryKey: string;
  attempt: number;
  data: ServicesResponse;
};

export default function ServicesExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryString = searchParams.toString();
  const query = parseServiceQuery(queryString);

  const [loaded, setLoaded] = useState<LoadedServices | null>(null);
  const [failedRequest, setFailedRequest] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const currentRequest = `${queryString}|${retryCount}`;

  // Fetch services for the current URL. The cleanup flag ignores responses
  // that arrive after the user already changed a filter.
  useEffect(() => {
    const currentQuery = parseServiceQuery(queryString);
    let isActive = true;

    getService({
      search: currentQuery.search,
      category: currentQuery.category,
      serviceMode: currentQuery.serviceMode,
      sort: currentQuery.sort,
      page: currentQuery.page,
      limit: PAGE_SIZE,
    })
      .then((data) => {
        if (!isActive) return;
        setLoaded({ queryKey: queryString, attempt: retryCount, data });
        setFailedRequest(null);
      })
      .catch(() => {
        if (!isActive) return;
        setFailedRequest(`${queryString}|${retryCount}`);
      });

    return () => {
      isActive = false;
    };
  }, [queryString, retryCount]);

  // The page state is derived from the request above, never set on purpose.
  const hasError = failedRequest === currentRequest;
  const isLoading =
    !hasError &&
    (!loaded || loaded.queryKey !== queryString || loaded.attempt !== retryCount);

  // Writes filters to the URL. Everything else in the URL is preserved.
  const updateQuery: UpdateQuery = (changes, mode = "push") => {
    const nextUrl = buildServicesUrl(queryString, changes);
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (nextUrl === currentUrl) return;

    if (mode === "replace") {
      router.replace(nextUrl, { scroll: false });
    } else {
      router.push(nextUrl, { scroll: false });
    }
  };

  const handleSearch = (value: string) =>
    updateQuery({ search: value || null, page: null }, "replace");

  const handleSort = (value: string) =>
    updateQuery({ sort: value, page: null });

  const handlePageChange = (page: number) => updateQuery({ page: String(page) });

  const clearFilters = () =>
    updateQuery({ search: null, category: null, serviceMode: null, page: null });

  const selectedCategories = query.category ? query.category.split(",") : [];
  const selectedServiceModes = query.serviceMode ? query.serviceMode.split(",") : [];
  const hasActiveFilters = Boolean(query.search || query.category || query.serviceMode);

  const categoryCounts = loaded?.data.categoryCounts ?? {};
  const total = loaded?.data.total ?? 0;
  const totalPages = loaded?.data.totalPages ?? 1;

  // The API returns every status, but only approved services belong
  // in the public marketplace.
  const services = (loaded?.data.services ?? []).filter(
    (service) => service.approvalStatus === "approved"
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 lg:px-12"
      >
        {/* Page header */}
        <header className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Service marketplace
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-[-0.03em] md:text-5xl">
            Explore Services
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse trusted technicians, compare prices and find the right fix for
            your device or home.
          </p>
          <p className="mt-3 min-h-5 text-sm text-muted-foreground">
            {loaded ? (
              <>
                <span className="font-semibold text-foreground">{total}</span>{" "}
                services available
              </>
            ) : isLoading ? (
              "Loading services..."
            ) : null}
          </p>
        </header>

        <ServiceSearch
          value={query.search}
          isLoading={isLoading}
          onSearch={handleSearch}
        />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Filters: sidebar on desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-1 font-heading text-base font-semibold">Filters</h2>
              <ServiceFilters
                categoryCounts={categoryCounts}
                selectedCategories={selectedCategories}
                selectedServiceModes={selectedServiceModes}
                canClear={hasActiveFilters}
                updateQuery={updateQuery}
              />
            </div>
          </aside>

          {/* Results */}
          <section className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {services.length} {services.length === 1 ? "service" : "services"}
                {totalPages > 1 ? ` · Page ${query.page} of ${totalPages}` : ""}
              </p>

              <div className="flex items-center gap-2">
                {/* Filters in a sheet on mobile */}
                <Sheet>
                  <SheetTrigger
                    render={<Button variant="outline" className="h-9 gap-2 lg:hidden" />}
                  >
                    <SlidersHorizontal aria-hidden />
                    Filters
                    {hasActiveFilters ? (
                      <span className="size-1.5 rounded-full bg-accent" />
                    ) : null}
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] overflow-y-auto sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription className="sr-only">
                        Filter services by category and service mode.
                      </SheetDescription>
                    </SheetHeader>
                    <ServiceFilters
                      categoryCounts={categoryCounts}
                      selectedCategories={selectedCategories}
                      selectedServiceModes={selectedServiceModes}
                      canClear={hasActiveFilters}
                      updateQuery={updateQuery}
                    />
                  </SheetContent>
                </Sheet>

                <ServiceSort value={query.sort} onChange={handleSort} />
              </div>
            </div>

            <div className="mt-6">
              {hasError ? (
                <ServiceError onRetry={() => setRetryCount((count) => count + 1)} />
              ) : isLoading && !loaded ? (
                <ServiceGridSkeleton />
              ) : services.length === 0 ? (
                <EmptyServices onClearFilters={clearFilters} />
              ) : (
                <div
                  className={
                    isLoading
                      ? "pointer-events-none opacity-60 transition-opacity"
                      : "transition-opacity"
                  }
                >
                  {/* Remounting on a new result set replays the entrance animation */}
                  <ServiceList key={loaded?.queryKey} services={services} />
                </div>
              )}

              {!hasError ? (
                <ServicePagination
                  page={query.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              ) : null}
            </div>
          </section>
        </div>
      </motion.main>
    </MotionConfig>
  );
}
