"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  MoreHorizontal,
  UserCog,
} from "lucide-react";

import api from "@/app/src/lib/api";

type UserRole =
  | "student"
  | "teacher"
  | "scholar"
  | "admin";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
};

type Stats = {
  totalUsers: number;
  students: number;
  teachers: number;
  scholars: number;
  admins: number;
  activeUsers: number;
  inactiveUsers: number;
};

const initialStats: Stats = {
  totalUsers: 0,
  students: 0,
  teachers: 0,
  scholars: 0,
  admins: 0,
  activeUsers: 0,
  inactiveUsers: 0,
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  scholar: "Scholar",
  admin: "Admin",
};

const roleClasses: Record<UserRole, string> = {
  student: "bg-stone-100 text-stone-700",
  teacher: "bg-amber-50 text-amber-700",
  scholar: "bg-yellow-50 text-yellow-700",
  admin: "bg-stone-900 text-white",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats>(initialStats);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const query = params.toString();

      const response = await api.get(
        `/auth/admin/users${query ? `?${query}` : ""}`
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
        setStats(response.data.stats || initialStats);
      }
    } catch (error: any) {
      console.error("Fetch users error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter change
  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  // Search with small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (
    userId: string,
    currentStatus: boolean
  ) => {
    const action = currentStatus
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) return;

    try {
      await api.patch(
        `/auth/admin/users/${userId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      await fetchUsers();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to update user status."
      );
    }
  };

  const handleRoleChange = async (
    userId: string,
    currentRole: UserRole
  ) => {
    const newRole = window.prompt(
      "Enter new role: student, teacher, scholar, admin",
      currentRole
    );

    if (!newRole) return;

    const normalizedRole = newRole
      .trim()
      .toLowerCase();

    const allowedRoles = [
      "student",
      "teacher",
      "scholar",
      "admin",
    ];

    if (!allowedRoles.includes(normalizedRole)) {
      alert(
        "Invalid role. Use student, teacher, scholar or admin."
      );
      return;
    }

    if (normalizedRole === currentRole) {
      return;
    }

    try {
      await api.patch(
        `/auth/admin/users/${userId}/role`,
        {
          role: normalizedRole,
        }
      );

      await fetchUsers();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to update user role."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">
            User Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-stone-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Manage students, teachers, scholars and admins.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Students"
          value={stats.students}
          icon={<GraduationCap size={20} />}
        />

        <StatCard
          title="Teachers & Scholars"
          value={
            stats.teachers + stats.scholars
          }
          icon={<UserCheck size={20} />}
        />

        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<ShieldCheck size={20} />}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#c5a45d] focus:bg-white"
            />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#c5a45d]"
          >
            <option value="all">
              All Roles
            </option>

            <option value="student">
              Students
            </option>

            <option value="teacher">
              Teachers
            </option>

            <option value="scholar">
              Scholars
            </option>

            <option value="admin">
              Admins
            </option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#c5a45d]"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-stone-900">
              All Users
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {users.length} users found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Loading users...
            </div>
          </div>
        ) : users.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Role
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Verification
                    </th>

                    <th className="px-5 py-4">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-stone-50/60"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={user.name}
                          />

                          <div>
                            <Link
                              href={`/admin/users/${user._id}`}
                              className="font-medium text-stone-900 hover:text-[#967438]"
                            >
                              {user.name}
                            </Link>

                            <p className="text-sm text-stone-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleClasses[user.role]}`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          active={user.isActive}
                        />
                      </td>

                      {/* Verification */}
                      <td className="px-5 py-4">
                        {user.isVerified ? (
                          <span className="text-sm font-medium text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="text-sm text-stone-400">
                            Not verified
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm text-stone-500">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleRoleChange(
                                user._id,
                                user.role
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                          >
                            <UserCog size={14} />
                            Role
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                user._id,
                                user.isActive
                              )
                            }
                            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                              user.isActive
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {user.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-stone-100 md:hidden">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <UserAvatar
                        name={user.name}
                      />

                      <div className="min-w-0">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="block truncate font-medium text-stone-900"
                        >
                          {user.name}
                        </Link>

                        <p className="truncate text-sm text-stone-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <MoreHorizontal
                      size={20}
                      className="shrink-0 text-stone-400"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleClasses[user.role]}`}
                    >
                      {roleLabels[user.role]}
                    </span>

                    <StatusBadge
                      active={user.isActive}
                    />

                    {user.isVerified && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          user._id,
                          user.role
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
                    >
                      <UserCog size={15} />
                      Change Role
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          user._id,
                          user.isActive
                        )
                      }
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        user.isActive
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {user.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e5] text-[#967438]">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-stone-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        {title}
      </p>
    </div>
  );
}

function UserAvatar({
  name,
}: {
  name: string;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
      {initials || "U"}
    </div>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-red-600">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      Inactive
    </span>
  );
}

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

function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
        <Users
          size={26}
          className="text-stone-400"
        />
      </div>

      <h3 className="mt-4 font-semibold text-stone-800">
        No users found
      </h3>

      <p className="mt-1 text-sm text-stone-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}