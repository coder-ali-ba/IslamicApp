"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import api from "@/app/src/lib/api";

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  price?: number;
  image?: string;
  instructor?: {
    name?: string;
  };
};

type Enrollment = {
  _id: string;
  course: Course | string;
  status: "pending" | "active" | "cancelled" | "expired";
  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "not_required";
  amount: number;
  currency?: string;
  paymentMethod?: string;
  transactionId?: string;
  enrolledAt?: string | null;
  createdAt?: string;
  expiresAt?: string | null;
  rejectionReason?: string | null;
};

function getErrorMessage(error: unknown) {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    err?.response?.data?.message ||
    err?.message ||
    "Unable to load your enrollments."
  );
}

function getCourse(course: Course | string): Course | null {
  return typeof course === "object" && course !== null ? course : null;
}

function getCourseId(course: Course | string) {
  return typeof course === "string" ? course : course?._id;
}

function formatPrice(amount = 0, currency = "PKR") {
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function getStatusStyle(status: Enrollment["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";

    case "pending":
      return "bg-amber-100 text-amber-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    case "expired":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPaymentStyle(status: Enrollment["paymentStatus"]) {
  switch (status) {
    case "paid":
    case "not_required":
      return "text-emerald-700";

    case "pending":
      return "text-amber-700";

    case "failed":
    case "refunded":
      return "text-red-700";

    default:
      return "text-slate-600";
  }
}

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/enrollments/my", {
        withCredentials: true,
      });

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data?.enrollments ||
          data?.data?.enrollments ||
          data?.data ||
          [];

      setEnrollments(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const course = getCourse(enrollment.course);

    const matchesSearch =
      !search ||
      (course?.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (enrollment.transactionId || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || enrollment.status === filter;

    return matchesSearch && matchesFilter;
  });

  const activeCount = enrollments.filter(
    (item) => item.status === "active"
  ).length;

  const pendingCount = enrollments.filter(
    (item) => item.status === "pending"
  ).length;

  const cancelledCount = enrollments.filter(
    (item) => item.status === "cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0B1930] px-5 py-12 text-white md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold uppercase tracking-[0.2em] text-[#D99B33]">
            Student Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">
            My Enrollments
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Track your course enrollment requests, payment status, and
            approval progress from one place.
          </p>

          <Link
            href="/course"
            className="mt-6 inline-flex rounded-lg bg-[#D99B33] px-5 py-3 font-bold text-[#0B1930] transition hover:bg-[#e9ad4b]"
          >
            + Explore Courses
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Enrollments"
            count={enrollments.length}
            icon="▤"
          />

          <SummaryCard
            title="Active Courses"
            count={activeCount}
            icon="✓"
            accent="emerald"
          />

          <SummaryCard
            title="Pending Approval"
            count={pendingCount}
            icon="◷"
            accent="amber"
          />

          <SummaryCard
            title="Cancelled"
            count={cancelledCount}
            icon="×"
            accent="red"
          />
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center"
          >
            <p>{error}</p>

            <button
              onClick={loadEnrollments}
              className="shrink-0 rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <div>
              <label
                htmlFor="enrollment-search"
                className="mb-2 block text-sm font-bold text-[#0B1930]"
              >
                Search Enrollments
              </label>

              <input
                id="enrollment-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Course title or transaction ID..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#D99B33] focus:ring-2 focus:ring-[#D99B33]/20"
              />
            </div>

            <div>
              <label
                htmlFor="enrollment-filter"
                className="mb-2 block text-sm font-bold text-[#0B1930]"
              >
                Enrollment Status
              </label>

              <select
                id="enrollment-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#D99B33]"
              >
                <option value="all">All Enrollments</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <button
              onClick={loadEnrollments}
              disabled={loading}
              className="rounded-lg bg-[#132A4C] px-5 py-3 font-semibold text-white transition hover:bg-[#203c63] disabled:opacity-60"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-5 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="h-40 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-5 h-10 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Enrollment List */}
        {!loading && filteredEnrollments.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredEnrollments.map((enrollment) => {
              const course = getCourse(enrollment.course);
              const courseId = getCourseId(enrollment.course);

              return (
                <article
                  key={enrollment._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="h-48 shrink-0 bg-gradient-to-br from-[#0B1930] to-[#28466C] sm:h-auto sm:min-h-64 sm:w-44">
                      {course?.image ? (
                        <img
                          src={course.image}
                          alt={course.title || "Course"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-40 items-center justify-center">
                          <span className="text-6xl text-[#D99B33]">
                            ☪
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {course?.category || "Islamic Studies"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                            enrollment.status
                          )}`}
                        >
                          {enrollment.status}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-extrabold leading-snug text-[#0B1930]">
                        {course?.title || "Course details unavailable"}
                      </h2>

                      {course?.instructor?.name && (
                        <p className="mt-2 text-sm text-slate-500">
                          Instructor: {course.instructor.name}
                        </p>
                      )}

                      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-500">
                            Enrollment Amount
                          </span>

                          <span className="font-bold text-[#0B1930]">
                            {formatPrice(
                              enrollment.amount,
                              enrollment.currency
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-500">
                            Payment Status
                          </span>

                          <span
                            className={`text-sm font-bold ${getPaymentStyle(
                              enrollment.paymentStatus
                            )}`}
                          >
                            {enrollment.paymentStatus.replace("_", " ")}
                          </span>
                        </div>

                        {enrollment.transactionId && (
                          <div>
                            <p className="text-xs text-slate-500">
                              Transaction ID
                            </p>

                            <p className="mt-1 break-all rounded-md bg-slate-50 p-2 font-mono text-xs text-slate-700">
                              {enrollment.transactionId}
                            </p>
                          </div>
                        )}

                        {enrollment.rejectionReason && (
                          <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                            <p className="text-xs font-bold text-red-700">
                              Rejection Reason
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                              {enrollment.rejectionReason}
                            </p>
                          </div>
                        )}

                        {enrollment.status === "pending" && (
                          <p className="rounded-lg bg-amber-50 p-3 text-sm leading-5 text-amber-800">
                            Your enrollment request is awaiting admin
                            approval. You can check back here for updates.
                          </p>
                        )}

                        {enrollment.status === "active" && (
                          <p className="rounded-lg bg-emerald-50 p-3 text-sm leading-5 text-emerald-800">
                            Your enrollment is active. You can access the
                            course when its learning area is available.
                          </p>
                        )}

                        {enrollment.status === "cancelled" && (
                          <p className="rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-800">
                            This enrollment has been cancelled.
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-5">
                        {courseId && (
                          <Link
                            href="/course"
                            className="inline-flex w-full items-center justify-center rounded-lg border border-[#132A4C] px-4 py-3 text-sm font-bold text-[#132A4C] transition hover:bg-[#132A4C] hover:text-white"
                          >
                            Browse Courses
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEnrollments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D99B33]/15 text-3xl text-[#A66E13]">
              ▤
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-[#0B1930]">
              {enrollments.length === 0
                ? "No Enrollments Yet"
                : "No Matching Enrollments"}
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-6 text-slate-500">
              {enrollments.length === 0
                ? "You have not enrolled in any courses yet. Explore the available courses and submit your first enrollment request."
                : "Try changing your search or status filter to find your enrollment."}
            </p>

            {enrollments.length === 0 ? (
              <Link
                href="/course"
                className="mt-6 inline-flex rounded-lg bg-[#D99B33] px-6 py-3 font-bold text-[#0B1930] transition hover:bg-[#e9ad4b]"
              >
                Explore Courses
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 rounded-lg bg-[#132A4C] px-6 py-3 font-semibold text-white hover:bg-[#203c63]"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-lg font-extrabold text-[#0B1930]">
            Ilm<span className="text-[#D99B33]">Hub</span>
          </p>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IlmHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function SummaryCard({
  title,
  count,
  icon,
  accent = "navy",
}: {
  title: string;
  count: number;
  icon: string;
  accent?: "navy" | "emerald" | "amber" | "red";
}) {
  const accentStyles = {
    navy: "bg-[#132A4C]/10 text-[#132A4C]",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold ${accentStyles[accent]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-extrabold text-[#0B1930]">{count}</p>
    </div>
  );
}