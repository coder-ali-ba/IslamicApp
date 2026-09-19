"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Search,
  Users,
  XCircle,
} from "lucide-react";

type Enrollment = {
  id: string;
  student: string;
  email: string;
  course: string;
  teacher: string;
  enrolledAt: string;
  payment: "Paid" | "Pending";
  status: "Active" | "Completed" | "Cancelled";
};

const enrollments: Enrollment[] = [
  {
    id: "ENR-1001",
    student: "Ahmed Khan",
    email: "ahmed@example.com",
    course: "Learn Quran Reading",
    teacher: "Ustadh Muhammad Ahmed",
    enrolledAt: "Sep 16, 2026",
    payment: "Paid",
    status: "Active",
  },
  {
    id: "ENR-1002",
    student: "Fatima Ali",
    email: "fatima@example.com",
    course: "Quran with Tajweed",
    teacher: "Ustadh Abdul Rahman",
    enrolledAt: "Sep 15, 2026",
    payment: "Paid",
    status: "Active",
  },
  {
    id: "ENR-1003",
    student: "Usman Malik",
    email: "usman@example.com",
    course: "Understanding Hadith",
    teacher: "Dr. Ibrahim Khan",
    enrolledAt: "Sep 14, 2026",
    payment: "Pending",
    status: "Active",
  },
  {
    id: "ENR-1004",
    student: "Ayesha Noor",
    email: "ayesha@example.com",
    course: "Arabic Language Basics",
    teacher: "Ustadh Omar Farooq",
    enrolledAt: "Sep 12, 2026",
    payment: "Paid",
    status: "Completed",
  },
  {
    id: "ENR-1005",
    student: "Bilal Ahmed",
    email: "bilal@example.com",
    course: "Essential Fiqh for Muslims",
    teacher: "Mufti Abdullah",
    enrolledAt: "Sep 11, 2026",
    payment: "Paid",
    status: "Active",
  },
  {
    id: "ENR-1006",
    student: "Maryam Hassan",
    email: "maryam@example.com",
    course: "Life of the Prophet ﷺ",
    teacher: "Dr. Hamza Malik",
    enrolledAt: "Sep 09, 2026",
    payment: "Paid",
    status: "Cancelled",
  },
];

export default function AdminEnrollmentsPage() {
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const value = search.toLowerCase();

      const matchesSearch =
        item.student.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.course.toLowerCase().includes(value) ||
        item.id.toLowerCase().includes(value);

      const matchesPayment =
        payment === "All" || item.payment === payment;

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [search, payment, status]);

  const active = enrollments.filter(
    (item) => item.status === "Active"
  ).length;

  const completed = enrollments.filter(
    (item) => item.status === "Completed"
  ).length;

  const paid = enrollments.filter(
    (item) => item.payment === "Paid"
  ).length;

  const pending = enrollments.filter(
    (item) => item.payment === "Pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            Learning Management
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Enrollments
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Monitor student enrollments, course progress, and payment status.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Enrollments"
            value={enrollments.length}
          />

          <StatCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Active Students"
            value={active}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Paid"
            value={paid}
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Pending Payment"
            value={pending}
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search student, course, email or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="mt-5">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {filteredEnrollments.length}
            </span>{" "}
            enrollments
          </p>
        </div>

        {/* Desktop Table */}
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Teacher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Enrolled
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Payment
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
                {filteredEnrollments.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-stone-50/70"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-[#d6b56d]">
                          {item.student.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-stone-900">
                            {item.student}
                          </p>

                          <p className="mt-0.5 text-xs text-stone-400">
                            {item.email}
                          </p>

                          <p className="mt-0.5 text-xs text-stone-400">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="max-w-xs text-sm font-medium text-stone-700">
                        {item.course}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {item.teacher}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <CalendarDays className="h-4 w-4 text-stone-400" />
                        {item.enrolledAt}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <PaymentBadge status={item.payment} />
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-6 py-5">
                      <button className="text-sm font-medium text-[#967438] transition hover:text-stone-900">
                        View
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
          {filteredEnrollments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-[#d6b56d]">
                  {item.student.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium text-stone-900">
                        {item.student}
                      </h2>

                      <p className="mt-1 text-xs text-stone-400">
                        {item.email}
                      </p>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-stone-50 p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#967438]" />

                  <p className="text-sm font-medium text-stone-800">
                    {item.course}
                  </p>
                </div>

                <p className="mt-2 text-xs text-stone-500">
                  Teacher: {item.teacher}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoItem
                  label="Enrollment ID"
                  value={item.id}
                />

                <InfoItem
                  label="Date"
                  value={item.enrolledAt}
                />

                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="text-xs text-stone-400">
                    Payment
                  </p>

                  <div className="mt-2">
                    <PaymentBadge status={item.payment} />
                  </div>
                </div>

                <div className="rounded-xl bg-stone-50 p-3">
                  <p className="text-xs text-stone-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end border-t border-stone-100 pt-4">
                <button className="text-sm font-medium text-[#967438]">
                  View Enrollment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEnrollments.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <Users className="mx-auto h-8 w-8 text-stone-300" />

            <h3 className="mt-4 font-medium text-stone-900">
              No enrollments found
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

function PaymentBadge({
  status,
}: {
  status: Enrollment["payment"];
}) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#967438]" />
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
      <Clock3 className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: Enrollment["status"];
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700">
        Active
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500">
      <XCircle className="h-3.5 w-3.5" />
      Cancelled
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