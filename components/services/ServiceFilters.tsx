"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UpdateQuery } from "./servicesQuery";

// The main categories always shown in the list. The backend can return more
// (they are appended from categoryCounts), so nothing gets hidden.
const MAIN_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "Home Appliances",
  "Networking",
  "Office Equipment",
];

const ALL_SERVICE_MODES = ["Home Visit", "Workshop"];

type ServiceFiltersProps = {
  categoryCounts: Record<string, number>;
  selectedCategories: string[];
  selectedServiceModes: string[];
  // Turns the "Clear filters" button on/off (search, category or mode active).
  canClear: boolean;
  updateQuery: UpdateQuery;
};

// A filter group that can collapse (with a small height animation).
function FilterSection({
  title,
  action,
  defaultOpen = true,
  children,
}: {
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 py-2 text-sm font-semibold transition-colors hover:text-foreground/70"
        >
          {title}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {action}
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pt-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// One checkbox row (native checkbox kept for accessibility, styled visually).
function FilterCheckbox({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded border transition-colors",
          "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
          checked
            ? "border-primary bg-primary"
            : "border-input bg-background dark:bg-input/30"
        )}
      >
        {checked ? (
          <Check aria-hidden className="size-3 text-primary-foreground" strokeWidth={3} />
        ) : null}
      </span>
      <span className="flex-1 text-sm">{label}</span>
      {count !== undefined ? (
        <span className="text-xs text-muted-foreground">{count}</span>
      ) : null}
    </label>
  );
}

export function ServiceFilters({
  categoryCounts,
  selectedCategories,
  selectedServiceModes,
  canClear,
  updateQuery,
}: ServiceFiltersProps) {
  // Main categories first, then any other category the backend reports
  // (sorted so the list does not jump around between requests).
  const categoryOptions = [
    ...MAIN_CATEGORIES,
    ...Object.keys(categoryCounts)
      .filter((category) => !MAIN_CATEGORIES.includes(category))
      .sort(),
  ];

  // Adding a value keeps the others, removing one only removes that one.
  function toggleValue(param: "category" | "serviceMode", selected: string[], value: string) {
    const isSelected = selected.includes(value);
    const next = isSelected
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    const allOptions = param === "category" ? categoryOptions : ALL_SERVICE_MODES;

    // Selecting everything is the same as selecting nothing → keep the URL clean.
    const isEveryOptionSelected = next.length >= allOptions.length;

    updateQuery({
      [param]: isEveryOptionSelected ? null : next.join(","),
      page: null,
    });
  }

  function clearFilters() {
    updateQuery({ search: null, category: null, serviceMode: null, page: null });
  }

  return (
    <div className="space-y-1">
      <FilterSection
        title="Category"
        action={
          selectedCategories.length > 0 ? (
            <button
              type="button"
              onClick={() => updateQuery({ category: null, page: null })}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          ) : null  
        }
      >
        {categoryOptions.map((category) => (
          <FilterCheckbox
            key={category}
            label={category}
            count={categoryCounts[category] ?? 0}
            checked={selectedCategories.includes(category)}
            onChange={() => toggleValue("category", selectedCategories, category)}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Service mode"
        action={
          selectedServiceModes.length > 0 ? (
            <button
              type="button"
              onClick={() => updateQuery({ serviceMode: null, page: null })}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          ) : null
        }
      >
        {ALL_SERVICE_MODES.map((mode) => (
          <FilterCheckbox
            key={mode}
            label={mode}
            checked={selectedServiceModes.includes(mode)}
            onChange={() => toggleValue("serviceMode", selectedServiceModes, mode)}
          />
        ))}
      </FilterSection>

      <div className="pt-3">
        <button
          type="button"
          onClick={clearFilters}
          disabled={!canClear}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-muted active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Clear filters
        </button>
      </div>
    </div>
  );
}
