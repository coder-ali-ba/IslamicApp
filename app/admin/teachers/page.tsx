"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  GraduationCap,
  BookOpen,
  Video,
  Users,
  SlidersHorizontal,
} from "lucide-react";

const teachers = [
  {
    id: "muhammad-ahmed",
    name: "Ustadh Muhammad Ahmed",
    email: "muhammad@example.com",
    specialization: "Quran & Tajweed",
    courses: 4,
    classes: 3,
    students: 320,
    status: "Active",
  },
  {
    id: "abdul-rahman",
    name: "Ustadh Abdul Rahman",
    email: "abdul@example.com",
    specialization: "Tajweed",
    courses: 3,
    classes: 4,
    students: 285,
    status: "Active",
  },
  {
    id: "ibrahim-khan",
    name: "Dr. Ibrahim Khan",
    email: "ibrahim@example.com",
    specialization: "Hadith & Islamic Studies",
    courses: 5,
    classes: 2,
    students: 410,
    status: "Active",
  },
  {
    id: "omar-farooq",
    name: "Ustadh Omar Farooq",
    email: "omar@example.com",
    specialization: "Arabic Language",
    courses: 3,
    classes: 2,
    students: 156,
    status: "Active",
  },
  {
    id: "abdullah",
    name: "Mufti Abdullah",
    email: "abdullah@example.com",
    specialization: "Fiqh",
    courses: 2,
    classes: 1,
    students: 240,
    status: "Inactive",
  },
  {
    id: "hamza-malik",
    name: "Dr. Hamza Malik",
    email: "hamza@example.com",
    specialization: "Seerah & Islamic Studies",
    courses: 4,
    classes: 2,
    students: 210,
    status: "Active",
  },
];

export default function AdminTeachersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.email.toLowerCase().includes(search.toLowerCase()) ||
        teacher.specialization
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || teacher.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const totalStudents = teachers.reduce(
    (total, teacher) => total + teacher.students,
    0
  );

  const totalCourses = teachers.reduce(
    (total, teacher) => total + teacher.courses,
    0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">
            Management
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Teachers
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Manage instructors and their teaching activities.
          </p>
        </div>

        <Link
          href="/admin/teachers/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Total Teachers
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {teachers.length}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Active Teachers
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {activeTeachers}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Students Taught
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {totalStudents.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search teachers or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-8 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-44"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* Desktop */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Teacher
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Specialization
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Courses
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Classes
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
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="transition hover:bg-stone-50/60"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                        {teacher.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {teacher.name}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {teacher.specialization}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-stone-700">
                      <BookOpen className="h-4 w-4 text-stone-400" />
                      {teacher.courses}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-stone-700">
                      <Video className="h-4 w-4 text-stone-400" />
                      {teacher.classes}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-stone-700">
                      <Users className="h-4 w-4 text-stone-400" />
                      {teacher.students}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        teacher.status === "Active"
                          ? "text-emerald-700"
                          : "text-stone-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          teacher.status === "Active"
                            ? "bg-emerald-600"
                            : "bg-stone-300"
                        }`}
                      />
                      {teacher.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      aria-label={`Actions for ${teacher.name}`}
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
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                    {teacher.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {teacher.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-stone-500">
                      {teacher.specialization}
                    </p>
                  </div>
                </div>

                <button
                  aria-label={`Actions for ${teacher.name}`}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-400">
                    Courses
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    {teacher.courses}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-400">
                    Classes
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    {teacher.classes}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-400">
                    Students
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-800">
                    {teacher.students}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    teacher.status === "Active"
                      ? "text-emerald-700"
                      : "text-stone-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      teacher.status === "Active"
                        ? "bg-emerald-600"
                        : "bg-stone-300"
                    }`}
                  />
                  {teacher.status}
                </span>
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-stone-500">
              No teachers found.
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-400">
        Showing {filteredTeachers.length} of {teachers.length} teachers
      </p>
    </div>
  );
}