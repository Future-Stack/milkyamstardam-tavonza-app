"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/**
 * Debounced search box that drives a server-side query through the `q` URL
 * param, so filtering happens in the API rather than over one loaded page.
 */
export function SearchField({
  basePath,
  initialQuery,
  placeholder,
}: {
  basePath: string;
  initialQuery: string;
  placeholder: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Already in sync — including right after our own navigation updated the URL.
    if (value === initialQuery) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const term = value.trim();
      const href = term ? `${basePath}?q=${encodeURIComponent(term)}` : basePath;
      startTransition(() => router.replace(href));
    }, 350);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, initialQuery, basePath, router]);

  return (
    <div className="relative w-full sm:w-96">
      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-white/[0.03] text-sm text-gray-200 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 w-full border border-white/5 transition-all hover:bg-white/[0.05]"
      />
      {isPending && (
        <Loader2 className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] animate-spin" />
      )}
    </div>
  );
}
