"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type CombinedHadith = {
  hadithnumber: string | number;
  arabic: string;
  english: string;
  urdu: string;
  grades: string[];
};

type HadithSearchProps = {
  hadiths: CombinedHadith[];
};

export default function HadithSearch({
  hadiths,
}: HadithSearchProps) {
  const [search, setSearch] = useState("");

  const filteredHadiths = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return hadiths;

    return hadiths.filter((hadith) => {
      return (
        String(hadith.hadithnumber).includes(query) ||
        hadith.arabic.toLocaleLowerCase().includes(query) ||
        hadith.english.toLocaleLowerCase().includes(query) ||
        hadith.urdu.toLocaleLowerCase().includes(query)
      );
    });
  }, [hadiths, search]);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Hadith by number, Arabic, English or Urdu..."
            className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] py-3.5 pl-12 pr-12 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {filteredHadiths.length} Hadith
            {filteredHadiths.length !== 1 ? "s" : ""} found
          </p>

          {search && (
            <p className="text-xs text-stone-400">
              Searching in all languages
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredHadiths.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-stone-700">
            No Hadith found
          </p>

          <p className="mt-2 text-sm text-stone-500">
            Try searching with a different number or keyword.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-5 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredHadiths.map((hadith) => (
            <article
              key={String(hadith.hadithnumber)}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 md:px-8">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                  Hadith
                </span>

                <span className="rounded-full bg-[#faf7ef] px-4 py-1.5 text-sm font-semibold text-[#967438]">
                  #{hadith.hadithnumber}
                </span>
              </div>

              <div className="px-6 py-7 md:px-8 md:py-9">
                {/* Arabic */}
                {hadith.arabic && (
                  <div className="border-b border-stone-100 pb-7">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-right font-serif text-2xl leading-[2.2] text-stone-900 md:text-3xl"
                    >
                      {hadith.arabic}
                    </p>
                  </div>
                )}

                {/* English */}
                {hadith.english && (
                  <div className="border-b border-stone-100 py-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#967438]">
                      English
                    </p>

                    <p className="text-base leading-8 text-stone-700 md:text-lg">
                      {hadith.english}
                    </p>
                  </div>
                )}

                {/* Urdu */}
                {hadith.urdu && (
                  <div className="pt-7">
                    <p className="mb-3 text-right text-xs font-semibold uppercase tracking-[0.15em] text-[#967438]">
                      اردو
                    </p>

                    <p
                      dir="rtl"
                      lang="ur"
                      className="text-right text-lg leading-9 text-stone-700 md:text-xl"
                    >
                      {hadith.urdu}
                    </p>
                  </div>
                )}
              </div>

              {/* Hadith Status */}
              {hadith.grades.length > 0 && (
                <div className="border-t border-stone-100 bg-[#fcfbf8] px-6 py-5 md:px-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
                        Hadith Status
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        Classification provided by the source
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hadith.grades.map((grade, index) => (
                        <span
                          key={`${grade}-${index}`}
                          className="rounded-full border border-[#d6b56d]/40 bg-[#faf7ef] px-4 py-1.5 text-sm font-semibold text-[#967438]"
                        >
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}