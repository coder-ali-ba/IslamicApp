"use client";

import { useMemo, useState } from "react";

import QuranHero from "@/app/components/quran/QuranHero";
import QuranSearch from "@/app/components/quran/QuranSearch";
import SurahCard from "@/app/components/quran/SurahCard";

import { surahs } from "../src/lib/surah";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function QuranPage() {
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return surahs;
    }

    return surahs.filter((surah) => {
      return (
        surah.name.toLowerCase().includes(search) ||
        surah.arabic.includes(search) ||
        surah.id.toString() === search
      );
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <QuranHero />

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Search */}
        <QuranSearch query={query} setQuery={setQuery} />

        {/* Heading */}
        <div className="mt-10 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Quran Surahs
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {query
                ? `${filteredSurahs.length} Surah${
                    filteredSurahs.length !== 1 ? "s" : ""
                  } found`
                : `Browse all ${surahs.length} Surahs of the Holy Quran`}
            </p>
          </div>
        </div>

        {/* Surah List */}
        {filteredSurahs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSurahs.map((surah) => (
              <SurahCard
                key={surah.id}
                id={surah.id}
                name={surah.name}
                arabicName={surah.arabic}
                verses={surah.verses}
                revelation={surah.revelation}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-stone-800">
              No Surah found
            </h3>

            <p className="mt-2 text-sm text-stone-500">
              Try another Surah name or number.
            </p>
          </div>
        )}

        <p className="mt-12 text-center text-xs text-stone-400">
          Quran data provided by Quran Foundation
        </p>
      </section>
      <Footer/>
    </main>
  );
}