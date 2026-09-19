"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Edit3,
  MoreVertical,
  Plus,
  Search,
  Users,
  Video,
} from "lucide-react";

type ClassItem = {
  id: string;
  title: string;
  category: string;
  level: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  maxStudents: number;
  status: "Live" | "Upcoming" | "Completed" | "Cancelled";
};

const classes: ClassItem[] = [
  {
    id: "class-1",
    title: "Quran Reading Live Class",
    category: "Quran",
    level: "Beginner",
    date: "19 Sep 2026",
    time: "07:00 PM",
    duration: "60 min",
    students: 24,
    maxStudents: 30,
    status: "Live",
  },
  {
    id: "class-2",
    title: "Tajweed Correction Session",
    category: "Tajweed",
    level: "Intermediate",
    date: "20 Sep 2026",
    time: "06:30 PM",
    duration: "60 min",
    students: 18,
    maxStudents: 25,
    status: "Upcoming",
  },
  {
    id: "class-3",
    title: "Hadith Study Circle",
    category: "Hadith",
    level: "Intermediate",
    date: "21 Sep 2026",
    time: "08:00 PM",
    duration: "90 min",
    students: 31,
    maxStudents: 40,
    status: "Upcoming",
  },
  {
    id: "class-4",
    title: "Arabic Speaking Practice",
    category: "Arabic",
    level: "Beginner",
    date: "16 Sep 2026",
    time: "07:30 PM",
    duration: "60 min",
    students: 16,
    maxStudents: 25,
    status: "Completed",
  },
  {
    id: "class-5",
    title: "Fiqh for Everyday Life",
    category: "Fiqh",
    level: "Beginner",
    date: "14 Sep 2026",
    time: "06:00 PM",
    duration: "60 min",
    students: 22,
    maxStudents: 30,
    status: "Completed",
  },
  {
    id: "class-6",
    title: "Advanced Tajweed Workshop",
    category: "Tajweed",
    level: "Advanced",
    date: "12 Sep 2026",
    time: "08:00 PM",
    duration: "90 min",
    students: 12,
    maxStudents: 20,
    status: "Cancelled",
  },
];

export default function TeacherClassesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

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

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" />
          Create Class
        </button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">
                Total Classes
              </p>

              <p className="mt-2 text-3xl font-semibold text-stone-900">
                {classes.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Live Now
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {liveClasses}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Currently active
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Upcoming
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {upcomingClasses}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Scheduled classes
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Class Enrollments
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {totalStudents}
          </p>

          <p className="mt-1 text-xs text-stone-400">
            Total registrations
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
              placeholder="Search classes..."
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
              <option value="Arabic">Arabic</option>
              <option value="Hadith">Hadith</option>
              <option value="Fiqh">Fiqh</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 pr-10 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-48"
            >
              <option value="All">All Status</option>
              <option value="Live">Live</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredClasses.map((item) => (
          <article
            key={item.id}
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

                <button
                  type="button"
                  className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Schedule */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                  <CalendarDays className="h-4 w-4 text-[#967438]" />

                  <div>
                    <p className="text-[11px] text-stone-400">
                      Date
                    </p>

                    <p className="text-sm font-medium text-stone-800">
                      {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                  <Clock3 className="h-4 w-4 text-[#967438]" />

                  <div>
                    <p className="text-[11px] text-stone-400">
                      Time & Duration
                    </p>

                    <p className="text-sm font-medium text-stone-800">
                      {item.time} · {item.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                  <Users className="h-4 w-4 text-[#967438]" />

                  <div>
                    <p className="text-[11px] text-stone-400">
                      Students
                    </p>

                    <p className="text-sm font-medium text-stone-800">
                      {item.students} / {item.maxStudents}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                {item.status === "Live" && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-[#d6b56d] transition hover:bg-stone-800"
                  >
                    Join Class
                  </button>
                )}

                {item.status === "Upcoming" && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Manage
                  </button>
                )}

                {item.status === "Completed" && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-[#d6b56d]"
                  >
                    View Details
                  </button>
                )}

                {item.status === "Cancelled" && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-500"
                  >
                    View Details
                  </button>
                )}

                <button
                  type="button"
                  className="rounded-xl border border-stone-200 p-2.5 text-stone-500 transition hover:border-[#d6b56d] hover:text-stone-900"
                  title="Edit class"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
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