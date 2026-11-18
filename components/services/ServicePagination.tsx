"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServicePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ServicePagination({
  page,
  totalPages,
  onPageChange,
}: ServicePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Services pagination"
      className="mt-8 flex flex-wrap items-center justify-between gap-4"
    >
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9"
      >
        <ChevronLeft aria-hidden />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9"
      >
        Next
        <ChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
