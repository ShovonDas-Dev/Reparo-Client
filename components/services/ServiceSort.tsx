"use client";

import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// The values on the left are exactly what the backend expects.
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priceLowToHigh", label: "Price: Low to High" },
  { value: "priceHighToLow", label: "Price: High to Low" },
] as const;

type ServiceSortProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ServiceSort({ value, onChange }: ServiceSortProps) {
  const currentLabel =
    SORT_OPTIONS.find((option) => option.value === value)?.label ??
    SORT_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="h-9 gap-2 font-medium" />
        }
      >
        <ArrowUpDown aria-hidden />
        {currentLabel}
        <ChevronDown aria-hidden className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="justify-between gap-4"
          >
            {option.label}
            {option.value === value ? <Check aria-hidden className="size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
