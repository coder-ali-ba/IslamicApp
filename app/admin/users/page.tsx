"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  User,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    role: "Student",
    status: "Active",
    joined: "Sep 12, 2026",
  },
  {
    id: 2,
    name: "Fatima Ali",
    email: "fatima@example.com",
    role: "Student",
    status: "Active",
    joined: "Sep 10, 2026",
  },
  {
    id: 3,
    name: "Ustadh Muhammad Ahmed",
    email: "muhammad@example.com",
    role: "Teacher",
    status: "Active",
    joined: "Sep 05, 2026",
  },
  {
    id: 4,
    name: "Usman Malik",
    email: "usman@example.com",
    role: "Student",
    status: "Inactive",
    joined: "Aug 28, 2026",
  },
  {
    id: 5,
    name: "Dr. Ibrahim Khan",
    email: "ibrahim@example.com",
    role: "Teacher",
    status: "Active",
    joined: "Aug 24, 2026",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === "All" || user.role === role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">Management</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
            Users
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Manage students, teachers, and administrators.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-10 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 md:w-44"
            >
              <option value="All">All Roles</option>
              <option value="Student">Students</option>
              <option value="Teacher">Teachers</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/70">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-stone-50/60">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                      {user.role === "Teacher" ? (
                        <GraduationCap className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.status === "Active"
                          ? "text-emerald-700"
                          : "text-stone-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-600"
                            : "bg-stone-300"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-stone-500">
                    {user.joined}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      aria-label={`Actions for ${user.name}`}
                      className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-stone-100 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                    {user.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  aria-label={`Actions for ${user.name}`}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                  {user.role}
                </span>

                <span
                  className={`text-xs font-medium ${
                    user.status === "Active"
                      ? "text-emerald-700"
                      : "text-stone-400"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-stone-500">
              No users found.
            </div>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-stone-400">
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </div>
  );
}