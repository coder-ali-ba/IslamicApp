"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import CoursesHero from "@/app/components/courses/CoursesHero";
import CourseFilters from "@/app/components/courses/CourseFilters";
import CourseCard from "@/app/components/courses/CourseCard";

import {
  type Course,
  type CourseCategory,
  type CourseLevel,
} from "@/app/src/lib/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CourseCategory | "All">("All");
  const [level, setLevel] = useState<CourseLevel | "All">("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch courses");
        }

        const formattedCourses: Course[] = (data.courses || []).map(
          (course: any) => ({
            id: course._id,
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            instructor:
              course.instructor?.name || "Unknown Instructor",
            duration: course.duration,
            lessons: course.lessons,
            students: course.students,
            price: course.price,
            image: course.image,
            featured: course.featured,
          })
        );

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Fetch Courses Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Search + filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.instructor
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesLevel =
        level === "All" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const featuredCourses = filteredCourses.filter(
    (course) => course.featured
  );

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <Navbar />

      <CoursesHero
        search={search}
        onSearchChange={setSearch}
      />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CourseFilters
          category={category}
          level={level}
          onCategoryChange={setCategory}
          onLevelChange={setLevel}
        />

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <div className="h-52 bg-stone-200" />

                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 rounded bg-stone-200" />
                  <div className="h-6 w-3/4 rounded bg-stone-200" />
                  <div className="h-4 w-full rounded bg-stone-200" />
                  <div className="h-4 w-5/6 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-red-800">
              Unable to load courses
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Courses */}
        {!loading && !error && (
          <>
            {featuredCourses.length > 0 && (
              <section>
                <div className="mb-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#967438]">
                    Featured Learning
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                    Featured Courses
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className={featuredCourses.length > 0 ? "mt-16" : ""}>
              <div className="mb-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#967438]">
                  Explore IlmHub
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  All Courses
                </h2>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
                  <h3 className="text-xl font-semibold text-stone-900">
                    No courses found
                  </h3>

                  <p className="mt-2 text-sm text-stone-500">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}