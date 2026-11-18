"use client";

import { motion } from "motion/react";
import { RotateCcw, TriangleExclamationPoint } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceErrorProps = {
  onRetry: () => void;
};

// Shown when the services API cannot be reached.
export function ServiceError({ onRetry }: ServiceErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center"
    >
      <TriangleExclamationPoint
        aria-hidden
        className="mx-auto size-10 text-destructive"
      />
      <h3 className="mt-4 font-heading text-xl font-semibold">
        Could not load services
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while contacting the server. Please try again.
      </p>
      <Button variant="outline" className="mt-5 h-9" onClick={onRetry}>
        <RotateCcw aria-hidden />
        Retry
      </Button>
    </motion.div>
  );
}
