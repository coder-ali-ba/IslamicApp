"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  UserCircle,
  Users,
  X,
  Bell,
  LogOut,
} from "lucide-react";

import api from "@/app/src/lib/api";

const menuItems = [
  {
    name: "Dashboard",
    href: "/teacher",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/teacher/courses",
    icon: BookOpen,
  },
  {
    name: "My Classes",
    href: "/teacher/classes",
    icon: CalendarDays,
  },
  {
    name: "My Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    name: "Messages",
    href: "/teacher/messages",
    icon: MessageSquare,
  },
];

const accountItems = [
  {
    name: "Profile",
    href: "/teacher/profile",
    icon: UserCircle,
  },
  {
    name: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
];

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading: authLoading, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === "/teacher") {
      return pathname === "/teacher";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const currentItem =
    [...menuItems, ...accountItems].find((item) =>
      isActive(item.href)
    )?.name || "Teacher Dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  // Auth data loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-[#967438]" />

          <p className="mt-3 text-sm text-stone-500">
            Loading teacher panel...
          </p>
        </div>
      </div>
    );
  }

  const userName = user?.name || "Teacher";
  const userEmail = user?.email || "";
  const userRole = user?.role || "teacher";

  // Generate initials from real user name
  const userInitials =
    userName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "T";

  // Display role
  const displayRole =
    userRole === "scholar"
      ? "Scholar"
      : userRole === "teacher"
        ? "Teacher"
        : userRole.charAt(0).toUpperCase() + userRole.slice(1);

  return (
    <ProtectedRoute allowedRoles={["scholar", "teacher"]}>
      <div className="min-h-screen bg-[#faf9f6] text-stone-900">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-stone-950 text-stone-300 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-stone-800 px-6">
            <Link
              href="/teacher"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d] text-stone-950">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-lg font-semibold text-white">
                  IlmHub
                </p>

                <p className="text-xs text-stone-500">
                  Teacher Panel
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Real Teacher Profile */}
          <div className="mx-4 mt-5 rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
            <div className="flex items-center gap-3">
              {/* Initials */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d6b56d] text-sm font-semibold text-stone-950">
                {userInitials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {userName}
                </p>

                <p className="mt-0.5 truncate text-xs text-stone-500">
                  {displayRole}
                </p>

                {userEmail && (
                  <p className="mt-0.5 truncate text-[10px] text-stone-600">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600">
              Main Menu
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:bg-stone-900 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 ${
                      active
                        ? "text-[#d6b56d]"
                        : "text-stone-500 group-hover:text-stone-300"
                    }`}
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
                  )}
                </Link>
              );
            })}

            <div className="my-6 border-t border-stone-800" />

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-600">
              Account
            </p>

            {accountItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:bg-stone-900 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      active
                        ? "text-[#d6b56d]"
                        : "text-stone-500 group-hover:text-stone-300"
                    }`}
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-stone-800 p-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-[18px] w-[18px]" />

              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="lg:pl-72">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-stone-200 bg-[#faf9f6]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 transition hover:border-[#d6b56d] lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#967438]">
                  Teacher Panel
                </p>

                <h1 className="mt-0.5 text-lg font-semibold text-stone-900">
                  {currentItem}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification */}
              <button
                type="button"
                className="relative rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 transition hover:border-[#d6b56d] hover:text-stone-900"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
              </button>

              {/* Real Profile */}
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="max-w-[180px] truncate text-sm font-medium text-stone-900">
                    {userName}
                  </p>

                  <p className="text-xs text-stone-500">
                    {displayRole}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-[#d6b56d]">
                  {userInitials}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}