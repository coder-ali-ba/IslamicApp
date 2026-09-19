"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

const courses = [
  {
    id: "learn-quran-reading",
    title: "Learn Quran Reading",
    category: "Quran",
    level: "Beginner",
    instructor: "Ustadh Muhammad Ahmed",
    students: 320,
    lessons: 24,
    duration: "8 Weeks",
    rating: 4.9,
    status: "Published",
  },
  {
    id: "quran-with-tajweed",
    title: "Quran with Tajweed",
    category: "Quran",
    level: "Intermediate",
    instructor: "Ustadh Abdul Rahman",
    students: 285,
    lessons: 32,
    duration: "10 Weeks",
    rating: 4.8,
    status: "Published",
  },
  {
    id: "understanding-hadith",
    title: "Understanding Hadith",
    category: "Hadith",
    level: "Intermediate",
    instructor: "Dr. Ibrahim Khan",
    students: 190,
    lessons: 28,
    duration: "8 Weeks",
    rating: 4.7,
    status: "Published",
  },
  {
    id: "arabic-language-basics",
    title: "Arabic Language Basics",
    category: "Arabic",
    level: "Beginner",
    instructor: "Ustadh Omar Farooq",
    students: 156,
    lessons: 30,
    duration: "12 Weeks",
    rating: 4.8,
    status: "Draft",
  },
  {
    id: "essential-fiqh",
    title: "Essential Fiqh for Muslims",
    category: "Fiqh",
    level: "Beginner",
    instructor: "Mufti Abdullah",
    students: 240,
    lessons: 20,
    duration: "6 Weeks",
    rating: 4.9,
    status: "Published",
  },
  {
    id: "life-of-prophet",
    title: "Life of the Prophet ﷺ",
    category: "Seerah",
    level: "Intermediate",
    instructor: "Dr. Hamza Malik",
    students: 210,
    lessons: 26,
    duration: "8 Weeks",
    rating: 4.8,
    status: "Published",
  },
];

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

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
  }, [search, category, level]);

  const publishedCount = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0
  );

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
            {courses.length}
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
            {publishedCount}
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
            {totalStudents.toLocaleString()}
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

      {/* Desktop Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
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
                    <button
                      aria-label={`Actions for ${course.title}`}
                      className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
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

                <button
                  aria-label={`Actions for ${course.title}`}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
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

                <span>{course.rating} ★</span>
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
    </div>
  );
}