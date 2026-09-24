"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
};

type Course = {
  _id: string;
  title: string;
  category?: string;
  level?: string;
  price?: number;
  status?: string;
};

type Enrollment = {
  _id: string;
  student?: Student | null;
  course?: Course | null;
  createdAt: string;
  status?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<
    Enrollment[]
  >([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchEnrollments = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/enrollments/admin`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load enrollments"
        );
      }

      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error(
        "Admin Enrollments Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load enrollments"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return enrollments.filter((enrollment) => {
      const studentName =
        enrollment.student?.name?.toLowerCase() || "";

      const studentEmail =
        enrollment.student?.email?.toLowerCase() || "";

      const courseTitle =
        enrollment.course?.title?.toLowerCase() || "";

      const enrollmentStatus =
        enrollment.status || "Active";

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentEmail.includes(searchText) ||
        courseTitle.includes(searchText);

      const matchesStatus =
        status === "All" ||
        enrollmentStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [enrollments, search, status]);

  const totalEnrollments =
    enrollments.length;

  const activeEnrollments =
    enrollments.filter(
      (item) =>
        !item.status ||
        item.status === "Active"
    ).length;

  const completedEnrollments =
    enrollments.filter(
      (item) => item.status === "Completed"
    ).length;

  const cancelledEnrollments =
    enrollments.filter(
      (item) => item.status === "Cancelled"
    ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getStatus = (
    enrollment: Enrollment
  ) => {
    return enrollment.status || "Active";
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#967438]">
              Admin Panel
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
              Enrollments
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage students enrolled in IlmHub courses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchEnrollments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-[#d6b56d] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start justify-between gap-4">
              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  fetchEnrollments()
                }
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Enrollments"
            value={totalEnrollments}
            icon="◎"
          />

          <StatCard
            label="Active"
            value={activeEnrollments}
            icon="✓"
          />

          <StatCard
            label="Completed"
            value={completedEnrollments}
            icon="◆"
          />

          <StatCard
            label="Cancelled"
            value={cancelledEnrollments}
            icon="×"
          />
        </div>

        {/* FILTERS */}
        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search student, email or course..."
                className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#b99a5b] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <div className="lg:w-56">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 text-sm text-stone-900 outline-none focus:border-[#b99a5b]"
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">
                  All Enrollments
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {filteredEnrollments.length}{" "}
                  enrollment
                  {filteredEnrollments.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingTable />
          ) : filteredEnrollments.length === 0 ? (
            <EmptyState
              hasFilters={
                search.trim() !== "" ||
                status !== "All"
              }
              onReset={() => {
                setSearch("");
                setStatus("All");
              }}
            />
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-[#faf9f6] text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Student
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Course
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Enrolled
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {filteredEnrollments.map(
                      (enrollment) => {
                        const currentStatus =
                          getStatus(enrollment);

                        return (
                          <tr
                            key={enrollment._id}
                            className="transition hover:bg-[#faf9f6]"
                          >
                            {/* STUDENT */}
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#27251f] text-sm font-semibold text-[#d6b56d]">
                                  {enrollment.student?.name
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    "?"}
                                </div>

                                <div>
                                  <p className="font-semibold text-stone-800">
                                    {enrollment.student
                                      ?.name ||
                                      "Unknown Student"}
                                  </p>

                                  <p className="mt-1 text-xs text-stone-500">
                                    {enrollment.student
                                      ?.email ||
                                      "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* COURSE */}
                            <td className="px-6 py-5">
                              <p className="font-semibold text-stone-800">
                                {enrollment.course
                                  ?.title ||
                                  "Unknown Course"}
                              </p>

                              {enrollment.course
                                ?.level && (
                                <p className="mt-1 text-xs text-stone-500">
                                  {
                                    enrollment
                                      .course
                                      .level
                                  }
                                </p>
                              )}
                            </td>

                            {/* CATEGORY */}
                            <td className="px-6 py-5">
                              {enrollment.course
                                ?.category ? (
                                <span className="inline-flex rounded-full bg-[#f4ead2] px-3 py-1 text-xs font-semibold text-[#80672f]">
                                  {
                                    enrollment
                                      .course
                                      .category
                                  }
                                </span>
                              ) : (
                                <span className="text-sm text-stone-400">
                                  —
                                </span>
                              )}
                            </td>

                            {/* DATE */}
                            <td className="px-6 py-5 text-sm text-stone-600">
                              {formatDate(
                                enrollment.createdAt
                              )}
                            </td>

                            {/* STATUS */}
                            <td className="px-6 py-5">
                              <StatusBadge
                                status={
                                  currentStatus
                                }
                              />
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-stone-100 md:hidden">
                {filteredEnrollments.map(
                  (enrollment) => {
                    const currentStatus =
                      getStatus(enrollment);

                    return (
                      <div
                        key={enrollment._id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#27251f] text-sm font-semibold text-[#d6b56d]">
                              {enrollment.student?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "?"}
                            </div>

                            <div>
                              <p className="font-semibold text-stone-800">
                                {enrollment.student
                                  ?.name ||
                                  "Unknown Student"}
                              </p>

                              <p className="text-xs text-stone-500">
                                {enrollment.student
                                  ?.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>

                          <StatusBadge
                            status={currentStatus}
                          />
                        </div>

                        <div className="mt-5 rounded-xl bg-[#faf9f6] p-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                            Course
                          </p>

                          <p className="mt-1 font-semibold text-stone-800">
                            {enrollment.course
                              ?.title ||
                              "Unknown Course"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {enrollment.course
                              ?.category && (
                              <span className="rounded-full bg-[#f4ead2] px-2.5 py-1 text-xs font-semibold text-[#80672f]">
                                {
                                  enrollment
                                    .course
                                    .category
                                }
                              </span>
                            )}

                            {enrollment.course
                              ?.level && (
                              <span className="text-xs text-stone-500">
                                {
                                  enrollment
                                    .course
                                    .level
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-stone-500">
                          Enrolled on{" "}
                          <span className="font-medium text-stone-700">
                            {formatDate(
                              enrollment.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* ================================
   STAT CARD
================================ */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4ead2] text-lg font-semibold text-[#80672f]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold text-stone-900">
        {value}
      </p>
    </div>
  );
}

/* ================================
   STATUS BADGE
================================ */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  let classes =
    "bg-stone-100 text-stone-600";

  if (normalized === "active") {
    classes =
      "bg-emerald-50 text-emerald-700";
  }

  if (normalized === "completed") {
    classes =
      "bg-[#f4ead2] text-[#80672f]";
  }

  if (normalized === "cancelled") {
    classes =
      "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

/* ================================
   LOADING
================================ */

function LoadingTable() {
  return (
    <div className="animate-pulse divide-y divide-stone-100">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center gap-6 p-6"
        >
          <div className="h-10 w-10 rounded-full bg-stone-200" />

          <div className="flex-1">
            <div className="h-4 w-40 rounded bg-stone-200" />
            <div className="mt-2 h-3 w-28 rounded bg-stone-200" />
          </div>

          <div className="hidden h-4 w-36 rounded bg-stone-200 sm:block" />

          <div className="hidden h-4 w-24 rounded bg-stone-200 sm:block" />

          <div className="h-6 w-16 rounded-full bg-stone-200" />
        </div>
      ))}
    </div>
  );
}

/* ================================
   EMPTY
================================ */

function EmptyState({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4ead2] text-2xl text-[#80672f]">
        ◎
      </div>

      <h3 className="mt-5 text-xl font-semibold text-stone-900">
        {hasFilters
          ? "No Enrollments Found"
          : "No Enrollments Yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Student course enrollments will appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-xl bg-[#27251f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3a372f]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}