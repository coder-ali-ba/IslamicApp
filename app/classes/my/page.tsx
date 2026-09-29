"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Video,
  ArrowRight,
  Loader2,
  Users,
  CheckCircle2,
  PlayCircle,
  History,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ClassItem = {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  category: string;
  level: string;
  teacher?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  instructor?: string;
  scheduledAt: string;
  durationMinutes: number;
  duration?: string;
  maxStudents: number;
  students?: number;
  seatsRemaining?: number;
  meetingUrl?: string;
  learningOutcomes?: string[];
  topics?: string[];
  requirements?: string[];
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
  enrollmentStatus?: "Registered" | "Attended" | "Cancelled" | null;
  isEnrolled?: boolean;
  registeredAt?: string;
};

type ApiResponse = {
  success: boolean;
  classes?: ClassItem[];
  message?: string;
};

export default function MyClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/classes/my`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load your classes");
      }

      setClasses(data.classes || []);
    } catch (err) {
      console.error("My Classes Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your classes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const stats = useMemo(() => {
    return {
      total: classes.length,
      upcoming: classes.filter((item) => item.status === "Upcoming").length,
      live: classes.filter((item) => item.status === "Live").length,
      completed: classes.filter((item) => item.status === "Completed").length,
    };
  }, [classes]);

  const getClassId = (classItem: ClassItem) =>
    classItem.id || classItem._id || "";

  const getTeacherName = (classItem: ClassItem) =>
    classItem.teacher?.name ||
    classItem.instructor ||
    "Instructor";

  const formatDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return date;
    }
  };

  const formatTime = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  const getStatusStyle = (status: ClassItem["status"]) => {
    switch (status) {
      case "Live":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          icon: PlayCircle,
        };

      case "Upcoming":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          icon: CalendarDays,
        };

      case "Completed":
        return {
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
          icon: CheckCircle2,
        };

      case "Cancelled":
        return {
          badge: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          icon: AlertCircle,
        };

      default:
        return {
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
          icon: CalendarDays,
        };
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D99B33]/20 bg-[#D99B33]/10 px-3 py-1 text-xs font-semibold text-[#9A691C]">
              <GraduationCap className="h-3.5 w-3.5" />
              Student Learning
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#132A4C] sm:text-3xl">
              My Classes
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              View and manage all the classes you are enrolled in.
            </p>
          </div>

          <Link
            href="/classes"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#132A4C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B1930]"
          >
            Browse Classes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to load classes</p>
              <p className="mt-1 text-sm">{error}</p>

              <button
                onClick={fetchMyClasses}
                className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Classes"
            value={stats.total}
            icon={BookOpen}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            icon={CalendarDays}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <StatCard
            label="Live Now"
            value={stats.live}
            icon={Video}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            label="Completed"
            value={stats.completed}
            icon={History}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
          />
        </div>

        {/* Empty State */}
        {!error && classes.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#132A4C]/5">
              <BookOpen className="h-8 w-8 text-[#132A4C]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#132A4C]">
              No classes yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You have not enrolled in any classes yet. Explore available
              classes and start your learning journey.
            </p>

            <Link
              href="/classes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#132A4C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930]"
            >
              Explore Classes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Classes */}
        {classes.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#132A4C]">
                  Your Enrolled Classes
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {classes.length}{" "}
                  {classes.length === 1 ? "class" : "classes"} in your learning
                  schedule
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {classes.map((classItem) => {
                const classId = getClassId(classItem);
                const status = getStatusStyle(classItem.status);
                const StatusIcon = status.icon;

                return (
                  <article
                    key={classId}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Top accent */}
                    <div className="h-1 bg-[#D99B33]" />

                    <div className="p-5 sm:p-6">
                      {/* Title + status */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-[#132A4C]/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#132A4C]">
                              {classItem.category}
                            </span>

                            <span className="rounded-md bg-[#D99B33]/10 px-2.5 py-1 text-[11px] font-bold text-[#9A691C]">
                              {classItem.level}
                            </span>
                          </div>

                          <h3 className="line-clamp-2 text-lg font-bold text-[#132A4C] transition group-hover:text-[#0B1930]">
                            {classItem.title}
                          </h3>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                          />
                          {classItem.status}
                        </span>
                      </div>

                      {/* Description */}
                      {classItem.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                          {classItem.description}
                        </p>
                      )}

                      {/* Teacher */}
                      <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#132A4C] text-white">
                          <GraduationCap className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Teacher
                          </p>
                          <p className="truncate text-sm font-semibold text-[#132A4C]">
                            {getTeacherName(classItem)}
                          </p>
                        </div>
                      </div>

                      {/* Class information */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <InfoItem
                          icon={CalendarDays}
                          label="Date"
                          value={formatDate(classItem.scheduledAt)}
                        />

                        <InfoItem
                          icon={Clock3}
                          label="Time"
                          value={formatTime(classItem.scheduledAt)}
                        />

                        <InfoItem
                          icon={Clock3}
                          label="Duration"
                          value={
                            classItem.duration ||
                            `${classItem.durationMinutes} min`
                          }
                        />

                        <InfoItem
                          icon={Users}
                          label="Seats"
                          value={
                            typeof classItem.seatsRemaining === "number"
                              ? `${classItem.seatsRemaining} remaining`
                              : `${classItem.maxStudents} max`
                          }
                        />
                      </div>

                      {/* Enrollment status */}
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        {classItem.enrollmentStatus === "Attended"
                          ? "Attendance recorded"
                          : "You are enrolled in this class"}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Link
                          href={`/classes/${classId}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#132A4C] transition hover:border-[#132A4C] hover:bg-slate-50"
                        >
                          View Class
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                        {classItem.status === "Live" &&
                          classItem.meetingUrl && (
                            <a
                              href={classItem.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              <Video className="h-4 w-4" />
                              Join Live Class
                            </a>
                          )}

                        {classItem.status === "Upcoming" && (
                          <Link
                            href={`/classes/${classId}`}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#132A4C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B1930]"
                          >
                            Class Details
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#132A4C]">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[#D99B33]" />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-xs font-semibold text-[#132A4C]">
        {value}
      </p>
    </div>
  );
}