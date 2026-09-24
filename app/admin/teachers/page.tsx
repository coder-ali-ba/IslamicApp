"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  GraduationCap,
  UserCheck,
  UserX,
  Mail,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
  isActive: boolean;
  isVerified: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "teacher" | "scholar">("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeachers = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/auth/teachers`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch teachers");
      }

      setTeachers(data.teachers || []);
    } catch (error) {
      console.error("Fetch Teachers Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading teachers",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        teacher.name.toLowerCase().includes(searchValue) ||
        teacher.email.toLowerCase().includes(searchValue);

      const matchesRole = role === "all" || teacher.role === role;

      return matchesSearch && matchesRole;
    });
  }, [teachers, search, role]);

  const teacherCount = teachers.filter(
    (item) => item.role === "teacher",
  ).length;

  const scholarCount = teachers.filter(
    (item) => item.role === "scholar",
  ).length;

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = async (
  teacherId: string,
  currentStatus: boolean
) => {
  try {
    setUpdatingId(teacherId);

    const response = await fetch(
      `${API_URL}/auth/admin/users/${teacherId}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update teacher status"
      );
    }

    // UI immediately update
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher._id === teacherId
          ? {
              ...teacher,
              isActive: data.user.isActive,
            }
          : teacher
      )
    );
  } catch (error) {
    console.error("Teacher Status Error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to update teacher status"
    );
  } finally {
    setUpdatingId(null);
  }
};

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Teachers & Scholars
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Manage teachers and scholars registered on IlmHub.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTeachers(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-[#d6b56d] hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">Total Teachers</p>

              <p className="mt-2 text-3xl font-semibold text-stone-900">
                {teachers.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Teachers</p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {teacherCount}
          </p>

          <p className="mt-1 text-xs text-stone-400">Teaching staff</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Scholars</p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {scholarCount}
          </p>

          <p className="mt-1 text-xs text-stone-400">Islamic scholars</p>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Role */}
          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "all" | "teacher" | "scholar")
            }
            className="h-11 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-48"
          >
            <option value="all">All Roles</option>
            <option value="teacher">Teachers</option>
            <option value="scholar">Scholars</option>
          </select>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => fetchTeachers()}
            className="mt-2 text-xs font-medium text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Result Count */}
      {!loading && !error && (
        <p className="text-sm text-stone-500">
          Showing{" "}
          <span className="font-medium text-stone-900">
            {filteredTeachers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-stone-900">{teachers.length}</span>{" "}
          members
        </p>
      )}

      {/* Loading */}
      {loading && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-stone-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-stone-200" />
                  <div className="h-3 w-44 rounded bg-stone-100" />
                </div>
              </div>

              <div className="mt-5 h-10 rounded-xl bg-stone-100" />
            </div>
          ))}
        </section>
      )}

      {/* Teachers */}
      {!loading && !error && filteredTeachers.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <article
              key={teacher._id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 text-lg font-semibold text-[#d6b56d]">
                    {teacher.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-stone-900">
                      {teacher.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="More options"
                  className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Role */}
              <div className="mt-5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    teacher.role === "scholar"
                      ? "bg-[#f5ecd9] text-[#806126]"
                      : "bg-stone-100 text-stone-700"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />

                  {teacher.role === "scholar" ? "Scholar" : "Teacher"}
                </span>
              </div>

              {/* Status */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-stone-50 p-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />

                  <span className="text-sm font-medium text-stone-700">
                    Active
                  </span>
                </div>

                <span className="text-xs text-stone-400">Staff member</span>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2 border-t border-stone-100 pt-4">
                <Link
                  href={`/admin/teachers/${teacher._id}`}
                  className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:border-[#d6b56d] hover:text-stone-900"
                >
                  View Profile
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleToggleStatus(teacher._id, teacher.isActive)
                  }
                  disabled={updatingId === teacher._id}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    teacher.isActive
                      ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {updatingId === teacher._id
                    ? "Updating..."
                    : teacher.isActive
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Empty */}
      {!loading && !error && filteredTeachers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-stone-300" />

          <h3 className="mt-4 font-semibold text-stone-900">
            No teachers found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or role filter.
          </p>
        </div>
      )}
    </div>
  );
}
