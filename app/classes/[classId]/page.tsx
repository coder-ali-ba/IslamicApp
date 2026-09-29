"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Users,
  Video,
  XCircle,
} from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type ClassDetailsPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

type ClassItem = {
  id: string;
  _id?: string;

  title: string;
  description: string;
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
  duration: string;

  maxStudents: number;
  students: number;
  seatsRemaining: number;

  meetingUrl?: string;

  learningOutcomes?: string[];
  topics?: string[];
  requirements?: string[];

  status: "Upcoming" | "Live" | "Completed" | "Cancelled";

  isEnrolled: boolean;
  enrollmentStatus:
    | "Registered"
    | "Attended"
    | "Cancelled"
    | null;
};

type ClassResponse = {
  success?: boolean;
  message?: string;
  class?: ClassItem;
  data?: ClassItem;
};

type ActionResponse = {
  success?: boolean;
  message?: string;
  class?: ClassItem;
  data?: ClassItem;
};

function formatDate(dateString: string) {
  if (!dateString) return "Date not available";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatTime(dateString: string) {
  if (!dateString) return "Time not available";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
}

export default function ClassDetailsPage({
  params,
}: ClassDetailsPageProps) {
  const [classId, setClassId] = useState<string | null>(
    null
  );

  const [classItem, setClassItem] =
    useState<ClassItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadParams() {
      const resolvedParams = await params;

      if (!mounted) return;

      setClassId(resolvedParams.classId);
    }

    loadParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!classId) return;

    let mounted = true;

    async function loadClass() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/classes/${classId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const result: ClassResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load this class."
          );
        }

        const loadedClass =
          result.class || result.data;

        if (!loadedClass) {
          throw new Error(
            "Class information was not found."
          );
        }

        if (mounted) {
          setClassItem(loadedClass);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this class."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadClass();

    return () => {
      mounted = false;
    };
  }, [classId]);

  const availableSeats = useMemo(() => {
    if (!classItem) return 0;

    if (
      typeof classItem.seatsRemaining === "number"
    ) {
      return Math.max(
        0,
        classItem.seatsRemaining
      );
    }

    return Math.max(
      0,
      classItem.maxStudents -
        classItem.students
    );
  }, [classItem]);

  const seatsPercentage = useMemo(() => {
    if (
      !classItem ||
      classItem.maxStudents <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (classItem.students /
          classItem.maxStudents) *
          100
      )
    );
  }, [classItem]);

  const handleEnroll = async () => {
    if (!classId || !classItem) return;

    try {
      setActionLoading(true);
      setActionMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/classes/${classId}/enroll`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: ActionResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to enroll in this class."
        );
      }

      const updatedClass =
        result.class || result.data;

      if (updatedClass) {
        setClassItem(updatedClass);
      } else {
        const refreshResponse = await fetch(
          `${API_URL}/classes/${classId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const refreshResult: ClassResponse =
          await refreshResponse.json();

        if (refreshResponse.ok) {
          const refreshedClass =
            refreshResult.class ||
            refreshResult.data;

          if (refreshedClass) {
            setClassItem(refreshedClass);
          }
        }
      }

      setActionMessage(
        result.message ||
          "You are now enrolled in this class."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to enroll in this class."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!classId || !classItem) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel your enrollment in this class?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setActionMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/classes/${classId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: ActionResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to cancel your enrollment."
        );
      }

      const updatedClass =
        result.class || result.data;

      if (updatedClass) {
        setClassItem(updatedClass);
      } else {
        const refreshResponse = await fetch(
          `${API_URL}/classes/${classId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const refreshResult: ClassResponse =
          await refreshResponse.json();

        if (refreshResponse.ok) {
          const refreshedClass =
            refreshResult.class ||
            refreshResult.data;

          if (refreshedClass) {
            setClassItem(refreshedClass);
          }
        }
      }

      setActionMessage(
        result.message ||
          "Your enrollment has been cancelled."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel your enrollment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#967438]" />

            <p className="mt-4 text-sm text-stone-500">
              Loading class...
            </p>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  if (error && !classItem) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Navbar />

        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-stone-900">
              Unable to Load Class
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-500">
              {error}
            </p>

            <Link
              href="/classes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <ArrowLeft size={16} />
              Back to Classes
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  if (!classItem) {
    return null;
  }

  const instructor =
    classItem.instructor ||
    classItem.teacher?.name ||
    "Scholar";

  const learningOutcomes =
    Array.isArray(
      classItem.learningOutcomes
    )
      ? classItem.learningOutcomes.filter(
          Boolean
        )
      : [];

  const topics = Array.isArray(classItem.topics)
    ? classItem.topics.filter(Boolean)
    : [];

  const requirements = Array.isArray(
    classItem.requirements
  )
    ? classItem.requirements.filter(Boolean)
    : [];

  const isFull = availableSeats <= 0;

  const isLive =
    classItem.status === "Live";

  const isUpcoming =
    classItem.status === "Upcoming";

  const isCompleted =
    classItem.status === "Completed";

  const isCancelled =
    classItem.status === "Cancelled";

  const isEnrolled =
    classItem.enrollmentStatus ===
      "Registered" ||
    classItem.enrollmentStatus ===
      "Attended";

  const canCancel =
    isEnrolled &&
    isUpcoming &&
    !actionLoading;

  const canEnroll =
    !isEnrolled &&
    isUpcoming &&
    !isFull &&
    !actionLoading;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 opacity-[0.045]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#d6b56d_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -right-40 bottom-[-160px] h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          <Link
            href="/classes"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-300 transition hover:text-[#d6b56d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Content */}
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d6b56d]/30 bg-[#d6b56d]/10 px-3 py-1.5 text-xs font-semibold text-[#e4c98d]">
                  {classItem.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-stone-300">
                  {classItem.level}
                </span>

                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    isLive
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                      : isCancelled
                        ? "border-red-400/20 bg-red-500/10 text-red-300"
                        : isCompleted
                          ? "border-stone-400/20 bg-white/5 text-stone-400"
                          : "border-white/10 bg-white/5 text-stone-300"
                  }`}
                >
                  <Video className="h-3.5 w-3.5" />
                  {classItem.status}
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {classItem.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                {classItem.description}
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10">
                  <GraduationCap className="h-5 w-5 text-[#d6b56d]" />
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    Instructor
                  </p>

                  <p className="font-medium text-white">
                    {instructor}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <CalendarDays className="mb-2 h-4 w-4 text-[#d6b56d]" />

                  <p className="text-xs text-stone-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {formatDate(
                      classItem.scheduledAt
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Clock3 className="mb-2 h-4 w-4 text-[#d6b56d]" />

                  <p className="text-xs text-stone-400">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {formatTime(
                      classItem.scheduledAt
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Clock3 className="mb-2 h-4 w-4 text-[#d6b56d]" />

                  <p className="text-xs text-stone-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.duration}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Users className="mb-2 h-4 w-4 text-[#d6b56d]" />

                  <p className="text-xs text-stone-400">
                    Students
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.students}/
                    {classItem.maxStudents}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl border border-[#d6b56d]/10" />

              <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-stone-800 via-stone-900 to-[#6d542d] shadow-2xl sm:h-[420px]">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/30" />
                  <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full border border-white/20" />
                </div>

                <div className="relative z-10 px-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#d6b56d]/30 bg-[#d6b56d]/10">
                    <BookOpen className="h-9 w-9 text-[#e4c98d]" />
                  </div>

                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-stone-400">
                    IlmHub Live Class
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-white">
                    {classItem.category}
                  </p>

                  <p className="mt-2 text-sm text-stone-300">
                    {classItem.level} Level
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/10 bg-stone-950/70 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-stone-400">
                          Availability
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-[#e4c98d]">
                          {isFull
                            ? "Full"
                            : `${availableSeats} seats`}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
                        <p className="text-xs text-stone-400">
                          Status
                        </p>

                        <p className="font-semibold text-white">
                          {classItem.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-10">
            {/* Learning Outcomes */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Learning Outcomes
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  What You&apos;ll Learn
                </h2>
              </div>

              {learningOutcomes.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {learningOutcomes.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                        <p className="text-sm leading-6 text-stone-700">
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <EmptySection
                  text="Learning outcomes for this class have not been added yet."
                />
              )}
            </section>

            {/* Topics */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Session Topics
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  What We&apos;ll Cover
                </h2>
              </div>

              {topics.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  {topics.map((topic, index) => (
                    <div
                      key={`${topic}-${index}`}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        index !== topics.length - 1
                          ? "border-b border-stone-100"
                          : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-600">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <p className="text-sm font-medium text-stone-700">
                        {topic}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySection
                  text="Session topics for this class have not been added yet."
                />
              )}
            </section>

            {/* Requirements */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Before You Join
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  Requirements
                </h2>
              </div>

              {requirements.length > 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-6">
                  <div className="space-y-4">
                    {requirements.map(
                      (requirement, index) => (
                        <div
                          key={`${requirement}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b99a5a]" />

                          <p className="text-sm leading-6 text-stone-600">
                            {requirement}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <EmptySection
                  text="No specific requirements have been added for this class."
                />
              )}
            </section>
          </div>

          {/* Enrollment Card */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 p-6">
                <p className="text-sm font-medium text-stone-500">
                  Class Enrollment
                </p>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-3xl font-semibold text-stone-900">
                    {availableSeats}
                  </span>

                  <span className="text-sm text-stone-400">
                    seats remaining
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <CalendarDays className="h-5 w-5 text-stone-600" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-stone-800">
                      {formatDate(
                        classItem.scheduledAt
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Clock3 className="h-5 w-5 text-stone-600" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Time & Duration
                    </p>

                    <p className="mt-1 text-sm font-medium text-stone-800">
                      {formatTime(
                        classItem.scheduledAt
                      )}{" "}
                      • {classItem.duration}
                    </p>
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-stone-500">
                      Seats filled
                    </span>

                    <span className="font-medium text-stone-800">
                      {classItem.students}/
                      {classItem.maxStudents}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-[#b99a5a]"
                      style={{
                        width: `${seatsPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-stone-400">
                    {availableSeats} seats remaining
                  </p>
                </div>

                {/* Action message */}
                {actionMessage && (
                  <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-xs leading-5 text-emerald-700">
                      {actionMessage}
                    </p>
                  </div>
                )}

                {/* Error */}
                {error && classItem && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                    <p className="text-xs leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                )}

                {/* Enrolled */}
                {isEnrolled && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          You are enrolled
                        </p>

                        <p className="mt-1 text-xs text-emerald-700">
                          Your seat has been registered for this class.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Join Live Class */}
                {isLive && isEnrolled && (
                  <Link
                    href={`/classes/${classId}/live`}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <Video className="h-4 w-4" />

                    Join Live Class

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                {/* Enroll */}
                {canEnroll && (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={actionLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        Enroll in This Class
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                )}

                {/* Cancel enrollment */}
                {canCancel && (
                  <button
                    type="button"
                    onClick={
                      handleCancelEnrollment
                    }
                    disabled={actionLoading}
                    className="w-full rounded-xl border border-stone-200 px-5 py-3 text-sm font-medium text-stone-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Processing..."
                      : "Cancel Enrollment"}
                  </button>
                )}

                {/* Full */}
                {isFull &&
                  !isEnrolled &&
                  isUpcoming && (
                    <div className="rounded-xl bg-stone-100 px-5 py-3.5 text-center text-sm font-semibold text-stone-600">
                      This class is currently full.
                    </div>
                  )}

                {/* Completed */}
                {isCompleted && (
                  <div className="rounded-xl bg-stone-100 px-5 py-3.5 text-center text-sm font-semibold text-stone-600">
                    This class has been completed.
                  </div>
                )}

                {/* Cancelled */}
                {isCancelled && (
                  <div className="rounded-xl bg-red-50 px-5 py-3.5 text-center text-sm font-semibold text-red-600">
                    This class has been cancelled.
                  </div>
                )}

                {/* Upcoming note */}
                {isUpcoming &&
                  !isEnrolled &&
                  !isFull && (
                    <p className="text-center text-xs leading-5 text-stone-400">
                      Enroll now to reserve your seat in this live
                      Islamic learning session.
                    </p>
                  )}

                {/* Info */}
                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="flex gap-3">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        Live & Interactive
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Join the live session, interact with your
                        instructor, and ask questions during the
                        class.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Start Learning
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-stone-900">
            Ready to join this class?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Reserve your place and learn directly with an instructor
            in a focused live session.
          </p>

          <Link
            href="/classes"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Explore More Classes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function EmptySection({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-6">
      <p className="text-sm leading-6 text-stone-400">
        {text}
      </p>
    </div>
  );
}