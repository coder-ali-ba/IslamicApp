"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  BookOpen,
  Users,
  Clock3,
  Star,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

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
  status: "Published" | "Draft";
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch all courses for admin
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/admin`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch courses");
        }

        const formattedCourses: AdminCourse[] = (data.courses || []).map(
          (course: any) => ({
            id: course._id,
            title: course.title,
            category: course.category,
            level: course.level,
            instructor: course.instructor?.name || "No Instructor",
            students: course.students ?? 0,
            lessons: course.lessons ?? 0,
            duration: course.duration || "N/A",
            price: course.price ?? 0,
            status: course.status,
          }),
        );

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Fetch Admin Courses Error:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load courses",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesLevel = level === "All" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const publishedCount = courses.filter(
    (course) => course.status === "Published",
  ).length;

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0,
  );

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseTitle}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(courseId);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Delete Course Error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to delete course",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">Management</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Courses
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Create, organize, and manage your Islamic courses.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">Total Courses</p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {loading ? "—" : courses.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">Published</p>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Star className="h-5 w-5" />
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {loading ? "—" : publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">Enrolled Students</p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {loading ? "—" : totalStudents.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-8 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-40"
            >
              <option value="All">All Categories</option>
              <option value="Quran">Quran</option>
              <option value="Hadith">Hadith</option>
              <option value="Arabic">Arabic</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Seerah">Seerah</option>
              <option value="Islamic Studies">Islamic Studies</option>
            </select>
          </div>

          {/* Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-40"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-800">Failed to load courses</p>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr
                    key={item}
                    className="animate-pulse border-b border-stone-100"
                  >
                    <td className="px-6 py-6">
                      <div className="h-5 w-64 rounded bg-stone-200" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-5 w-20 rounded bg-stone-200" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-5 w-32 rounded bg-stone-200" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-5 w-16 rounded bg-stone-200" />
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-6 w-20 rounded-full bg-stone-200" />
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-stone-100 lg:hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse p-5">
                <div className="h-5 w-2/3 rounded bg-stone-200" />
                <div className="mt-3 h-4 w-1/3 rounded bg-stone-200" />
                <div className="mt-4 h-5 w-1/2 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Course
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Instructor
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Students
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="transition hover:bg-stone-50/60"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                            <BookOpen className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-stone-900">
                              {course.title}
                            </p>

                            <div className="mt-1 flex items-center gap-3 text-xs text-stone-400">
                              <span className="flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {course.duration}
                              </span>

                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                            {course.category}
                          </span>

                          <p className="mt-2 text-xs text-stone-400">
                            {course.level}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-stone-600">
                        {course.instructor}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-sm text-stone-700">
                          <Users className="h-4 w-4 text-stone-400" />
                          {course.students}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            course.status === "Published"
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            aria-label={`Edit ${course.title}`}
                            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            aria-label={`Delete ${course.title}`}
                            onClick={() =>
                              handleDeleteCourse(course.id, course.title)
                            }
                            disabled={deletingId === course.id}
                            className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === course.id ? (
                              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-red-500" />
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

            {/* Mobile */}
            <div className="divide-y divide-stone-100 lg:hidden">
              {filteredCourses.map((course) => (
                <div key={course.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          {course.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-stone-500">
                          {course.instructor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        aria-label={`Edit ${course.title}`}
                        className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        aria-label={`Delete ${course.title}`}
                        onClick={() =>
                          handleDeleteCourse(course.id, course.title)
                        }
                        disabled={deletingId === course.id}
                        className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === course.id ? (
                          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                      {course.category}
                    </span>

                    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-500">
                      {course.level}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        course.status === "Published"
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {course.students} students
                    </span>

                    <span>{course.lessons} lessons</span>

                    <span>Rs. {course.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {filteredCourses.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-stone-500">
                  No courses found.
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </>
      )}
    </div>
  );
}
