"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Eye,
  FileText,
  MessageCircleQuestion,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";

type FatwaStatus =
  | "Pending"
  | "Answered"
  | "Rejected"
  | "Closed";

type FatwaCategory =
  | "Aqeedah"
  | "Fiqh"
  | "Worship"
  | "Family"
  | "Finance"
  | "Business"
  | "Marriage"
  | "Divorce"
  | "Halal & Haram"
  | "Quran"
  | "Hadith"
  | "Other";

type PopulatedUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

type FatwaItem = {
  _id: string;
  question: string;
  answer: string;
  category: FatwaCategory;
  status: FatwaStatus;
  askedBy: PopulatedUser | null;
  scholar: PopulatedUser | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

const categories: FatwaCategory[] = [
  "Aqeedah",
  "Fiqh",
  "Worship",
  "Family",
  "Finance",
  "Business",
  "Marriage",
  "Divorce",
  "Halal & Haram",
  "Quran",
  "Hadith",
  "Other",
];

const statuses: FatwaStatus[] = [
  "Pending",
  "Answered",
  "Rejected",
  "Closed",
];

export default function AdminFatwasPage() {
  const [fatwas, setFatwas] = useState<FatwaItem[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const fetchFatwas = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/fatwas/admin`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load fatwas"
        );
      }

      setFatwas(data.fatwas || []);
    } catch (error) {
      console.error("Fetch Fatwas Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load fatwas"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFatwas();
  }, []);

  const filteredFatwas = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return fatwas.filter((item) => {
      const scholarName =
        item.scholar?.name?.toLowerCase() || "";

      const question =
        item.question?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        question.includes(searchValue) ||
        scholarName.includes(searchValue);

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
  }, [fatwas, search, category, status]);

  const pending = fatwas.filter(
    (item) => item.status === "Pending"
  ).length;

  const answered = fatwas.filter(
    (item) => item.status === "Answered"
  ).length;

  const published = fatwas.filter(
    (item) => item.published
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

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Islamic Guidance
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Fatwa Management
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage questions, answers, scholars, and
              published guidance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchFatwas(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

            <Link
              href="/admin/fatwas/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" />
              Add Fatwa
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-red-700">
                Failed to load fatwas
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchFatwas()}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <FileText className="h-5 w-5" />
            }
            label="Total Fatwas"
            value={fatwas.length}
          />

          <StatCard
            icon={
              <BookOpen className="h-5 w-5" />
            }
            label="Published"
            value={published}
          />

          <StatCard
            icon={
              <MessageCircleQuestion className="h-5 w-5" />
            }
            label="Pending"
            value={pending}
          />

          <StatCard
            icon={
              <FileText className="h-5 w-5" />
            }
            label="Answered"
            value={answered}
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
                placeholder="Search questions or scholars..."
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

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
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

              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Count */}
        <div className="mt-5">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {filteredFatwas.length}
            </span>{" "}
            fatwas
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
            <div className="divide-y divide-stone-100">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse px-6 py-6"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-10 w-10 rounded-lg bg-stone-200" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-stone-200" />
                        <div className="h-3 w-1/3 rounded bg-stone-100" />
                      </div>

                      <div className="h-7 w-20 rounded-full bg-stone-100" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Desktop Table */}
        {!loading && (
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-stone-200 bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Question
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Scholar
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Published
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredFatwas.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-stone-50/70"
                    >
                      {/* Question */}
                      <td className="max-w-sm px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[#967438]">
                            <MessageCircleQuestion className="h-4 w-4" />
                          </div>

                          <p className="font-medium leading-6 text-stone-900">
                            {item.question}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Scholar */}
                      <td className="px-6 py-5 text-sm text-stone-600">
                        {item.scholar?.name ||
                          "Not assigned"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-sm text-stone-600">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      {/* Published */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                            item.published
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border border-stone-200 bg-stone-50 text-stone-600"
                          }`}
                        >
                          {item.published
                            ? "Published"
                            : "Not Published"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5">
                        <Link
                          href={`/admin/fatwas/${item._id}`}
                          className="text-sm font-medium text-[#967438] transition hover:text-stone-900"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile */}
        {!loading && (
          <div className="mt-4 space-y-4 md:hidden">
            {filteredFatwas.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                    <MessageCircleQuestion className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-medium leading-6 text-stone-900">
                        {item.question}
                      </h2>

                      <StatusBadge
                        status={item.status}
                      />
                    </div>

                    <p className="mt-2 text-sm text-stone-500">
                      {item.scholar?.name ||
                        "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <InfoItem
                    label="Category"
                    value={item.category}
                  />

                  <InfoItem
                    label="Date"
                    value={formatDate(
                      item.createdAt
                    )}
                  />

                  <InfoItem
                    label="Status"
                    value={item.status}
                  />

                  <InfoItem
                    label="Published"
                    value={
                      item.published
                        ? "Yes"
                        : "No"
                    }
                  />
                </div>

                <div className="mt-5 flex justify-end border-t border-stone-100 pt-4">
                  <Link
                    href={`/admin/fatwas/${item._id}`}
                    className="text-sm font-medium text-[#967438]"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          filteredFatwas.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <MessageCircleQuestion className="mx-auto h-8 w-8 text-stone-300" />

              <h3 className="mt-4 font-medium text-stone-900">
                No fatwas found
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

      <p className="mt-5 text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: FatwaStatus;
}) {
  const styles: Record<FatwaStatus, string> = {
    Pending:
      "border border-amber-200 bg-amber-50 text-amber-700",

    Answered:
      "border border-emerald-200 bg-emerald-50 text-emerald-700",

    Rejected:
      "border border-red-200 bg-red-50 text-red-700",

    Closed:
      "border border-stone-200 bg-stone-100 text-stone-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <p className="text-xs text-stone-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-stone-700">
        {value}
      </p>
    </div>
  );
}