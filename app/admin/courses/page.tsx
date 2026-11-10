"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Clock3,
  Star,
  SlidersHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

type CourseStatus = "Published" | "Draft";

type AdminCourse = {
  id: string;
  title: string;
  category: string;
  level: string;
  instructor: string;
  students: number;
  lessons: number;
  duration: string;
  price: number;
  status: CourseStatus;
};

type ApiCourse = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  level?: string;
  instructor?: { name?: string } | string | null;
  students?: number;
  enrolledStudents?: number;
  enrollments?: unknown[];
  lessons?: number | unknown[];
  modules?: unknown[];
  duration?: string | number;
  price?: number;
  status?: string;
  isPublished?: boolean;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
)
  .trim()
  .replace(/\/+$/, "");

function apiUrl(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const baseHasApiSuffix = /\/api$/i.test(API_BASE);

  return `${API_BASE}${baseHasApiSuffix ? "" : "/api"}/${cleanPath}`;
}

function numberValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function countValue(value: unknown, fallback?: unknown): number {
  if (Array.isArray(value)) return value.length;

  if (value !== undefined && value !== null && value !== "") {
    return numberValue(value);
  }

  if (Array.isArray(fallback)) return fallback.length;

  return numberValue(fallback);
}

function normalizeStatus(course: ApiCourse): CourseStatus {
  if (course.isPublished === true) return "Published";

  const status = String(course.status || "").toLowerCase();

  return status === "published" || status === "active"
    ? "Published"
    : "Draft";
}

function normalizeCourse(course: ApiCourse): AdminCourse {
  const instructor =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.name;

  return {
    id: String(course._id || course.id || ""),
    title: course.title || course.name || "Untitled course",
    category: course.category || "Uncategorized",
    level: course.level || "All levels",
    instructor: instructor || "No Instructor",
    students: countValue(
      course.students,
      course.enrolledStudents ?? course.enrollments
    ),
    lessons: countValue(course.lessons, course.modules),
    duration:
      course.duration === undefined ||
      course.duration === null ||
      course.duration === ""
        ? "N/A"
        : String(course.duration),
    price: numberValue(course.price),
    status: normalizeStatus(course),
  };
}

