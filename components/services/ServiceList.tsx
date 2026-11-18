"use client";

import type { IService } from "@/lib/type";
import { ServiceCard } from "./ServiceCard";

type ServiceListProps = {
  services: IService[];
};

// Responsive grid of service cards.
export function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <ServiceCard
          key={service._id ?? `${service.title}-${index}`}
          service={service}
          index={index}
        />
      ))}
    </div>
  );
}
