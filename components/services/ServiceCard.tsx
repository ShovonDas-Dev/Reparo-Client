"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  CircleExclamationPoint,
  Clock,
  House,
  ImageOff,
  MapPin,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IService } from "@/lib/type";

type ServiceCardProps = {
  service: IService;
  // Used only to stagger the entrance animation.
  index: number;
};

// One service in the marketplace grid.
export function ServiceCard({ service, index }: ServiceCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(service.image) && !imageFailed;
  const modeIcon =
    service.serviceMode === "Home Visit" ? (
      <House aria-hidden className="size-3.5" />
    ) : (
      <Store aria-hidden className="size-3.5" />
    );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Image with a fallback so a missing/broken link never breaks the layout */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {showImage ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            // Service images come from different hosts, so they are shown as-is
            // (same approach as the technician ServiceForm).
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff aria-hidden className="size-8" />
          </div>
        )}

        <span
          className={cn(
            "absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
            service.isAvailable
              ? "bg-background/90 text-foreground"
              : "bg-muted/90 text-muted-foreground"
          )}
        >
          {service.isAvailable ? (
            <span className="size-1.5 rounded-full bg-emerald-500" />
          ) : (
            <CircleExclamationPoint aria-hidden className="size-3.5" />
          )}
          {service.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-accent/25 px-2.5 py-1 text-xs font-semibold">
            {service.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {modeIcon}
            {service.serviceMode}
          </span>
        </div>

        <h3 className="font-heading text-lg leading-snug font-semibold">
          {service.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-auto space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Base price</span>
            <span className="text-base font-bold">
              ৳{service.basePrice.toLocaleString("en-US")}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {service.estimatedDuration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" />
              {service.serviceArea}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User aria-hidden className="size-3.5" />
            <span className="truncate">{service.technicianName}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
