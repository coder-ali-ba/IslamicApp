"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  GraduationCap,
  Loader2,
  Users,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  image: string;
  instructor?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type Enrollment = {
  _id: string;
  status: "active" | "completed" | "cancelled";
  progress: number;
  enrolledAt: string;
  course: Course;
};

export default function MyCoursesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    // User is not logged in
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent("/courses/my")}`
      );
      return;
    }

    // Only students can access enrolled courses
    if (user.role !== "student") {
      setError(
        "Only student accounts can view enrolled courses."
      );
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/enrollments/my`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const contentType = response.headers.get("content-type");

        const data = contentType?.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Failed to load enrollments (${response.status})`
          );
        }

        setEnrollments(data?.enrollments || []);
      } catch (error) {
        console.error("My Enrollments Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-stone-200" />

            <div className="mt-8 h-10 w-72 rounded bg-stone-200" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-stone-200" />

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
                >
                  <div className="h-48 bg-stone-200" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-24 rounded bg-stone-200" />
                    <div className="h-7 w-full rounded bg-stone-200" />
                    <div className="h-4 w-4/5 rounded bg-stone-200" />
                    <div className="h-10 w-full rounded bg-stone-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <BookOpen className="h-6 w-6 text-stone-600" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-stone-900">
            Unable to load courses
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            {error}
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  const activeCourses = enrollments.filter(
    (enrollment) => enrollment.status === "active"
  );

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.status === "completed"
  );

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Courses
          </Link>

          <div className="mt-8">
            <p className="text-sm font-medium text-[#967438]">
              My Learning
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              My Enrolled Courses
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
              Continue your learning journey and keep building
              your Islamic knowledge.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5">
              <BookOpen className="h-5 w-5 text-[#967438]" />

              <p className="mt-4 text-2xl font-semibold text-stone-900">
                {enrollments.length}
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Total Courses
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5">
              <PlayCircle className="h-5 w-5 text-[#967438]" />

              <p className="mt-4 text-2xl font-semibold text-stone-900">
                {activeCourses.length}
              </p>

              <p className="mt-1 text-sm text-stone-500">
                In Progress
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-5">
              <CheckCircle2 className="h-5 w-5 text-[#967438]" />

              <p className="mt-4 text-2xl font-semibold text-stone-900">
                {completedCourses.length}
              </p>

              <p className="mt-1 text-sm text-stone-500">
                Completed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {enrollments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <BookOpen className="h-7 w-7 text-stone-500" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-stone-900">
              No courses yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500">
              You haven&apos;t enrolled in any courses yet.
              Explore our available courses and start learning.
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-stone-900">
                  Your Courses
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Courses you are currently enrolled in.
                </p>
              </div>

              <Link
                href="/courses"
                className="hidden text-sm font-medium text-[#967438] transition hover:text-stone-900 sm:block"
              >
                Explore more
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;

                if (!course) return null;

                return (
                  <article
                    key={enrollment._id}
                    className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-12 w-12 text-stone-300" />
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-stone-700 shadow-sm">
                          {course.category}
                        </span>

                        <span className="rounded-full bg-stone-900/90 px-3 py-1 text-xs font-medium text-white">
                          {course.level}
                        </span>
                      </div>

                      {enrollment.status === "completed" && (
                        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-stone-900">
                        {course.title}
                      </h3>

                      {course.instructor && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                          <GraduationCap className="h-4 w-4 text-[#967438]" />
                          {course.instructor.name}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2.5">
                          <Clock3 className="h-4 w-4 text-stone-400" />

                          <div>
                            <p className="text-[11px] text-stone-400">
                              Duration
                            </p>

                            <p className="text-xs font-medium text-stone-700">
                              {course.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-stone-50 px-3 py-2.5">
                          <BookOpen className="h-4 w-4 text-stone-400" />

                          <div>
                            <p className="text-[11px] text-stone-400">
                              Lessons
                            </p>

                            <p className="text-xs font-medium text-stone-700">
                              {course.lessons}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-stone-500">
                            Progress
                          </span>

                          <span className="text-xs font-semibold text-stone-800">
                            {enrollment.progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-[#967438] transition-all"
                            style={{
                              width: `${Math.min(
                                Math.max(enrollment.progress, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Button */}
                      <Link
                        href={`/courses/${course._id}`}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                      >
                        <PlayCircle className="h-4 w-4" />

                        {enrollment.status === "completed"
                          ? "View Course"
                          : "Continue Learning"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

