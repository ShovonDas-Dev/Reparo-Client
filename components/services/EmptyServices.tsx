"use client";

import { motion } from "motion/react";
import { RotateCcw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyServicesProps = {
  onClearFilters: () => void;
};

// Shown when no service matches the current filters.
export function EmptyServices({ onClearFilters }: EmptyServicesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"
    >
      <SearchX aria-hidden className="mx-auto size-10 text-muted-foreground" />
      <h3 className="mt-4 font-heading text-xl font-semibold">No services found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try changing your search or adjusting your filters.
      </p>
      <Button variant="outline" className="mt-5 h-9" onClick={onClearFilters}>
        <RotateCcw aria-hidden />
        Clear filters
      </Button>
    </motion.div>
  );
}
