"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Service } from "@/lib/API/service";

type FeaturedServiceCardProps = {
  service: Service;
  // The position of the card (0, 1, 2). Used to show the cards one after another.
  index?: number;
};

// Turn "Jordan Lee" into "JL" for the small round avatar.
const getInitials = (name?: string) => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  const letters = words.slice(0, 2).map((word) => word.charAt(0));
  return letters.join("").toUpperCase();
};

export default function FeaturedServiceCard({
  service,
  index = 0,
}: FeaturedServiceCardProps) {
  // true when the visitor asked their device for less motion
  const prefersReducedMotion = useReducedMotion();

  // "Home Visit · Northside" (a missing part is simply skipped).
  const details = [service.serviceMode, service.serviceArea]
    .filter(Boolean)
    .join(" · ");

  return (
    // The card slides up when it comes into view, and lifts a little on hover.
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{
        opacity: 1,
        y: 0,
        // Each card starts a little later than the one before it.
        transition: { duration: 0.5, delay: index * 0.12, ease: "easeOut" },
      }}
      whileHover={
        prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.2 } }
      }
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* The whole card is a link to the service details page. */}
      <Link
        href={`/services/${service._id}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
      >
        {/* Image with the "Vetted pro" badge on top */}
        <div className="relative aspect-[16/9] w-full bg-muted">
          {service.image && (
            <Image
              src={service.image}
              alt={service.title}
              fill
              // Images come from different hosts, so show them as they are.
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          )}

          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm">
            <BadgeCheck className="size-4" />
            Vetted pro
          </span>
        </div>

        {/* Text part of the card */}
        <div className="p-5">
          <p className="text-sm text-muted-foreground">
            {service.category || "-"}
          </p>

          <h3 className="mt-3 line-clamp-2 text-xl font-semibold text-card-foreground">
            {service.title}
          </h3>

          {details && (
            <p className="mt-2 text-sm text-muted-foreground">{details}</p>
          )}

          {/* Price on the left, technician on the right */}
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="text-2xl font-bold text-card-foreground">
                ৳{service.basePrice ?? "-"}
              </p>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {getInitials(service.technicianName)}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {service.technicianName || "-"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}