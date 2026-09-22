"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { useAuth } from "@/app/context/AuthContext";

type RequireAuthActionProps = {
  children: ReactNode;
  requiredRole?: "student" | "teacher" | "scholar" | "admin";
  redirectPath?: string;
};

export default function RequireAuthAction({
  children,
  requiredRole,
  redirectPath,
}: RequireAuthActionProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (loading) return;

    if (!user) {
      const currentPath =
        window.location.pathname + window.location.search;

      router.push(
        `/login?redirect=${encodeURIComponent(
          redirectPath || currentPath
        )}`
      );

      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      return;
    }
  };

  if (
    requiredRole &&
    user &&
    user.role !== requiredRole
  ) {
    return <>{children}</>;
  }

  return (
    <div onClick={handleClick} className="contents">
      {children}
    </div>
  );
}