"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Edit3,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Users,
  Video,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClassStatus =
  | "Live"
  | "Upcoming"
  | "Completed"
  | "Cancelled";

type ClassItem = {
  _id: string;
  id: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  scheduledAt: string;
  durationMinutes: number;
  duration: string;
  students: number;
  maxStudents: number;
  status: ClassStatus;
  meetingUrl?: string;
};

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/classes/teacher/my`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch classes"
        );
      }

      setClasses(data.classes || []);
    } catch (error) {
      console.error("Fetch classes error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch classes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        item.title.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesStatus =
        status === "All" ||
        item.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [classes, search, category, status]);

  const liveClasses = classes.filter(
    (item) => item.status === "Live"
  ).length;

  const upcomingClasses = classes.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const completedClasses = classes.filter(
    (item) => item.status === "Completed"
  ).length;

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deleteClass = async (classId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/classes/teacher/my/${classId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete class"
        );
      }

      setClasses((previous) =>
        previous.filter(
          (item) => item._id !== classId
        )
      );
    } catch (error) {
      console.error("Delete class error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete class"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="h-7 w-7 animate-spin text-[#967438]" />
          <p className="text-sm">
            Loading your classes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load classes
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchClasses}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Teaching
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            My Classes
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Schedule and manage your live Islamic classes.
          </p>
        </div>

        <Link
          href="/teacher/classes/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Create Class
        </Link>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon={
            <CalendarDays className="h-5 w-5" />
          }
        />

        <StatCard
          title="Live Now"
          value={liveClasses}
          description="Currently active"
        />

        <StatCard
          title="Upcoming"
          value={upcomingClasses}
          description="Scheduled classes"
        />

        <StatCard
          title="Class Enrollments"
          value={totalStudents}
          description="Total registrations"
        />
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search classes..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-48"
            >
              <option value="All">
                All Categories
              </option>
              <option value="Quran">Quran</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Arabic">Arabic</option>
              <option value="Hadith">Hadith</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Seerah">Seerah</option>
              <option value="Islamic Studies">
                Islamic Studies
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-48"
            >
              <option value="All">
                All Status
              </option>
              <option value="Live">Live</option>
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

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      </section>

      {/* Result */}
      <p className="text-sm text-stone-500">
        Showing{" "}
        <span className="font-medium text-stone-900">
          {filteredClasses.length}
        </span>{" "}
        classes
      </p>

      {/* Classes */}
      {filteredClasses.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredClasses.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              {/* Top */}
              <div className="relative flex h-32 items-center justify-center bg-stone-900">
                <Video className="h-11 w-11 text-[#d6b56d]" />

                <span className="absolute left-4 top-4 rounded-full bg-[#d6b56d] px-2.5 py-1 text-[10px] font-semibold text-stone-950">
                  {item.category}
                </span>

                <span
                  className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    item.status === "Live"
                      ? "bg-red-50 text-red-700"
                      : item.status === "Upcoming"
                        ? "bg-amber-50 text-amber-700"
                        : item.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-stone-500">
                      {item.level}
                    </p>
                  </div>

                  <div className="relative group">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    <div className="invisible absolute right-0 top-8 z-20 w-32 rounded-xl border border-stone-200 bg-white p-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                      <Link
                        href={`/teacher/classes/${item._id}/edit`}
                        className="block rounded-lg px-3 py-2 text-xs text-stone-700 hover:bg-stone-50"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          deleteClass(item._id)
                        }
                        className="block w-full rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mt-5 space-y-3">
                  <InfoRow
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                    label="Date"
                    value={formatDate(
                      item.scheduledAt
                    )}
                  />

                  <InfoRow
                    icon={
                      <Clock3 className="h-4 w-4" />
                    }
                    label="Time & Duration"
                    value={`${formatTime(
                      item.scheduledAt
                    )} · ${item.duration}`}
                  />

                  <InfoRow
                    icon={
                      <Users className="h-4 w-4" />
                    }
                    label="Students"
                    value={`${item.students} / ${item.maxStudents}`}
                  />
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                  {item.status === "Live" && (
                    <>
                      {item.meetingUrl ? (
                        <a
                          href={item.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-center text-sm font-medium text-[#d6b56d] transition hover:bg-stone-800"
                        >
                          Join Class
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 rounded-xl bg-stone-200 px-4 py-2.5 text-sm font-medium text-stone-400"
                        >
                          Meeting Not Set
                        </button>
                      )}
                    </>
                  )}

                  {item.status === "Upcoming" && (
                    <Link
                      href={`/teacher/classes/${item._id}/edit`}
                      className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                      Manage
                    </Link>
                  )}

                  {item.status === "Completed" && (
                    <Link
                      href={`/teacher/classes/${item._id}/edit`}
                      className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:border-[#d6b56d]"
                    >
                      View Details
                    </Link>
                  )}

                  {item.status === "Cancelled" && (
                    <Link
                      href={`/teacher/classes/${item._id}/edit`}
                      className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-medium text-stone-500"
                    >
                      View Details
                    </Link>
                  )}

                  <Link
                    href={`/teacher/classes/${item._id}/edit`}
                    className="rounded-xl border border-stone-200 p-2.5 text-stone-500 transition hover:border-[#d6b56d] hover:text-stone-900"
                    title="Edit class"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-stone-300" />

          <h3 className="mt-4 font-semibold text-stone-900">
            No classes found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

/* --------------------------------
   Stat Card
-------------------------------- */

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-stone-400">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------
   Info Row
-------------------------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
      <div className="text-[#967438]">
        {icon}
      </div>

      <div>
        <p className="text-[11px] text-stone-400">
          {label}
        </p>

        <p className="text-sm font-medium text-stone-800">
          {value}
        </p>
      </div>
    </div>
  );
}