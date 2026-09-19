"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Edit3,
  Eye,
  Plus,
  Search,
  Users,
  Clock3,
  MoreVertical,
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  students: number;
  lessons: number;
  duration: string;
  price: string;
  status: "Published" | "Draft";
  featured: boolean;
};

const courses: Course[] = [
  {
    id: "quran-reading",
    title: "Learn Quran Reading",
    category: "Quran",
    level: "Beginner",
    students: 84,
    lessons: 24,
    duration: "8 weeks",
    price: "Free",
    status: "Published",
    featured: true,
  },
  {
    id: "quran-tajweed",
    title: "Quran with Tajweed",
    category: "Quran",
    level: "Intermediate",
    students: 62,
    lessons: 32,
    duration: "10 weeks",
    price: "$25",
    status: "Published",
    featured: true,
  },
  {
    id: "understanding-hadith",
    title: "Understanding Hadith",
    category: "Hadith",
    level: "Intermediate",
    students: 41,
    lessons: 20,
    duration: "6 weeks",
    price: "$20",
    status: "Published",
    featured: false,
  },
  {
    id: "arabic-basics",
    title: "Arabic Language Basics",
    category: "Arabic",
    level: "Beginner",
    students: 36,
    lessons: 28,
    duration: "8 weeks",
    price: "$30",
    status: "Published",
    featured: false,
  },
  {
    id: "advanced-tajweed",
    title: "Advanced Tajweed Workshop",
    category: "Tajweed",
    level: "Advanced",
    students: 18,
    lessons: 16,
    duration: "4 weeks",
    price: "$35",
    status: "Draft",
    featured: false,
  },
  {
    id: "fiqh-everyday",
    title: "Essential Fiqh for Muslims",
    category: "Fiqh",
    level: "Beginner",
    students: 7,
    lessons: 18,
    duration: "5 weeks",
    price: "$15",
    status: "Draft",
    featured: false,
  },
];

export default function TeacherCoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesStatus =
        status === "All" || course.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0
  );

  const publishedCourses = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Teaching
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            My Courses
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Manage the courses you teach on IlmHub.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">
                Total Courses
              </p>

              <p className="mt-2 text-3xl font-semibold text-stone-900">
                {courses.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Published
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {publishedCourses}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Live courses
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Drafts
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {draftCourses}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Not published yet
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Total Students
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {totalStudents}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Across all courses
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-48"
            >
              <option value="All">All Categories</option>
              <option value="Quran">Quran</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Hadith">Hadith</option>
              <option value="Arabic">Arabic</option>
              <option value="Fiqh">Fiqh</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-44"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      </section>

      {/* Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          Showing{" "}
          <span className="font-medium text-stone-900">
            {filteredCourses.length}
          </span>{" "}
          courses
        </p>
      </div>

      {/* Course Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
          >
            {/* Course Header */}
            <div className="relative flex h-36 items-center justify-center bg-stone-900">
              <BookOpen className="h-12 w-12 text-[#d6b56d]" />

              <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full bg-[#d6b56d] px-2.5 py-1 text-[10px] font-semibold text-stone-950">
                  {course.category}
                </span>

                {course.featured && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              <span
                className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  course.status === "Published"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {course.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-stone-900">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-xs text-stone-500">
                    {course.level} · {course.duration}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-stone-50 p-3">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-[11px]">
                      Students
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {course.students}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-3">
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="text-[11px]">
                      Lessons
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {course.lessons}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                <div>
                  <p className="text-[11px] text-stone-400">
                    Course Price
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-stone-900">
                    {course.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-stone-200 p-2 text-stone-500 transition hover:border-[#d6b56d] hover:text-stone-900"
                    title="View course"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-stone-900 p-2 text-[#d6b56d] transition hover:bg-stone-800"
                    title="Edit course"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-stone-300" />

          <h3 className="mt-4 font-semibold text-stone-900">
            No courses found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}