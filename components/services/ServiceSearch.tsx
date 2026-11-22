"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ServiceSearchProps = {
  // The "search" value that is currently in the URL.
  value: string;
  isLoading: boolean;
  // Called with the typed value after the debounce delay.
  onSearch: (value: string) => void;
};

const DEBOUNCE_MS = 400;

export function ServiceSearch({ value, isLoading, onSearch }: ServiceSearchProps) {
  const [text, setText] = useState(value);
  const [lastUrlValue, setLastUrlValue] = useState(value);
  const isPending = text.trim() !== value;

  // Keep the input in sync with the URL (browser back/forward, clear filters).
  // Doing this while rendering avoids an extra render pass from an effect.
  if (value !== lastUrlValue) {
    setLastUrlValue(value);
    setText(value);
  }

  // Debounce: wait until the user stops typing, then update the URL.
  useEffect(() => {
    if (text.trim() === value) return;

    const timer = setTimeout(() => onSearch(text.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, value, onSearch]);

  function handleClear() {
    setText("");
    onSearch("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative mt-8"
    >
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search for services, repairs, or technicians..."
        aria-label="Search services"
        className="h-11 w-full rounded-xl pr-24 pl-10 text-sm shadow-sm [&::-webkit-search-cancel-button]:hidden"
      />

      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
        {isPending || isLoading ? (
          <LoaderCircle
            aria-label="Searching"
            className="size-4 animate-spin text-muted-foreground"
          />
        ) : null}

        {text ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X />
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
