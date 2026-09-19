"use client";

import { useMemo, useState } from "react";
import CoursesHero from "@/app/components/courses/CoursesHero";
import CourseCard from "@/app/components/courses/CourseCard";
import CourseFilters from "@/app/components/courses/CourseFilters";
import {
  courses,
  type CourseCategory,
  type CourseLevel,
} from "@/app/src/lib/course";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<CourseCategory | "All">("All");
  const [level, setLevel] =
    useState<CourseLevel | "All">("All");

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title
          .toLocaleLowerCase()
          .includes(query) ||
        course.description
          .toLocaleLowerCase()
          .includes(query) ||
        course.category
          .toLocaleLowerCase()
          .includes(query) ||
        course.instructor
          .toLocaleLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        course.category === category;

      const matchesLevel =
        level === "All" ||
        course.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [search, category, level]);

  const featuredCourses = filteredCourses.filter(
    (course) => course.featured
  );

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      {/* Hero */}
      <CoursesHero
        search={search}
        onSearchChange={setSearch}
      />

      {/* Courses */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {/* Intro */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            Explore Learning
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            Find a course that suits you
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 md:text-base">
            Choose from structured Islamic courses designed
            for beginners, intermediate learners and advanced
            students.
          </p>
        </div>

        {/* Filters */}
        <CourseFilters
          category={category}
          level={level}
          onCategoryChange={setCategory}
          onLevelChange={setLevel}
        />

        {/* Featured */}
        {featuredCourses.length > 0 &&
          !search &&
          category === "All" &&
          level === "All" && (
            <div className="mb-14">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Recommended
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold text-stone-900">
                    Featured Courses
                  </h3>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                  />
                ))}
              </div>
            </div>
          )}

        {/* All Courses */}
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Browse
              </p>

              <h3 className="mt-1 text-2xl font-semibold text-stone-900">
                {search ||
                category !== "All" ||
                level !== "All"
                  ? "Search Results"
                  : "All Courses"}
              </h3>
            </div>

            <p className="text-sm text-stone-500">
              {filteredCourses.length} course
              {filteredCourses.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-stone-800">
                No courses found
              </p>

              <p className="mt-2 text-sm text-stone-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setLevel("All");
                }}
                className="mt-5 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

