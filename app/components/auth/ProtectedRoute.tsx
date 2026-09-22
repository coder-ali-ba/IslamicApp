"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";

type AllowedRole = "student" | "teacher" | "scholar" | "admin";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (
        user.role === "teacher" ||
        user.role === "scholar"
      ) {
        router.replace("/teacher");
      } else {
        router.replace("/");
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-[#d6b56d]" />

          <p className="mt-4 text-sm text-stone-500">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}