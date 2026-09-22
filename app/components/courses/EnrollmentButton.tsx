"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

type EnrollButtonProps = {
  courseId: string;
};

export default function EnrollButton({
  courseId,
}: EnrollButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState("");

  const handleEnroll = async () => {
    if (loading || enrolling || enrolled) return;

    // User is not logged in
    if (!user) {
      const currentPath = window.location.pathname;

      router.push(
        `/login?redirect=${encodeURIComponent(currentPath)}`
      );

      return;
    }

    // Only students can enroll
    if (user.role !== "student") {
      setMessage(
        "Only student accounts can enroll in courses."
      );

      return;
    }

    try {
      setEnrolling(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enrollments/courses/${courseId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to enroll in this course."
        );
      }

      setEnrolled(true);

      setMessage(
        data.message || "Successfully enrolled in course."
      );
    } catch (error) {
      console.error("Enrollment Error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to enroll right now. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (enrolled) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading || enrolling}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enrolling && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {enrolling
          ? "Enrolling..."
          : user?.role === "student"
            ? "Enroll Now"
            : "Enroll in Course"}
      </button>

      {message && (
        <p className="text-center text-sm text-stone-500">
          {message}
        </p>
      )}
    </div>
  );
}

