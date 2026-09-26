"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type StudentClass = {
  enrollmentId: string;
  classId: string;
  title: string;
  category: string;
  level: string;
  scheduledAt: string;
  classStatus: string;
  enrollmentStatus: "Registered" | "Attended" | "Cancelled";
  registeredAt: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  classes: StudentClass[];
  enrollmentCount: number;
  registeredCount: number;
  attendedCount: number;
  cancelledCount: number;
  latestRegisteredAt: string;
};

type TeacherClass = {
  _id: string;
  title: string;
  category: string;
  level: string;
  scheduledAt: string;
  status: string;
};

type Stats = {
  totalStudents: number;
  registered: number;
  attended: number;
  cancelled: number;
};

type ApiResponse = {
  success: boolean;
  students: Student[];
  classes: TeacherClass[];
  stats: Stats;
  message?: string;
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    registered: 0,
    attended: 0,
    cancelled: 0,
  });

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/teacher/students`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch students"
        );
      }

      setStudents(data.students || []);
      setClasses(data.classes || []);
      setStats(
        data.stats || {
          totalStudents: 0,
          registered: 0,
          attended: 0,
          cancelled: 0,
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        student.name.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue);

      const matchesClass =
        classFilter === "all" ||
        student.classes.some(
          (item) => item.classId === classFilter
        );

      const matchesStatus =
        statusFilter === "all" ||
        student.classes.some(
          (item) => item.enrollmentStatus === statusFilter
        );

      return (
        matchesSearch &&
        matchesClass &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    classFilter,
    statusFilter,
  ]);

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Registered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Attended":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-stone-50 text-stone-600 border-stone-200";
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-stone-500">
              <Link
                href="/teacher/dashboard"
                className="transition hover:text-[#967438]"
              >
                Dashboard
              </Link>

              <span>/</span>

              <span className="text-stone-700">
                Students
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[#132A4C] sm:text-3xl">
              My Students
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage students enrolled in your classes.
            </p>
          </div>

          <button
            onClick={fetchStudents}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 shadow-sm transition hover:border-[#d6b56d] hover:text-[#967438] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h5M20 20v-5h-5M5.5 15a7 7 0 0011.9 1.9L20 15M18.5 9A7 7 0 006.6 7.1L4 9"
              />
            </svg>

            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Students"
            value={stats.totalStudents}
            icon="users"
          />

          <StatCard
            label="Registered"
            value={stats.registered}
            icon="registered"
          />

          <StatCard
            label="Attended"
            value={stats.attended}
            icon="attended"
          />

          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            icon="cancelled"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <path
                  strokeLinecap="round"
                  d="m20 20-4-4"
                />
              </svg>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search students by name or email..."
                className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* Class */}
            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value)
              }
              className="h-11 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-sm text-stone-700 outline-none focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="all">
                All Classes
              </option>

              {classes.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.title}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-11 rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-sm text-stone-700 outline-none focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="all">
                All Status
              </option>
              <option value="Registered">
                Registered
              </option>
              <option value="Attended">
                Attended
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-700">
              {filteredStudents.length}
            </span>{" "}
            students
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingState />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            hasFilters={
              Boolean(search) ||
              classFilter !== "all" ||
              statusFilter !== "all"
            }
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-[#faf9f6]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Student
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Classes
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {filteredStudents.map(
                      (student) => (
                        <tr
                          key={student.id}
                          className="transition hover:bg-[#faf9f6]/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={student.name}
                              />

                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#132A4C]">
                                  {student.name}
                                </p>

                                <p className="truncate text-xs text-stone-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="max-w-[260px]">
                              <p className="text-sm font-medium text-stone-700">
                                {student.classes.length}{" "}
                                {student.classes.length ===
                                1
                                  ? "class"
                                  : "classes"}
                              </p>

                              <p className="mt-1 truncate text-xs text-stone-500">
                                {student.classes
                                  .map(
                                    (item) =>
                                      item.title
                                  )
                                  .join(", ")}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                student.registeredCount >
                                0
                                  ? "Registered"
                                  : student.attendedCount >
                                    0
                                  ? "Attended"
                                  : "Cancelled"
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-sm text-stone-600">
                            {formatDate(
                              student.latestRegisteredAt
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/teacher/students/${student.id}`}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 px-3 text-sm font-medium text-stone-700 transition hover:border-[#d6b56d] hover:text-[#967438]"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {filteredStudents.map(
                (student) => (
                  <div
                    key={student.id}
                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={student.name}
                        />

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#132A4C]">
                            {student.name}
                          </p>

                          <p className="truncate text-xs text-stone-500">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          student.registeredCount > 0
                            ? "Registered"
                            : student.attendedCount > 0
                            ? "Attended"
                            : "Cancelled"
                        }
                      />
                    </div>

                    <div className="mt-4 border-t border-stone-100 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-stone-400">
                            Classes
                          </p>

                          <p className="mt-1 text-sm font-medium text-stone-700">
                            {student.classes.length}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-stone-400">
                            Joined
                          </p>

                          <p className="mt-1 text-sm font-medium text-stone-700">
                            {formatDate(
                              student.latestRegisteredAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-stone-400">
                          Enrolled Classes
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {student.classes
                            .slice(0, 3)
                            .map((item) => (
                              <span
                                key={
                                  item.enrollmentId
                                }
                                className="rounded-lg bg-[#faf9f6] px-2.5 py-1 text-xs text-stone-600"
                              >
                                {item.title}
                              </span>
                            ))}

                          {student.classes.length >
                            3 && (
                            <span className="rounded-lg bg-[#faf9f6] px-2.5 py-1 text-xs text-stone-500">
                              +
                              {student.classes
                                .length - 3}{" "}
                              more
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-[#132A4C] text-sm font-medium text-white transition hover:bg-[#1b385f]"
                      >
                        View Student
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}


/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "users" | "registered" | "attended" | "cancelled";
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#132A4C] sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf9f6] text-[#967438]">
          {icon === "users" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />
              <path
                strokeLinecap="round"
                d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
          )}

          {icon === "registered" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l4 4L19 6"
              />
            </svg>
          )}

          {icon === "attended" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                d="M4 12l5 5L20 6"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
              />
            </svg>
          )}

          {icon === "cancelled" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path
                strokeLinecap="round"
                d="m9 9 6 6M15 9l-6 6"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}


function Avatar({
  name,
}: {
  name: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#132A4C] text-xs font-semibold text-white">
      {initials}
    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: string;
}) {
  const classes =
    status === "Registered"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : status === "Attended"
      ? "border-blue-100 bg-blue-50 text-blue-700"
      : "border-red-100 bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}


function LoadingState() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-[#967438]" />

        <p className="mt-4 text-sm text-stone-500">
          Loading students...
        </p>
      </div>
    </div>
  );
}


function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf9f6] text-[#967438]">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
            />
            <circle cx="9" cy="7" r="4" />
            <path
              strokeLinecap="round"
              d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            />
          </svg>
        </div>

        <h3 className="mt-4 font-semibold text-[#132A4C]">
          {hasFilters
            ? "No students found"
            : "No students yet"}
        </h3>

        <p className="mt-1 text-sm leading-6 text-stone-500">
          {hasFilters
            ? "Try changing your search or filters."
            : "Students enrolled in your classes will appear here."}
        </p>
      </div>
    </div>
  );
}