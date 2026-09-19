"use client";

import { useMemo, useState } from "react";

import ClassesHero from "@/app/components/classes/ClassesHero";
import ClassFilters from "@/app/components/classes/ClassFilters";
import ClassCard from "@/app/components/classes/ClassCard";

import {
  classes,
  type ClassCategory,
  type ClassLevel,
} from "@/app/src/lib/classes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<ClassCategory | "All">("All");
  const [level, setLevel] =
    useState<ClassLevel | "All">("All");

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLocaleLowerCase().includes(query) ||
        item.description
          .toLocaleLowerCase()
          .includes(query) ||
        item.category.toLocaleLowerCase().includes(query) ||
        item.instructor
          .toLocaleLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesLevel =
        level === "All" ||
        item.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [search, category, level]);

  const hasFilters =
    search.trim() !== "" ||
    category !== "All" ||
    level !== "All";

  const featuredClasses = classes.filter(
    (item) => item.featured
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <ClassesHero
        search={search}
        onSearchChange={setSearch}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {/* Featured */}
        {!hasFilters && (
          <section>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
                  Upcoming
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  Featured Classes
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                  Join upcoming live sessions and learn directly
                  with experienced instructors.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredClasses.map((item) => (
                <ClassCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Classes */}
        <section className={!hasFilters ? "mt-20" : ""}>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              {hasFilters
                ? "Search Results"
                : "All Classes"}
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1
                ? "class"
                : "classes"}{" "}
              available
            </p>
          </div>

          <ClassFilters
            category={category}
            level={level}
            onCategoryChange={setCategory}
            onLevelChange={setLevel}
          />

          {filteredClasses.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((item) => (
                <ClassCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-stone-900">
                No classes found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Try a different search term or change your
                selected filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </section>
      <Footer />
    </main>
  );
}