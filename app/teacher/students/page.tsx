"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Mail,
  MoreVertical,
  Search,
  Users,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  enrolledDate: string;
  progress: number;
  status: "Active" | "Completed" | "Inactive";
};

const students: Student[] = [
  {
    id: "STU-1001",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    course: "Learn Quran Reading",
    enrolledDate: "18 Sep 2026",
    progress: 72,
    status: "Active",
  },
  {
    id: "STU-1002",
    name: "Fatima Ali",
    email: "fatima.ali@example.com",
    course: "Quran with Tajweed",
    enrolledDate: "17 Sep 2026",
    progress: 64,
    status: "Active",
  },
  {
    id: "STU-1003",
    name: "Usman Malik",
    email: "usman.malik@example.com",
    course: "Understanding Hadith",
    enrolledDate: "16 Sep 2026",
    progress: 48,
    status: "Active",
  },
  {
    id: "STU-1004",
    name: "Ayesha Noor",
    email: "ayesha.noor@example.com",
    course: "Arabic Language Basics",
    enrolledDate: "15 Sep 2026",
    progress: 91,
    status: "Completed",
  },
  {
    id: "STU-1005",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    course: "Essential Fiqh for Muslims",
    enrolledDate: "13 Sep 2026",
    progress: 35,
    status: "Active",
  },
  {
    id: "STU-1006",
    name: "Maryam Hassan",
    email: "maryam.hassan@example.com",
    course: "Learn Quran Reading",
    enrolledDate: "10 Sep 2026",
    progress: 100,
    status: "Completed",
  },
  {
    id: "STU-1007",
    name: "Hassan Raza",
    email: "hassan.raza@example.com",
    course: "Quran with Tajweed",
    enrolledDate: "08 Sep 2026",
    progress: 21,
    status: "Active",
  },
  {
    id: "STU-1008",
    name: "Sana Ahmed",
    email: "sana.ahmed@example.com",
    course: "Understanding Hadith",
    enrolledDate: "05 Sep 2026",
    progress: 12,
    status: "Inactive",
  },
];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue) ||
        student.course.toLowerCase().includes(searchValue);

      const matchesCourse =
        course === "All" || student.course === course;

      const matchesStatus =
        status === "All" || student.status === status;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [search, course, status]);

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const completedStudents = students.filter(
    (student) => student.status === "Completed"
  ).length;

  const averageProgress = Math.round(
    students.reduce(
      (total, student) => total + student.progress,
      0
    ) / students.length
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
          Students
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
          My Students
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          View and manage students enrolled in your courses.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">
                Total Students
              </p>

              <p className="mt-2 text-3xl font-semibold text-stone-900">
                {students.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Active Students
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {activeStudents}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Currently learning
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {completedStudents}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Course completions
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Average Progress
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {averageProgress}%
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Across all students
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
              placeholder="Search students, email or course..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Course */}
          <div className="relative">
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-56"
            >
              <option value="All">All Courses</option>
              <option value="Learn Quran Reading">
                Learn Quran Reading
              </option>
              <option value="Quran with Tajweed">
                Quran with Tajweed
              </option>
              <option value="Understanding Hadith">
                Understanding Hadith
              </option>
              <option value="Arabic Language Basics">
                Arabic Language Basics
              </option>
              <option value="Essential Fiqh for Muslims">
                Essential Fiqh for Muslims
              </option>
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
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Inactive">Inactive</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      </section>

      {/* Result Count */}
      <p className="text-sm text-stone-500">
        Showing{" "}
        <span className="font-medium text-stone-900">
          {filteredStudents.length}
        </span>{" "}
        students
      </p>

      {/* Desktop Table */}
      <section className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Enrolled</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition hover:bg-stone-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-[#d6b56d]">
                        {student.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {student.name}
                        </p>

                        <p className="mt-0.5 text-xs text-stone-500">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#967438]" />

                      <span className="text-sm text-stone-700">
                        {student.course}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-stone-600">
                    {student.enrolledDate}
                  </td>

                  <td className="px-5 py-4">
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-stone-500">
                          Progress
                        </span>

                        <span className="font-medium text-stone-800">
                          {student.progress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-[#d6b56d]"
                          style={{
                            width: `${student.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={student.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                      title="Student options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile Cards */}
      <section className="grid gap-4 lg:hidden">
        {filteredStudents.map((student) => (
          <article
            key={student.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-[#d6b56d]">
                  {student.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {student.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                    <Mail className="h-3 w-3" />
                    {student.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-900"
                aria-label="Student options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-stone-50 p-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#967438]" />

                <p className="text-sm font-medium text-stone-800">
                  {student.course}
                </p>
              </div>

              <p className="mt-2 text-xs text-stone-500">
                Enrolled {student.enrolledDate}
              </p>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-stone-500">
                  Course Progress
                </span>

                <span className="font-medium text-stone-800">
                  {student.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-[#d6b56d]"
                  style={{
                    width: `${student.progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <StatusBadge status={student.status} />
            </div>
          </article>
        ))}
      </section>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <Users className="mx-auto h-10 w-10 text-stone-300" />

          <h3 className="mt-4 font-semibold text-stone-900">
            No students found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Student["status"];
}) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Completed: "bg-stone-100 text-stone-700",
    Inactive: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}