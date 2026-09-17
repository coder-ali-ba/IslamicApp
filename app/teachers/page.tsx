"use client";

import { useMemo, useState } from "react";
import { SearchX, X } from "lucide-react";

import TeachersHero from "@/app/components/teachers/TeacherHero";
import TeacherFilters from "@/app/components/teachers/TeacherFilters";
import TeacherCard from "@/app/components/teachers/TeacherCard";

import {
  TeacherSubject,
  teachers,
} from "@/app/src/lib/teachers";

export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<
    "All" | TeacherSubject
  >("All");

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return teachers.filter((teacher) => {
      const matchesSubject =
        subject === "All" ||
        teacher.subjects.includes(subject);

      const matchesSearch =
        !query ||
        teacher.name.toLocaleLowerCase().includes(query) ||
        teacher.title.toLocaleLowerCase().includes(query) ||
        teacher.bio.toLocaleLowerCase().includes(query) ||
        teacher.qualification
          .toLocaleLowerCase()
          .includes(query) ||
        teacher.subjects.some((item) =>
          item.toLocaleLowerCase().includes(query)
        );

      return matchesSubject && matchesSearch;
    });
  }, [search, subject]);

  const hasFilters = search.trim() !== "" || subject !== "All";

  const featuredTeachers = teachers.filter(
    (teacher) => teacher.featured
  );

  const clearFilters = () => {
    setSearch("");
    setSubject("All");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <TeachersHero
        search={search}
        onSearchChange={setSearch}
      />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Featured */}
        {!hasFilters && (
          <section>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Our Teachers
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  Meet Our Knowledgeable Teachers
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                  Learn from instructors with experience in different
                  areas of Islamic knowledge.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                />
              ))}
            </div>
          </section>
        )}

        {/* Filters + all teachers */}
        <section className={hasFilters ? "" : "mt-16"}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                Explore Instructors
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                {hasFilters
                  ? "Search Teachers"
                  : "All Teachers"}
              </h2>
            </div>

            <p className="text-sm text-stone-400">
              {filteredTeachers.length}{" "}
              {filteredTeachers.length === 1
                ? "teacher"
                : "teachers"}{" "}
              found
            </p>
          </div>

          <TeacherFilters
            subject={subject}
            onSubjectChange={setSubject}
          />

          {/* Active search */}
          {hasFilters && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {search.trim() && (
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
                  Search: &quot;{search}&quot;
                </span>
              )}

              {subject !== "All" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
                  Subject: {subject}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#967438] transition hover:bg-stone-100"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            </div>
          )}

          {/* Results */}
          {filteredTeachers.length > 0 ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
                <SearchX className="h-6 w-6 text-stone-400" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-stone-900">
                No teachers found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Try another teacher name, subject, or clear your
                filters to see all available instructors.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}