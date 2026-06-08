"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchIcon } from "@/components/atoms/icons/search.icon";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  defaultValue?: string;
  className?: string;
}

export const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  defaultValue = "",
  className,
}: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue);

  const debounced = useCallback(
    (val: string) => {
      const timer = setTimeout(() => onSearch(val), debounceMs);
      return () => clearTimeout(timer);
    },
    [onSearch, debounceMs]
  );

  useEffect(() => {
    const cleanup = debounced(value);
    return cleanup;
  }, [value, debounced]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--muted)" }}
      >
        <SearchIcon className="w-4 h-4" />
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-9 pl-9 pr-3 text-sm rounded-field border border-[--border] bg-[--field-background] text-[--foreground] placeholder:text-[--muted] outline-none focus:border-[--accent] transition-colors"
        type="search"
      />
    </div>
  );
};
