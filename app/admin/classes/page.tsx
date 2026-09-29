"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* ================================================================
   TYPES
================================================================ */

type ClassStatus =
  | "Upcoming"
  | "Live"
  | "Completed"
  | "Cancelled";

type ClassCategory =
  | "Quran"
  | "Tajweed"
  | "Arabic"
  | "Hadith"
  | "Fiqh"
  | "Seerah"
  | "Islamic Studies";

type ClassLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
  isActive?: boolean;
  isVerified?: boolean;
};

type ClassItem = {
  _id: string;
  id: string;

  title: string;
  description?: string;

  category: ClassCategory;
  level: ClassLevel;

  teacher: Teacher | null;

  scheduledAt: string;

  durationMinutes: number;
  duration: string;

  maxStudents: number;

  meetingUrl?: string;

  // Dynamic class content
  learningOutcomes?: string[];
  topics?: string[];
  requirements?: string[];

  status: ClassStatus;

  students: number;

  createdAt?: string;
  updatedAt?: string;
};

/* ================================================================
   API
================================================================ */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* ================================================================
   PAGE
================================================================ */

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ==============================================================
     FETCH CLASSES
  ============================================================== */

  const fetchClasses = async (
    showRefreshLoader = false
  ) => {
    try {
      setError("");

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "All") {
        params.set("category", category);
      }

      if (status !== "All") {
        params.set("status", status);
      }

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/classes/admin${
          queryString ? `?${queryString}` : ""
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch classes"
        );
      }

      setClasses(data.classes || []);
    } catch (error) {
      console.error(
        "Fetch admin classes error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch classes"
      );

      setClasses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ==============================================================
     INITIAL FETCH
  ============================================================== */

  useEffect(() => {
    fetchClasses();
  }, [category, status]);

  /* ==============================================================
     SEARCH
  ============================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ==============================================================
     STATS
  ============================================================== */

  const totalStudents = useMemo(() => {
    return classes.reduce(
      (total, item) => total + (item.students || 0),
      0
    );
  }, [classes]);

  const liveClasses = useMemo(() => {
    return classes.filter(
      (item) => item.status === "Live"
    ).length;
  }, [classes]);

  const upcomingClasses = useMemo(() => {
    return classes.filter(
      (item) => item.status === "Upcoming"
    ).length;
  }, [classes]);

  /* ==============================================================
     FORMAT DATE
  ============================================================== */

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ==============================================================
     FORMAT TIME
  ============================================================== */

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /* ==============================================================
     CONTENT COUNTS
  ============================================================== */

  const getContentCount = (item: ClassItem) => {
    const learningOutcomes = Array.isArray(
      item.learningOutcomes
    )
      ? item.learningOutcomes.filter(Boolean).length
      : 0;

    const topics = Array.isArray(item.topics)
      ? item.topics.filter(Boolean).length
      : 0;

    const requirements = Array.isArray(
      item.requirements
    )
      ? item.requirements.filter(Boolean).length
      : 0;

    return {
      learningOutcomes,
      topics,
      requirements,
    };
  };

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Class Management
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Live Classes
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage live Islamic classes, schedules,
              teachers, and students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchClasses(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <Link
              href="/admin/classes/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" />

              Add Class
            </Link>
          </div>
        </div>

        {/* ========================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => fetchClasses(true)}
              className="font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* ========================================================
            STATS
        ======================================================== */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Video className="h-5 w-5" />}
            label="Total Classes"
            value={classes.length}
          />

          <StatCard
            icon={<Video className="h-5 w-5" />}
            label="Live Now"
            value={liveClasses}
          />

          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Upcoming"
            value={upcomingClasses}
          />

          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Enrollments"
            value={totalStudents}
          />
        </div>

        {/* ========================================================
            FILTERS
        ======================================================== */}

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search classes or teachers..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* Category */}

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">
                All Categories
              </option>

              <option value="Quran">
                Quran
              </option>

              <option value="Tajweed">
                Tajweed
              </option>

              <option value="Arabic">
                Arabic
              </option>

              <option value="Hadith">
                Hadith
              </option>

              <option value="Fiqh">
                Fiqh
              </option>

              <option value="Seerah">
                Seerah
              </option>

              <option value="Islamic Studies">
                Islamic Studies
              </option>
            </select>

            {/* Status */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">
                All Status
              </option>

              <option value="Live">
                Live
              </option>

              <option value="Upcoming">
                Upcoming
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

        {/* ========================================================
            RESULT COUNT
        ======================================================== */}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {classes.length}
            </span>{" "}
            {classes.length === 1
              ? "class"
              : "classes"}
          </p>
        </div>

        {/* ========================================================
            LOADING
        ======================================================== */}

        {loading ? (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#967438]" />

            <p className="mt-4 text-sm text-stone-500">
              Loading classes...
            </p>
          </div>
        ) : (
          <>
            {/* ====================================================
                DESKTOP TABLE
            ==================================================== */}

            <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] text-left">
                  <thead className="border-b border-stone-200 bg-stone-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Class
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Teacher
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Schedule
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Students
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Details
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100">
                    {classes.map((item) => {
                      const counts =
                        getContentCount(item);

                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-stone-50/70"
                        >
                          {/* Class */}

                          <td className="px-6 py-5">
                            <div>
                              <p className="font-medium text-stone-900">
                                {item.title}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-400">
                                <GraduationCap className="h-3.5 w-3.5" />

                                {item.level}
                              </div>
                            </div>
                          </td>

                          {/* Teacher */}

                          <td className="px-6 py-5">
                            <div>
                              <p className="text-sm font-medium text-stone-700">
                                {item.teacher?.name ||
                                  "Unassigned"}
                              </p>

                              {item.teacher?.email && (
                                <p className="mt-1 text-xs text-stone-400">
                                  {item.teacher.email}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-6 py-5">
                            <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                              {item.category}
                            </span>
                          </td>

                          {/* Schedule */}

                          <td className="px-6 py-5">
                            <div className="text-sm text-stone-700">
                              {formatDate(
                                item.scheduledAt
                              )}
                            </div>

                            <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-400">
                              <Clock3 className="h-3.5 w-3.5" />

                              {formatTime(
                                item.scheduledAt
                              )}
                            </div>
                          </td>

                          {/* Students */}

                          <td className="px-6 py-5">
                            <div className="text-sm font-medium text-stone-700">
                              {item.students || 0}

                              <span className="text-stone-400">
                                {" "}
                                / {item.maxStudents}
                              </span>
                            </div>
                          </td>

                          {/* Details */}

                          <td className="px-6 py-5">
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stone-700">
                                  Outcomes
                                </span>

                                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-500">
                                  {
                                    counts.learningOutcomes
                                  }
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stone-700">
                                  Topics
                                </span>

                                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-500">
                                  {counts.topics}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-medium text-stone-700">
                                  Requirements
                                </span>

                                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-500">
                                  {counts.requirements}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={item.status}
                            />
                          </td>

                          {/* Action */}

                          <td className="px-6 py-5">
                            <Link
                              href={`/admin/classes/${item.id}`}
                              className="text-sm font-medium text-[#967438] transition hover:text-stone-900"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ====================================================
                MOBILE CARDS
            ==================================================== */}

            <div className="mt-4 space-y-4 md:hidden">
              {classes.map((item) => {
                const counts =
                  getContentCount(item);

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-medium leading-6 text-stone-900">
                          {item.title}
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          {item.teacher?.name ||
                            "Unassigned"}
                        </p>
                      </div>

                      <StatusBadge
                        status={item.status}
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <InfoItem
                        icon={
                          <GraduationCap className="h-4 w-4" />
                        }
                        label="Level"
                        value={item.level}
                      />

                      <InfoItem
                        icon={
                          <Users className="h-4 w-4" />
                        }
                        label="Students"
                        value={`${item.students || 0} / ${item.maxStudents}`}
                      />

                      <InfoItem
                        icon={
                          <CalendarDays className="h-4 w-4" />
                        }
                        label="Date"
                        value={formatDate(
                          item.scheduledAt
                        )}
                      />

                      <InfoItem
                        icon={
                          <Clock3 className="h-4 w-4" />
                        }
                        label="Time"
                        value={formatTime(
                          item.scheduledAt
                        )}
                      />
                    </div>

                    {/* Dynamic Content */}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-stone-50 p-3 text-center">
                        <p className="text-lg font-semibold text-stone-900">
                          {
                            counts.learningOutcomes
                          }
                        </p>

                        <p className="mt-1 text-[11px] text-stone-400">
                          Outcomes
                        </p>
                      </div>

                      <div className="rounded-xl bg-stone-50 p-3 text-center">
                        <p className="text-lg font-semibold text-stone-900">
                          {counts.topics}
                        </p>

                        <p className="mt-1 text-[11px] text-stone-400">
                          Topics
                        </p>
                      </div>

                      <div className="rounded-xl bg-stone-50 p-3 text-center">
                        <p className="text-lg font-semibold text-stone-900">
                          {counts.requirements}
                        </p>

                        <p className="mt-1 text-[11px] text-stone-400">
                          Requirements
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                      <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                        {item.category}
                      </span>

                      <Link
                        href={`/admin/classes/${item.id}`}
                        className="text-sm font-medium text-[#967438]"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ====================================================
                EMPTY STATE
            ==================================================== */}

            {classes.length === 0 && !error && (
              <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
                <Video className="mx-auto h-8 w-8 text-stone-300" />

                <h3 className="mt-4 font-medium text-stone-900">
                  No classes found
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  Try changing your search or filters.
                </p>

                <Link
                  href="/admin/classes/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  <Plus className="h-4 w-4" />

                  Add Class
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
          {icon}
        </div>

        <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
          IlmHub
        </span>
      </div>

      <p className="mt-5 text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value}
      </p>
    </div>
  );
}

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  status,
}: {
  status: ClassStatus;
}) {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />

        Live
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
        <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />

        Completed
      </span>
    );
  }

  if (status === "Cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600">
      <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />

      Upcoming
    </span>
  );
}

/* ================================================================
   INFO ITEM
================================================================ */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <div className="flex items-center gap-2 text-stone-400">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-stone-700">
        {value}
      </p>
    </div>
  );
}