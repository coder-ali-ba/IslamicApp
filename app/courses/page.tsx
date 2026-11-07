"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import api from "../src/lib/api";

type Instructor = {
  _id?: string;
  name?: string;
  email?: string;
} | string;

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  instructor?: Instructor;
  duration?: string | number;
  lessons?: number;
  price?: number;
  image?: string;
  featured?: boolean;
  status?: string;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  duration?: string | number;
  order: number;
  videoUrl?: string;
};

const API_URL =process.env.NEXT_PUBLIC_API_URL;


// Apne lesson.routes.js ke mutabiq zarurat par ye path change karein.
const LESSONS_ENDPOINT = (courseId: string) =>
  `/lessons/course/${courseId}`;

function getInstructorName(instructor?: Instructor) {
  if (!instructor) return "IlmHub Instructor";
  if (typeof instructor === "string") return instructor;
  return instructor.name || "IlmHub Instructor";
}

function getCourseId(course: Course) {
  return course._id;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessonsByCourse, setLessonsByCourse] = useState<
    Record<string, Lesson[]>
  >({});
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [lessonErrors, setLessonErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");

        const response = await fetch(`${API_URL}/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Courses cannot be loaded.");
        }

        setCourses(Array.isArray(data.courses) ? data.courses : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the course."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        courses
          .map((course) => course.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    );

    return ["All", ...uniqueCategories];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        course.title?.toLowerCase().includes(normalizedSearch) ||
        course.description?.toLowerCase().includes(normalizedSearch) ||
        course.category?.toLowerCase().includes(normalizedSearch) ||
        getInstructorName(course.instructor)
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [courses, search, selectedCategory]);

  const fetchCourseLessons = async (courseId: string) => {
    // Agar lessons pehle fetch ho chuke hain to dobara API call nahi hogi.
    if (lessonsByCourse[courseId]) return;

    try {
      setLoadingLessons(courseId);
      setLessonErrors((previous) => ({
        ...previous,
        [courseId]: "",
      }));

      const response = await fetch(
        `${API_URL}${LESSONS_ENDPOINT(courseId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lesson cannot be loaded.");
      }

      const lessons: Lesson[] = Array.isArray(data.lessons)
        ? [...data.lessons].sort(
            (a, b) => Number(a.order || 0) - Number(b.order || 0)
          )
        : [];

      setLessonsByCourse((previous) => ({
        ...previous,
        [courseId]: lessons,
      }));
    } catch (err) {
      setLessonErrors((previous) => ({
        ...previous,
        [courseId]:
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the course",
      }));
    } finally {
      setLoadingLessons(null);
    }
  };

  const handleToggleLessons = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    setExpandedCourse(courseId);
    await fetchCourseLessons(courseId);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <Navbar />
      {/* <section className="relative overflow-hidden bg-[#0B1930] px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#D99B33]/10 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D99B33]">
              IlmHub Learning
            </p>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Explore Courses
              <span className="block text-[#D99B33]">
                Learn, Grow and Excel
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Apni learning journey shuru karein. Available courses explore
              karein aur har course ke lessons dekhein.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3 text-sm text-slate-200">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-bold text-white">{courses.length}</span>{" "}
              Available Courses
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-bold text-[#D99B33]">Learn</span> at Your
              Own Pace
            </div>
          </div>
        </div>
      </section> */}

      {/* Courses section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D99B33]">
              Our Learning Programs
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#132A4C] sm:text-3xl">
              Available Courses
            </h2>
            <p className="mt-2 text-sm text-slate-500">
               Select Course and go through published lessons.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                id="course-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#D99B33] focus:ring-2 focus:ring-[#D99B33]/20"
              />
            </div>
          </div>
        </div>

        {/* Category filters */}
        {!loadingCourses && courses.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#132A4C] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#D99B33] hover:text-[#132A4C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Initial loading */}
        {loadingCourses && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-48 bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-10 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses API error */}
        {!loadingCourses && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loadingCourses && !error && filteredCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                <path d="M4 5.5v16M8 7h8M8 11h8" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#132A4C]">
              No courses found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              
              Change Search or Category filter and try again
            </p>
          </div>
        )}

        {/* Course cards */}
        {!loadingCourses && !error && filteredCourses.length > 0 && (
          <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => {
              const courseId = getCourseId(course);
              const isExpanded = expandedCourse === courseId;
              const lessons = lessonsByCourse[courseId] || [];
              const isLoadingThisCourse = loadingLessons === courseId;
              const lessonError = lessonErrors[courseId];

              return (
                <Link href={`/courses/${courseId}`}
                  key={courseId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Course image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#132A4C] to-[#263242]">
                    {course.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-16 w-16 text-white/50"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          aria-hidden="true"
                        >
                          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                          <path d="M4 5.5v16M8 7h8M8 11h8" />
                        </svg>
                      </div>
                    )}

                    {course.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#D99B33] px-3 py-1 text-xs font-bold text-[#0B1930]">
                        Featured
                      </span>
                    )}

                    {course.category && (
                      <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#132A4C]">
                        {course.category}
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Level and duration */}
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      {course.level && (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1">
                          {course.level}
                        </span>
                      )}

                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                          {course.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-[#132A4C]">
                      {course.title}
                    </h3>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                      {course.description || "Explore this course on IlmHub."}
                    </p>

                    {/* Instructor */}
                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#132A4C]/10 text-sm font-bold text-[#132A4C]">
                        {getInstructorName(course.instructor)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Instructor</p>
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {getInstructorName(course.instructor)}
                        </p>
                      </div>

                      <div className="ml-auto text-right">
                        <p className="text-xs text-slate-400">Lessons</p>
                        <p className="text-sm font-bold text-[#132A4C]">
                          {typeof course.lessons === "number"
                            ? course.lessons
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Lessons toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleLessons(courseId)}
                      aria-expanded={isExpanded}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#132A4C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930] focus:outline-none focus:ring-2 focus:ring-[#D99B33] focus:ring-offset-2"
                    >
                      {isExpanded ? "Hide Lessons" : "View Lessons"}

                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {/* Dynamic lessons panel */}
                    {isExpanded && (
                      <div className="mt-5 border-t border-slate-100 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-bold text-[#132A4C]">
                            Course Lessons
                          </h4>
                          {!isLoadingThisCourse && !lessonError && (
                            <span className="text-xs text-slate-500">
                              {lessons.length}{" "}
                              {lessons.length === 1 ? "Lesson" : "Lessons"}
                            </span>
                          )}
                        </div>

                        {isLoadingThisCourse && (
                          <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="flex animate-pulse items-center gap-3 rounded-lg bg-slate-50 p-3"
                              >
                                <div className="h-8 w-8 rounded-full bg-slate-200" />
                                <div className="h-4 flex-1 rounded bg-slate-200" />
                              </div>
                            ))}
                          </div>
                        )}

                        {lessonError && (
                          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-700">
                              {lessonError}
                            </p>
                            <button
                              type="button"
                              onClick={() => fetchCourseLessons(courseId)}
                              className="mt-3 text-sm font-semibold text-red-700 underline underline-offset-2"
                            >
                              Retry
                            </button>
                          </div>
                        )}

                        {!isLoadingThisCourse &&
                          !lessonError &&
                          lessons.length === 0 && (
                            <div className="rounded-lg bg-slate-50 px-4 py-6 text-center">
                              <p className="text-sm font-medium text-slate-600">
                                
                                Yet there is not any published lesson
                                available
                              </p>
                            </div>
                          )}

                        {!isLoadingThisCourse &&
                          !lessonError &&
                          lessons.length > 0 && (
                            <div className="space-y-2">
                              {lessons.map((lesson, index) => (
                                <div
                                  key={lesson._id}
                                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-[#D99B33]/50 hover:bg-[#D99B33]/5"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#132A4C] text-xs font-bold text-white">
                                    {lesson.order || index + 1}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#132A4C]">
                                      {lesson.title}
                                    </p>

                                    {lesson.description && (
                                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                        {lesson.description}
                                      </p>
                                    )}

                                    {lesson.duration && (
                                      <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                        <svg
                                          className="h-3.5 w-3.5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.8"
                                          aria-hidden="true"
                                        >
                                          <circle cx="12" cy="12" r="9" />
                                          <path d="M12 7v5l3 2" />
                                        </svg>
                                        {lesson.duration}
                                      </p>
                                    )}
                                  </div>

                                  {lesson.videoUrl && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label={`Open ${lesson.title}`}
                                      className="shrink-0 rounded-lg p-2 text-[#D99B33] transition hover:bg-[#D99B33]/10"
                                    >
                                      <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                      >
                                        <path d="m9 6 10 6-10 6z" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}