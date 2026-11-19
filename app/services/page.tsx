"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { getService } from "@/lib/API/service";
import type { IService } from "@/lib/type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ServiceSearch } from "@/components/services/ServiceSearch";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceSort } from "@/components/services/ServiceSort";
import { ServiceList } from "@/components/services/ServiceList";
import { ServicePagination } from "@/components/services/ServicePagination";
import { ServiceGridSkeleton } from "@/components/services/ServiceSkeleton";
import { EmptyServices } from "@/components/services/EmptyServices";
import { ServiceError } from "@/components/services/ServiceError";
import {
  buildServicesUrl,
  parseServiceQuery,
  type UpdateQuery,
} from "@/components/services/servicesQuery";

const PAGE_SIZE = 6;

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // The URL is the single source of truth for all filters.
  const queryString = searchParams.toString();
  const query = parseServiceQuery(queryString);

  // Data returned by the API.
  const [services, setServices] = useState<IService[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Simple loading and error flags.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch services whenever the filters in the URL change.
  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setError(false);

      try {
        const currentQuery = parseServiceQuery(queryString);
        const data = await getService({
          search: currentQuery.search,
          category: currentQuery.category,
          serviceMode: currentQuery.serviceMode,
          sort: currentQuery.sort,
          page: currentQuery.page,
          limit: PAGE_SIZE,
        });

        // The API returns every status, but only approved services
        // belong in the public marketplace.
        setServices(
          data.services.filter(
            (service) => service.approvalStatus === "approved"
          )
        );
        setCategoryCounts(data.categoryCounts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [queryString]);

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

  const handleSort = (value: string) => updateQuery({ sort: value, page: null });

  const handlePageChange = (page: number) => updateQuery({ page: String(page) });

  const clearFilters = () =>
    updateQuery({ search: null, category: null, serviceMode: null, page: null });

  const selectedCategories = query.category ? query.category.split(",") : [];
  const selectedServiceModes = query.serviceMode
    ? query.serviceMode.split(",")
    : [];
  const hasActiveFilters = Boolean(
    query.search || query.category || query.serviceMode
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
            {loading ? (
              "Loading services..."
            ) : error ? null : (
              <>
                <span className="font-semibold text-foreground">{total}</span>{" "}
                services available
              </>
            )}
          </p>
        </header>

        <ServiceSearch
          value={query.search}
          isLoading={loading}
          onSearch={handleSearch}
        />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Filters: sidebar on desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-1 font-heading text-base font-semibold">
                Filters
              </h2>
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
                    render={
                      <Button variant="outline" className="h-9 gap-2 lg:hidden" />
                    }
                  >
                    <SlidersHorizontal aria-hidden />
                    Filters
                    {hasActiveFilters ? (
                      <span className="size-1.5 rounded-full bg-accent" />
                    ) : null}
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[85%] overflow-y-auto sm:max-w-sm"
                  >
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
              {error ? (
                // Reloading the page fetches the services again.
                <ServiceError onRetry={() => window.location.reload()} />
              ) : loading && services.length === 0 ? (
                <ServiceGridSkeleton />
              ) : services.length === 0 ? (
                <EmptyServices onClearFilters={clearFilters} />
              ) : (
                <div
                  className={
                    loading
                      ? "pointer-events-none opacity-60 transition-opacity"
                      : "transition-opacity"
                  }
                >
                  {/* Remounting on a filter change replays the entrance animation */}
                  <ServiceList key={queryString} services={services} />
                </div>
              )}

              {!error ? (
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
