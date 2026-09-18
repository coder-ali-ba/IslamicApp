"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import FatwaCard from "./FatwaCard";
import type { Fatwa, FatwaCategory } from "@/app/src/lib/fatwa";

type FatwaSearchProps = {
  fatwas: Fatwa[];
  categories: FatwaCategory[];
  selectedCategory: FatwaCategory | "All";
  onCategoryChange: (
    category: FatwaCategory | "All"
  ) => void;
};

export default function FatwaSearch({
  fatwas,
  categories,
  selectedCategory,
  onCategoryChange,
}: FatwaSearchProps) {
  const [search, setSearch] = useState("");

  const filteredFatwas = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fatwas.filter((fatwa) => {
      const matchesCategory =
        selectedCategory === "All" ||
        fatwa.category === selectedCategory;

      const matchesSearch =
        !query ||
        fatwa.question.toLowerCase().includes(query) ||
        fatwa.shortAnswer.toLowerCase().includes(query) ||
        fatwa.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [fatwas, search, selectedCategory]);

  return (
    <div>
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search fatwas..."
              className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
            />
          </div>

          {/* Category */}
          <div className="relative lg:w-56">
            <SlidersHorizontal
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <select
              value={selectedCategory}
              onChange={(event) =>
                onCategoryChange(
                  event.target.value as FatwaCategory | "All"
                )
              }
              className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 pl-11 pr-4 text-sm text-stone-800 outline-none transition-all focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            {selectedCategory === "All"
              ? "All Guidance"
              : selectedCategory}
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Fatwas
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            {filteredFatwas.length}{" "}
            {filteredFatwas.length === 1
              ? "result"
              : "results"}{" "}
            found
          </p>
        </div>

        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => onCategoryChange("All")}
            className="text-sm font-semibold text-stone-600 transition-colors hover:text-[#967438]"
          >
            Clear filter
          </button>
        )}
      </div>

      {filteredFatwas.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFatwas.map((fatwa) => (
            <FatwaCard key={fatwa.id} fatwa={fatwa} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
            <Search size={20} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-stone-900">
            No fatwas found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
            Try another search term or choose a different category.
          </p>
        </div>
      )}
    </div>
  );
}