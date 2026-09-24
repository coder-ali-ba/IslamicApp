"use client";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  MessageCircleQuestion,
  ClipboardList,
  MessageSquare,
  Settings,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Classes",
    href: "/admin/classes",
    icon: Video,
  },
  {
    label: "Fatwas",
    href: "/admin/fatwas",
    icon: MessageCircleQuestion,
  },
  {
    label: "Enrollments",
    href: "/admin/enrollments",
    icon: ClipboardList,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const {
    user,
    loading: authLoading,
    logout,
  } = useAuth();

  const activeItem =
    menuItems.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(
          `${item.href}/`
        )
    )?.label ?? "Dashboard";

  const userName =
    user?.name || "Admin";

  const userEmail =
    user?.email || "";

  const userRole =
    user?.role || "admin";

  const userInitials =
    userName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "A";

  const displayRole =
    userRole === "admin"
      ? "Administrator"
      : userRole.charAt(0).toUpperCase() +
        userRole.slice(1);

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={["admin"]}
    >
      <div className="min-h-screen bg-[#faf9f6] text-stone-900">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 z-40 bg-stone-950/50 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-stone-950 text-white transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {/* Brand */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link
              href="/admin"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d] text-stone-950">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-tight">
                  IlmHub
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  Admin Panel
                </p>
              </div>
            </Link>

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="rounded-lg p-2 text-stone-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6 scrollbar-none">
            <p className="mb-3 px-3 text-[10px]  font-semibold uppercase tracking-[0.2em] text-stone-500">
              Main Menu
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(
                    `${item.href}/`
                  ));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-[#d6b56d] text-stone-950"
                      : "text-stone-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              );
            })}

            <div className="my-6 border-t border-white/10" />

            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              System
            </p>

            <Link
              href="/admin/settings"
              onClick={() =>
                setSidebarOpen(false)
              }
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                pathname.startsWith(
                  "/admin/settings"
                )
                  ? "bg-[#d6b56d] text-stone-950"
                  : "text-stone-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="h-[18px] w-[18px]" />

              Settings
            </Link>
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d6b56d] font-semibold text-stone-950">
                  {userInitials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {authLoading
                      ? "Loading..."
                      : userName}
                  </p>

                  <p className="truncate text-xs text-stone-500">
                    {authLoading
                      ? ""
                      : userEmail ||
                        displayRole}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-stone-400 transition hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />

                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="lg:pl-72">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-stone-200 bg-[#faf9f6]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 hover:border-[#d6b56d] lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#967438]">
                  Administration
                </p>

                <h1 className="mt-0.5 text-lg font-semibold text-stone-900">
                  {activeItem}
                </h1>
              </div>
            </div>

            <button
              className="relative rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 transition hover:border-[#d6b56d] hover:text-stone-900"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d6b56d]" />
            </button>
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