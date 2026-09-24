"use client";

import {
  Users,
  GraduationCap,
  BookOpen,
  Video,
  MessageCircleQuestion,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/app/src/lib/api";

type DashboardStats = {
  totalStudents: number;
  totalTeachers: number;
  totalScholars: number;
  totalTeachersAndScholars: number;
  totalCourses: number;
  publishedCourses: number;
  totalClasses: number;
  liveClasses: number;
};

type Enrollment = {
  _id: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  };
  course?: {
    _id: string;
    title: string;
  };
  createdAt?: string;
};

type UpcomingClass = {
  _id: string;
  title: string;
  category: string;
  level: string;
  scheduledAt: string;
  durationMinutes: number;
  maxStudents: number;
  teacher?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

const initialStats: DashboardStats = {
  totalStudents: 0,
  totalTeachers: 0,
  totalScholars: 0,
  totalTeachersAndScholars: 0,
  totalCourses: 0,
  publishedCourses: 0,
  totalClasses: 0,
  liveClasses: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<DashboardStats>(
      initialStats
    );

  const [
    recentEnrollments,
    setRecentEnrollments,
  ] = useState<Enrollment[]>([]);

  const [
    upcomingClasses,
    setUpcomingClasses,
  ] = useState<UpcomingClass[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/auth/admin/dashboard"
      );

      if (response.data.success) {
        setStats(
          response.data.stats ||
            initialStats
        );

        setRecentEnrollments(
          response.data.recentEnrollments ||
            []
        );

        setUpcomingClasses(
          response.data.upcomingClasses ||
            []
        );
      }
    } catch (error: any) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">
            Welcome back, Admin
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            IlmHub Overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Manage your Islamic learning
            platform, monitor activity,
            and keep your content organized.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboard}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-[#d6b56d] hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={
              loading
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          Refresh
        </button>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          description="Registered students"
          icon={Users}
          loading={loading}
        />

        <StatCard
          title="Teachers & Scholars"
          value={
            stats.totalTeachersAndScholars
          }
          description={`${stats.totalTeachers} teachers · ${stats.totalScholars} scholars`}
          icon={GraduationCap}
          loading={loading}
        />

        <StatCard
          title="Courses"
          value={stats.totalCourses}
          description={`${stats.publishedCourses} published`}
          icon={BookOpen}
          loading={loading}
        />

        <StatCard
          title="Live Classes"
          value={stats.liveClasses}
          description={`${stats.totalClasses} total classes`}
          icon={Video}
          loading={loading}
        />
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Recent Enrollments */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h3 className="font-semibold text-stone-900">
                Recent Enrollments
              </h3>

              <p className="mt-1 text-xs text-stone-500">
                Latest student activity
              </p>
            </div>

            <Link
              href="/admin/enrollments"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#967438] hover:text-stone-900"
            >
              View all

              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingBox />
          ) : recentEnrollments.length ===
            0 ? (
            <EmptyBox
              text="No enrollments yet."
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {recentEnrollments.map(
                (item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                        {item.student?.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "S"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">
                          {item.student?.name ||
                            "Unknown Student"}
                        </p>

                        <p className="truncate text-xs text-stone-500">
                          {item.course?.title ||
                            "Unknown Course"}
                        </p>
                      </div>
                    </div>

                    <p className="hidden shrink-0 text-xs text-stone-400 sm:block">
                      {formatDateTime(
                        item.createdAt
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h3 className="font-semibold text-stone-900">
                Upcoming Classes
              </h3>

              <p className="mt-1 text-xs text-stone-500">
                Next scheduled sessions
              </p>
            </div>

            <Link
              href="/admin/classes"
              className="text-xs font-medium text-[#967438] hover:text-stone-900"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <LoadingBox />
          ) : upcomingClasses.length ===
            0 ? (
            <EmptyBox
              text="No upcoming classes."
            />
          ) : (
            <div className="space-y-3 p-4">
              {upcomingClasses.map(
                (item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-stone-100 bg-[#faf9f6] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                        <CalendarDays className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          {item.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-stone-500">
                          {item.teacher?.name ||
                            "Unknown Teacher"}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#967438]">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />

                            {formatTime(
                              item.scheduledAt
                            )}
                          </span>

                          <span>
                            {formatDate(
                              item.scheduledAt
                            )}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600">
                            {item.category}
                          </span>

                          <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600">
                            {item.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="mb-4 font-semibold text-stone-900">
          Quick Actions
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/admin/courses"
            title="Manage Courses"
          />

          <QuickAction
            href="/admin/classes"
            title="Manage Classes"
          />

          <QuickAction
            href="/admin/teachers"
            title="Manage Teachers"
          />

          <QuickAction
            href="/admin/fatwas"
            title="Review Fatwas"
            icon={
              <MessageCircleQuestion className="h-4 w-4" />
            }
          />
        </div>
      </section>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
          <Icon className="h-5 w-5" />
        </div>

        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
          Live data
        </span>
      </div>

      <p className="mt-5 text-sm text-stone-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
        {loading ? "—" : value}
      </p>

      <p className="mt-1 text-xs text-stone-400">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-[#d6b56d] hover:shadow-md"
    >
      <span className="inline-flex items-center gap-2">
        {icon}
        {title}
      </span>
    </Link>
  );
}

function LoadingBox() {
  return (
    <div className="flex min-h-[220px] items-center justify-center text-sm text-stone-400">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    </div>
  );
}

function EmptyBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[220px] items-center justify-center text-sm text-stone-400">
      {text}
    </div>
  );
}

/* ---------------- Date Helpers ---------------- */

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatDateTime(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}