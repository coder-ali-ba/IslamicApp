"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string | number;
  lessons?: number;
  students?: number;
  price?: number;
  image?: string;
};

type Enrollment = {
  _id: string;
  course: Course | string;
  createdAt?: string;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function MyCoursesPage() {
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyCourses = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/enrollments/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error("Session expire ho gaya hai. Dobara login karein.");
      }

      if (response.status === 403) {
        throw new Error("Ye page sirf students ke liye available hai.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Courses load nahi ho sake.");
      }

      setEnrollments(data.enrollments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const getCourse = (enrollment: Enrollment): Course | null => {
    if (!enrollment.course || typeof enrollment.course === "string") {
      return null;
    }

    return enrollment.course;
  };

  const handleContinueLearning = async (courseId: string) => {
    try {
      const response = await fetch(`${API_URL}/lessons/course/${courseId}`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lessons load nahi ho sake.");
      }

      const lessons = data.lessons || [];

      if (lessons.length === 0) {
        alert("Is course mein abhi koi lesson available nahi hai.");
        return;
      }

      const firstLesson = lessons[0];

      router.push(`/courses/${courseId}/lessons/${firstLesson._id}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Lesson open nahi ho saka.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#D99B33]">
              Student Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#132A4C]">
              My Courses
            </h1>
            <p className="mt-2 text-slate-600">
              Yahan aapke tamam enrolled courses show honge.
            </p>
          </div>

          <button
            onClick={() => router.push("/courses")}
            className="w-fit rounded-lg bg-[#132A4C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930]"
          >
            Browse Courses
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-video bg-slate-200" />
                <div className="p-5">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-6 h-10 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[#132A4C]">
              Unable to load courses
            </h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={fetchMyCourses}
              className="mt-5 rounded-lg bg-[#132A4C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0B1930]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && enrollments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#132A4C]/10 text-3xl text-[#132A4C]">
              ▤
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#132A4C]">
              You haven&apos;t enrolled in any course yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Available courses browse karein aur apni learning journey shuru
              karein.
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="mt-6 rounded-lg bg-[#D99B33] px-6 py-3 text-sm font-bold text-[#0B1930] transition hover:bg-[#c98b25]"
            >
              Explore Courses
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && enrollments.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-[#132A4C]">
                  {enrollments.length}
                </span>{" "}
                enrolled {enrollments.length === 1 ? "course" : "courses"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const course = getCourse(enrollment);

                if (!course) {
                  return (
                    <div
                      key={enrollment._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <p className="font-semibold text-[#132A4C]">
                        Course information unavailable
                      </p>
                    </div>
                  );
                }

                return (
                  <article
                    key={enrollment._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-200">
                      {course.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 text-5xl text-slate-400">
                          ▤
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Enrolled
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {course.category && (
                          <span className="rounded-full bg-[#132A4C]/10 px-3 py-1 text-xs font-semibold text-[#132A4C]">
                            {course.category}
                          </span>
                        )}
                        {course.level && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {course.level}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 line-clamp-2 min-h-14 text-lg font-bold text-[#132A4C]">
                        {course.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                        {course.description ||
                          "Course description available nahi hai."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        {course.duration && <span>◷ {course.duration}</span>}
                        {typeof course.lessons === "number" && (
                          <span>▤ {course.lessons} lessons</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleContinueLearning(course._id)}
                        className="mt-5 w-full rounded-lg bg-[#132A4C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930]"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
