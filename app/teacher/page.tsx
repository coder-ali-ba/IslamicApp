"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  MessageSquare,
  Plus,
  Users,
  Video,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Course = {
  _id: string;
  title: string;
  category: string;
  level: string;
  status: "Draft" | "Published";
  students: number;
  lessons: number;
  duration: string;
  price: number;
  createdAt: string;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  order: number;
  status: "Draft" | "Published";
  duration?: string;
  createdAt: string;
  course?: {
    _id: string;
    title: string;
  };
};

type DashboardData = {
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
  totalStudents: number;
  recentCourses: Course[];
  recentLessons: Lesson[];
};

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/teacher/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load teacher dashboard"
          );
        }

        setDashboard(data.dashboard);
      } catch (error) {
        console.error("Dashboard fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [authLoading]);

  const userName = user?.name || "Teacher";

  const firstName = userName.split(" ")[0];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="h-7 w-7 animate-spin text-[#967438]" />
          <p className="text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#292621] px-6 py-8 text-white shadow-sm md:px-8 md:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium tracking-wide text-[#d6b56d]">
            Teacher Dashboard
          </p>

          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Assalamu Alaikum, {firstName}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300 md:text-base">
            Manage your courses, lessons and students from one place.
            Continue building meaningful Islamic learning experiences.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d6b56d] px-4 py-2.5 text-sm font-semibold text-[#292621] transition hover:bg-[#e2c784]"
            >
              <BookOpen className="h-4 w-4" />
              Manage Courses
            </Link>

            <Link
              href="/teacher/classes"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Video className="h-4 w-4" />
              View Classes
            </Link>
          </div>
        </div>

        {/* Decorative icon */}
        <div className="absolute -right-8 -top-8 hidden h-48 w-48 rounded-full border border-[#d6b56d]/10 md:block" />

        <div className="absolute -bottom-16 -right-4 hidden h-56 w-56 rounded-full border border-[#d6b56d]/10 md:block" />
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Courses"
          value={dashboard.totalCourses}
          icon={<BookOpen className="h-5 w-5" />}
          description={`${dashboard.publishedCourses} published`}
        />

        <StatCard
          title="Published Courses"
          value={dashboard.publishedCourses}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Available to students"
        />

        <StatCard
          title="Total Lessons"
          value={dashboard.totalLessons}
          icon={<FileText className="h-5 w-5" />}
          description="Across your courses"
        />

        <StatCard
          title="My Students"
          value={dashboard.totalStudents}
          icon={<Users className="h-5 w-5" />}
          description="Active & completed"
        />
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#292621]">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Manage your teaching activities quickly.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/teacher/courses"
            icon={<BookOpen className="h-5 w-5" />}
            title="Manage Courses"
            description="View and manage your courses"
          />

          <QuickAction
            href="/teacher/courses"
            icon={<Plus className="h-5 w-5" />}
            title="Create Lesson"
            description="Add lessons to your courses"
          />

          <QuickAction
            href="/teacher/classes"
            icon={<Video className="h-5 w-5" />}
            title="Manage Classes"
            description="View your teaching classes"
          />

          <QuickAction
            href="/teacher/students"
            icon={<GraduationCap className="h-5 w-5" />}
            title="View Students"
            description="Track your students"
          />
        </div>
      </section>

      {/* Recent Courses + Recent Lessons */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Recent Courses */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#292621]">
                Recent Courses
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Your latest courses
              </p>
            </div>

            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#967438] hover:text-[#6f5425]"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {dashboard.recentCourses.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-5 w-5" />}
                text="You haven't created any courses yet."
              />
            ) : (
              dashboard.recentCourses.map((course) => (
                <Link
                  key={course._id}
                  href={`/teacher/courses/${course._id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#292621]">
                      {course.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span>{course.category}</span>

                      <span className="text-stone-300">•</span>

                      <span>{course.level}</span>

                      <span className="text-stone-300">•</span>

                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  <StatusBadge status={course.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Lessons */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#292621]">
                Recent Lessons
              </h2>

              <p className="mt-1 text-xs text-stone-500">
                Your latest lesson activity
              </p>
            </div>

            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#967438] hover:text-[#6f5425]"
            >
              Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {dashboard.recentLessons.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                text="You haven't created any lessons yet."
              />
            ) : (
              dashboard.recentLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#292621]">
                        {lesson.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-stone-500">
                        {lesson.course?.title || "Course"}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {lesson.duration || "No duration"}
                        </span>

                        <span>
                          {formatDate(lesson.createdAt)}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={lesson.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Classes Placeholder */}
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-[#967438]">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[#292621]">
                Classes
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Your class scheduling system will appear here once
                classes are connected to the backend.
              </p>
            </div>
          </div>

          <Link
            href="/teacher/classes"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-[#292621] transition hover:bg-stone-50"
          >
            <Video className="h-4 w-4" />
            Manage Classes
          </Link>
        </div>
      </section>

      {/* Messages Placeholder */}
      <section className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#967438] shadow-sm">
            <MessageSquare className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-[#292621]">
              Messages
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Messaging will be connected after the student communication
              system is implemented.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------
   Stat Card
-------------------------------- */

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500">{title}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#292621]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe2] text-[#967438]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-stone-400">
        {description}
      </p>
    </div>
  );
}

/* --------------------------------
   Quick Action
-------------------------------- */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6b56d] hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe2] text-[#967438] transition group-hover:bg-[#eee2c5]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#292621]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-stone-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#967438]">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

/* --------------------------------
   Status Badge
-------------------------------- */

function StatusBadge({
  status,
}: {
  status: "Draft" | "Published";
}) {
  const published = status === "Published";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

/* --------------------------------
   Empty State
-------------------------------- */

function EmptyState({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
        {icon}
      </div>

      <p className="mt-3 text-sm text-stone-500">{text}</p>
    </div>
  );
}