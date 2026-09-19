"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  GraduationCap,
  Plus,
  Search,
  Users,
  Video,
} from "lucide-react";

type ClassItem = {
  id: string;
  title: string;
  teacher: string;
  category: "Quran" | "Tajweed" | "Arabic" | "Hadith" | "Fiqh";
  level: "Beginner" | "Intermediate" | "Advanced";
  date: string;
  time: string;
  students: number;
  status: "Upcoming" | "Live";
};

const classes: ClassItem[] = [
  {
    id: "1",
    title: "Quran Reading Live Class",
    teacher: "Ustadh Muhammad Ahmed",
    category: "Quran",
    level: "Beginner",
    date: "Sep 20, 2026",
    time: "7:00 PM",
    students: 42,
    status: "Live",
  },
  {
    id: "2",
    title: "Tajweed Correction Session",
    teacher: "Ustadh Abdul Rahman",
    category: "Tajweed",
    level: "Intermediate",
    date: "Sep 21, 2026",
    time: "6:30 PM",
    students: 28,
    status: "Upcoming",
  },
  {
    id: "3",
    title: "Arabic Speaking Practice",
    teacher: "Ustadh Omar Farooq",
    category: "Arabic",
    level: "Beginner",
    date: "Sep 22, 2026",
    time: "8:00 PM",
    students: 35,
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Hadith Study Circle",
    teacher: "Dr. Ibrahim Khan",
    category: "Hadith",
    level: "Intermediate",
    date: "Sep 23, 2026",
    time: "7:30 PM",
    students: 31,
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Fiqh for Everyday Life",
    teacher: "Mufti Abdullah",
    category: "Fiqh",
    level: "Beginner",
    date: "Sep 24, 2026",
    time: "6:00 PM",
    students: 24,
    status: "Upcoming",
  },
  {
    id: "6",
    title: "Advanced Tajweed Workshop",
    teacher: "Dr. Hamza Malik",
    category: "Tajweed",
    level: "Advanced",
    date: "Sep 25, 2026",
    time: "8:30 PM",
    students: 18,
    status: "Upcoming",
  },
];

export default function AdminClassesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.teacher.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0
  );

  const liveClasses = classes.filter(
    (item) => item.status === "Live"
  ).length;

  const upcomingClasses = classes.filter(
    (item) => item.status === "Upcoming"
  ).length;

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Class Management
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Live Classes
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage live Islamic classes, schedules, teachers, and students.
            </p>
          </div>

          <Link
            href="/admin/classes/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </Link>
        </div>

        {/* Stats */}
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

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search classes or teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Categories</option>
              <option value="Quran">Quran</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Arabic">Arabic</option>
              <option value="Hadith">Hadith</option>
              <option value="Fiqh">Fiqh</option>
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Status</option>
              <option value="Live">Live</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {filteredClasses.length}
            </span>{" "}
            classes
          </p>
        </div>

        {/* Desktop Table */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
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
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {filteredClasses.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-stone-50/70"
                  >
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

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {item.teacher}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-sm text-stone-700">
                        {item.date}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.time}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-stone-700">
                      {item.students}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-5">
                      <button className="text-sm font-medium text-[#967438] transition hover:text-stone-900">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="mt-4 space-y-4 md:hidden">
          {filteredClasses.map((item) => (
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
                    {item.teacher}
                  </p>
                </div>

                <StatusBadge status={item.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoItem
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Level"
                  value={item.level}
                />

                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="Students"
                  value={String(item.students)}
                />

                <InfoItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Date"
                  value={item.date}
                />

                <InfoItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Time"
                  value={item.time}
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                  {item.category}
                </span>

                <button className="text-sm font-medium text-[#967438]">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <Video className="mx-auto h-8 w-8 text-stone-300" />

            <h3 className="mt-4 font-medium text-stone-900">
              No classes found
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

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

      <p className="mt-5 text-sm text-stone-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: ClassItem["status"] }) {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
        Live
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
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-1 text-sm font-medium text-stone-700">{value}</p>
    </div>
  );
}