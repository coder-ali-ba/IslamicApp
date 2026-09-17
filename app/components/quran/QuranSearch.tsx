"use client";

import { Search, X } from "lucide-react";

type QuranSearchProps = {
  query: string;
  setQuery: (value: string) => void;
};

export default function QuranSearch({
  query,
  setQuery,
}: QuranSearchProps) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Surah by name or number..."
        className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-12 pr-12 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}