async function readApiResponse(response: Response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("courses/admin"), {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to fetch courses (${response.status})`
        );
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.courses)
          ? data.courses
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.courses)
              ? data.data.courses
              : [];

      const formattedCourses = list
        .map((course: ApiCourse) => normalizeCourse(course))
        .filter((course: AdminCourse) => course.id);

      setCourses(formattedCourses);
    } catch (err) {
      console.error("Fetch Admin Courses Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load courses. Please check your API connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          courses
            .map((course) => course.category)
            .filter(Boolean)
        )
      ).sort(),
    [courses]
  );

  const levels = useMemo(
    () =>
      Array.from(
        new Set(
          courses.map((course) => course.level).filter(Boolean)
        )
      ).sort(),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !term ||
        course.title.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesLevel =
        level === "All" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const publishedCount = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0
  );

  const handleDeleteCourse = async (
    courseId: string,
    courseTitle: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(courseId);
    setError("");

    try {
      const response = await fetch(
        apiUrl(`courses/${encodeURIComponent(courseId)}`),
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to delete course (${response.status})`
        );
      }

      setCourses((previous) =>
        previous.filter((course) => course.id !== courseId)
      );
    } catch (err) {
      console.error("Delete Course Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete course."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">
            Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Courses
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Create, organize, and manage your Islamic courses.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#d6b56d] focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Courses"
          value={loading ? "—" : courses.length.toLocaleString()}
          icon={<BookOpen className="h-5 w-5" />}
        />

        <StatCard
          label="Published"
          value={loading ? "—" : publishedCount.toLocaleString()}
          icon={<Star className="h-5 w-5" />}
        />

        <StatCard
          label="Enrolled Students"
          value={loading ? "—" : totalStudents.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 break-words">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchCourses()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 font-medium text-red-800 transition hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="search"
              placeholder="Search courses or instructors..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search courses or instructors"
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-8 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-44"
            >
              <option value="All">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            aria-label="Filter by level"
            className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-40"
          >
            <option value="All">All Levels</option>

            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {(search || category !== "All" || level !== "All") && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
            <p className="text-xs text-stone-500">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#967438] transition hover:text-stone-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Courses Table */}
      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-stone-900">
              All Courses
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              {loading
                ? "Loading courses…"
                : `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"} found`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchCourses()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div
            className="space-y-3 p-5"
            aria-label="Loading courses"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-stone-100"
              />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
              <GraduationCap className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-semibold text-stone-900">
              {courses.length === 0
                ? "No courses yet"
                : "No matching courses"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-stone-500">
              {courses.length === 0
                ? "Add your first course to start building your course library."
                : "Try changing your search or filters to find a course."}
            </p>

            {courses.length === 0 ? (
              <Link
                href="/admin/courses/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
                Add Course
              </Link>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#faf9f6]">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    <th className="px-5 py-3.5">Course</th>
                    <th className="px-4 py-3.5">Instructor</th>
                    <th className="px-4 py-3.5">Level</th>
                    <th className="px-4 py-3.5">Students</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="transition hover:bg-[#fdfcf9]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f0e5] text-[#967438]">
                            <BookOpen className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/courses/${encodeURIComponent(course.id)}`}
                              className="block max-w-[280px] truncate text-sm font-semibold text-stone-900 hover:text-[#967438]"
                            >
                              {course.title}
                            </Link>

                            <p className="mt-1 text-xs text-stone-500">
                              {course.category} · {course.lessons} lessons ·{" "}
                              {course.duration}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-stone-600">
                        {course.instructor}
                      </td>

                      <td className="px-4 py-4 text-sm text-stone-600">
                        {course.level}
                      </td>

                      <td className="px-4 py-4 text-sm tabular-nums text-stone-600">
                        {course.students.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-stone-800">
                        {course.price === 0
                          ? "Free"
                          : `Rs. ${course.price.toLocaleString()}`}
                      </td>

                      <td className="px-4 py-4">
                        <StatusPill status={course.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/courses/${encodeURIComponent(course.id)}/edit`}
                            title="Edit course"
                            aria-label={`Edit ${course.title}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteCourse(
                                course.id,
                                course.title
                              )
                            }
                            disabled={deletingId === course.id}
                            title="Delete course"
                            aria-label={`Delete ${course.title}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === course.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-stone-100 md:hidden">
              {filteredCourses.map((course) => (
                <article key={course.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f0e5] text-[#967438]">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/admin/courses/${encodeURIComponent(course.id)}`}
                          className="font-semibold text-stone-900 hover:text-[#967438]"
                        >
                          {course.title}
                        </Link>

                        <StatusPill status={course.status} />
                      </div>

                      <p className="mt-1 text-xs text-stone-500">
                        {course.category} · {course.level}
                      </p>

                      <p className="mt-2 text-sm text-stone-600">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#faf9f6] p-3">
                    <MobileMetric
                      icon={<Users className="h-3.5 w-3.5" />}
                      label="Students"
                      value={course.students.toLocaleString()}
                    />

                    <MobileMetric
                      icon={<BookOpen className="h-3.5 w-3.5" />}
                      label="Lessons"
                      value={String(course.lessons)}
                    />

                    <MobileMetric
                      icon={<Clock3 className="h-3.5 w-3.5" />}
                      label="Duration"
                      value={course.duration}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-900">
                      {course.price === 0
                        ? "Free"
                        : `Rs. ${course.price.toLocaleString()}`}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${encodeURIComponent(course.id)}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteCourse(
                            course.id,
                            course.title
                          )
                        }
                        disabled={deletingId === course.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === course.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{label}</p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold text-stone-900">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: CourseStatus }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function MobileMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-stone-400">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-stone-800">
        {value}
      </p>
    </div>
  );
}