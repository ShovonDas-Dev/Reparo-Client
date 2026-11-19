"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  House,
  ImageOff,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react";
import { ServiceDetails } from "@/lib/API/service";
import type { IService } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const getService = async () => {
      try {
        const data = await ServiceDetails(id);
        setService(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getService();
    }
  }, [id]);

  if (loading) return <ServiceDetailsSkeleton />;

  if (!service) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-16 text-center md:px-8">
        <h1 className="font-heading text-3xl font-bold">Service not found</h1>
        <p className="mt-3 text-muted-foreground">
          This service may have been removed or the link is broken.
        </p>
        <Button render={<Link href="/services" />} className="mt-6">
          Back to services
        </Button>
      </main>
    );
  }

  const modeIcon =
    service.serviceMode === "Home Visit" ? (
      <House aria-hidden className="size-4" />
    ) : (
      <Store aria-hidden className="size-4" />
    );

  const showImage = Boolean(service.image) && !imageFailed;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/services" className="hover:text-foreground hover:underline">
          Services
        </Link>
        <span aria-hidden>/</span>
        <span>{service.category}</span>
        <span aria-hidden>/</span>
        <span className="text-foreground">{service.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        {/* ---------- Main content ---------- */}
        <div>
          {/* Service image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-[16/10]">
            {showImage ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                // Service images come from different hosts, so they are shown as-is
                // (same approach as ServiceCard).
                unoptimized
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageOff aria-hidden className="size-10" />
              </div>
            )}
          </div>

          {/* Title block */}
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            {service.category} · {service.serviceMode}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] md:text-4xl">
            {service.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{service.description}</p>

          {/* Quick facts */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <span className="flex items-center gap-2">
              <Clock aria-hidden className="size-4 text-muted-foreground" />
              {service.estimatedDuration}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck aria-hidden className="size-4 text-muted-foreground" />
              {service.isAvailable ? "Available now" : "Currently unavailable"}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              {service.serviceArea}
            </span>
          </div>

          {/* What to expect */}
          <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6">
            <h2 className="font-heading text-xl font-semibold">
              What to expect
            </h2>
            <p className="mt-3 text-muted-foreground">
              Your technician will assess the issue, explain the recommended
              repair, and get your approval before moving ahead. You only pay
              when the repair is complete.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <BadgeCheck
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                />
                A vetted FixMate professional handles your repair.
              </li>
              <li className="flex items-start gap-2.5">
                <BadgeCheck
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                />
                The final quote is confirmed before any work begins.
              </li>
              <li className="flex items-start gap-2.5">
                <BadgeCheck
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                />
                Pay securely only after the job is done.
              </li>
            </ul>
          </section>
        </div>

        {/* ---------- Booking card ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Service overview
            </p>

            {/* Price */}
            <div className="mt-4">
              <small className="text-sm text-muted-foreground">
                Starting at
              </small>
              <strong className="block font-heading text-4xl font-bold">
                ৳{service.basePrice.toLocaleString("en-US")}
              </strong>
            </div>

            {/* Service mode */}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                {modeIcon}
                Service mode
              </span>
              <b>{service.serviceMode}</b>
            </div>

            {/* Service area */}
            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin aria-hidden className="size-4" />
                Service area
              </span>
              <b className="text-right">{service.serviceArea}</b>
            </div>

            {/* Technician */}
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/25 text-sm font-semibold">
                {service.technicianName
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <b className="block truncate">{service.technicianName}</b>
                <small className="flex items-center gap-1 text-muted-foreground">
                  <BadgeCheck aria-hidden className="size-3.5 text-emerald-500" />
                  Verified FixMate pro
                </small>
              </div>
            </div>

            {/* CTA */}
            <Button
              render={<Link href="/sign-in" />}
              className="mt-5 h-10 w-full gap-2"
            >
              Request this repair
              <ArrowRight aria-hidden className="size-4" />
            </Button>

            {/* Pay note */}
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0" />
              Pay securely after your repair is complete.
            </p>

            <p className="mt-4 border-t border-border pt-4 text-center text-sm text-muted-foreground">
              Not signed in?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-foreground underline underline-offset-2"
              >
                Sign in to request
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

// ---------- Skeleton loader ----------
// Shown while the service is being fetched. Mirrors the real layout
// so nothing jumps around when the data arrives.
function ServiceDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
      <Skeleton className="h-4 w-56" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/10]" />
          <Skeleton className="mt-6 h-3 w-40" />
          <Skeleton className="mt-3 h-9 w-3/4" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <div className="mt-6 flex gap-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-5 h-4 w-2/3" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="mt-2 h-10 w-32" />
            <Skeleton className="mt-5 h-px w-full" />
            <div className="mt-4 flex justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-5 h-px w-full" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-40" />
              </div>
            </div>
            <Skeleton className="mt-5 h-10 w-full rounded-lg" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-4 h-px w-full" />
            <Skeleton className="mt-4 h-4 w-48 mx-auto" />
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ServiceDetailsPage;
