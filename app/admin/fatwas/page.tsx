"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Eye,
  FileText,
  MessageCircleQuestion,
  Plus,
  Search,
} from "lucide-react";

type FatwaItem = {
  id: string;
  question: string;
  category:
    | "Salah"
    | "Fasting"
    | "Zakat"
    | "Hajj & Umrah"
    | "Family"
    | "Business"
    | "General";
  scholar: string;
  date: string;
  views: number;
  status: "Published" | "Draft";
};

const fatwas: FatwaItem[] = [
  {
    id: "1",
    question: "What is the importance of establishing Salah?",
    category: "Salah",
    scholar: "IlmHub Scholar",
    date: "Sep 15, 2026",
    views: 1248,
    status: "Published",
  },
  {
    id: "2",
    question: "Can a traveler postpone their fast during Ramadan?",
    category: "Fasting",
    scholar: "IlmHub Scholar",
    date: "Sep 13, 2026",
    views: 986,
    status: "Published",
  },
  {
    id: "3",
    question: "When is Zakat due on savings?",
    category: "Zakat",
    scholar: "Mufti Abdullah",
    date: "Sep 11, 2026",
    views: 752,
    status: "Published",
  },
  {
    id: "4",
    question: "Is intention necessary before Salah?",
    category: "Salah",
    scholar: "IlmHub Scholar",
    date: "Sep 09, 2026",
    views: 634,
    status: "Published",
  },
  {
    id: "5",
    question: "What principles should Muslims follow in business transactions?",
    category: "Business",
    scholar: "Mufti Abdullah",
    date: "Sep 07, 2026",
    views: 521,
    status: "Published",
  },
  {
    id: "6",
    question: "What are some important principles regarding family relationships?",
    category: "Family",
    scholar: "Dr. Hamza Malik",
    date: "Sep 05, 2026",
    views: 389,
    status: "Draft",
  },
];

export default function AdminFatwasPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredFatwas = useMemo(() => {
    return fatwas.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.question.toLowerCase().includes(searchValue) ||
        item.scholar.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const published = fatwas.filter(
    (item) => item.status === "Published"
  ).length;

  const drafts = fatwas.filter(
    (item) => item.status === "Draft"
  ).length;

  const totalViews = fatwas.reduce(
    (total, item) => total + item.views,
    0
  );

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
              Manage questions, answers, scholars, and published guidance.
            </p>
          </div>

          <Link
            href="/admin/fatwas/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Fatwa
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Total Fatwas"
            value={fatwas.length}
          />

          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Published"
            value={published}
          />

          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Drafts"
            value={drafts}
          />

          <StatCard
            icon={<Eye className="h-5 w-5" />}
            label="Total Views"
            value={totalViews}
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search questions or scholars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Categories</option>
              <option value="Salah">Salah</option>
              <option value="Fasting">Fasting</option>
              <option value="Zakat">Zakat</option>
              <option value="Hajj & Umrah">Hajj & Umrah</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="General">General</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-5">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {filteredFatwas.length}
            </span>{" "}
            fatwas
          </p>
        </div>

        {/* Desktop Table */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
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
                    Views
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
                {filteredFatwas.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-stone-50/70"
                  >
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

                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {item.scholar}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {item.date}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-sm text-stone-600">
                        <Eye className="h-4 w-4 text-stone-400" />
                        {item.views.toLocaleString()}
                      </div>
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
          {filteredFatwas.map((item) => (
            <div
              key={item.id}
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

                    <StatusBadge status={item.status} />
                  </div>

                  <p className="mt-2 text-sm text-stone-500">
                    {item.scholar}
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
                  value={item.date}
                />

                <InfoItem
                  label="Views"
                  value={item.views.toLocaleString()}
                />

                <InfoItem
                  label="Status"
                  value={item.status}
                />
              </div>

              <div className="mt-5 flex justify-end border-t border-stone-100 pt-4">
                <button className="text-sm font-medium text-[#967438]">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFatwas.length === 0 && (
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

      <p className="mt-5 text-sm text-stone-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: FatwaItem["status"];
}) {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
      Draft
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
      <p className="text-xs text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-stone-700">
        {value}
      </p>
    </div>
  );
}