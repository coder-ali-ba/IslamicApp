"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function HadithSearch() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    console.log("Searching Hadith:", search);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#967438]">
          Search
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-stone-900 md:text-3xl">
          Search Hadith
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-500">
          Search for Hadith by keyword, topic, or reference.
        </p>
      </div>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Hadith..."
            className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-28 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-4 focus:ring-[#d6b56d]/10"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}