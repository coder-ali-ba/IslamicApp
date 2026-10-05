"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  image?: string;
  price?: number;
  students?: number;
  lessons?: number;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  duration?: string | number;
  order?: number;
  status?: string;
};

type Enrollment = {
  _id: string;
  course?: string | { _id: string };
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  // Agar tumhare login system mein token ka key different hai,
  // to yahan woh key add kar dena.
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [enrollMessage, setEnrollMessage] = useState("");

  const loadCourseData = useCallback(async () => {
    if (!courseId) return;

    setIsLoading(true);
    setError("");

    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        fetch(`${API_URL}/courses/${courseId}`, {
          method: "GET",
          cache: "no-store",
        }),
        fetch(`${API_URL}/lessons/course/${courseId}`, {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
          },
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const courseData = await readResponse(courseResponse);
      const lessonsData = await readResponse(lessonsResponse);

      setCourse(courseData.course);
      setLessons(lessonsData.lessons || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Course load nahi ho saka."
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const checkEnrollment = useCallback(async () => {
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

      if (!response.ok) return;

      const data = await response.json();
      const enrollments: Enrollment[] = data.enrollments || [];

      const alreadyEnrolled = enrollments.some((item) => {
        const enrolledCourseId =
          typeof item.course === "string" ? item.course : item.course?._id;

        return enrolledCourseId === courseId;
      });

      setIsEnrolled(alreadyEnrolled);
    } catch {
      // Enrollment check fail hone par course detail page phir bhi show hoga.
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
    checkEnrollment();
  }, [loadCourseData, checkEnrollment]);

  const handleEnroll = async () => {
    if (!courseId) return;

    setIsEnrolling(true);
    setEnrollMessage("");

    try {
      const response = await fetch(
        `${API_URL}/enrollments/courses/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setEnrollMessage("Enrollment ke liye pehle login karein.");
        return;
      }

      if (response.status === 403) {
        setEnrollMessage("Sirf student is course mein enroll ho sakta hai.");
        return;
      }

      if (response.status === 409) {
        setIsEnrolled(true);
        setEnrollMessage("Aap pehle se is course mein enrolled hain.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Enrollment nahi ho saka.");
      }

      setIsEnrolled(true);
      setEnrollMessage(data.message || "Successfully enrolled in course.");
    } catch (err) {
      setEnrollMessage(
        err instanceof Error ? err.message : "Kuch ghalat ho gaya."
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-72 rounded-2xl bg-slate-200" />
          <div className="mt-6 h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-1/2 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#132A4C]">
            Course can't be loaded
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {error || "Course available nahi hai."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-lg bg-[#132A4C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930]"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const imageUrl = course.image;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0B1930] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <button
              onClick={() => router.push("/courses")}
              className="mb-7 w-fit text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Back to Courses
            </button>

            <div className="mb-5 flex flex-wrap gap-2">
              {course.category && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#F0B84B]">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
                  {course.level}
                </span>
              )}
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
              {course.description || "Is course ki tafseel jald available hogi."}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              {course.duration && (
                <span>◷ {course.duration} duration</span>
              )}
              <span>▤ {lessons.length} lessons</span>
              {typeof course.students === "number" && (
                <span>♙ {course.students} students</span>
              )}
            </div>
          </div>

          {/* Course enrollment card */}
          <aside className="h-fit overflow-hidden rounded-2xl bg-white text-[#132A4C] shadow-xl">
            <div className="relative aspect-video bg-slate-200">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-5xl text-slate-400">
                  ▤
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="mb-5">
                {typeof course.price === "number" && course.price > 0 ? (
                  <p className="text-3xl font-bold">
                    Rs. {course.price.toLocaleString("en-PK")}
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-emerald-600">Free</p>
                )}
              </div>

              {isEnrolled ? (
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="font-bold text-emerald-700">
                    You are enrolled
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    
                    You are already enrolled to this course
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full rounded-xl bg-[#D99B33] px-5 py-3.5 font-bold text-[#0B1930] transition hover:bg-[#c98b25] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEnrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}

              {enrollMessage && (
                <p className="mt-3 text-center text-sm text-slate-600">
                  {enrollMessage}
                </p>
              )}

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="mb-3 font-bold">This course includes</h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>✓ {lessons.length} published lessons</li>
                  <li>✓ Online course access</li>
                  {course.duration && <li>✓ {course.duration} duration</li>}
                  <li>✓ Student enrollment tracking</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Course content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#132A4C]">
              Course Overview
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {course.description ||
                "Is course ke bare mein mazeed maloomat available nahi hain."}
            </p>
          </div>

          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#132A4C]">
                  Course Lessons
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {lessons.length} published lessons
                </p>
              </div>
            </div>

            {lessons.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="flex items-center gap-4 border-b border-slate-100 p-5 last:border-b-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#132A4C]/10 text-sm font-bold text-[#132A4C]">
                      {lesson.order || index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#132A4C]">
                        {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {lesson.duration && (
                      <span className="shrink-0 text-xs text-slate-500">
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="font-semibold text-[#132A4C]">
                  No lessons available
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  
                  Lessons are not published yet for this course.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#132A4C]">
            Course Information
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Category</span>
              <span className="text-right font-semibold text-[#132A4C]">
                {course.category || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Level</span>
              <span className="text-right font-semibold text-[#132A4C]">
                {course.level || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Duration</span>
              <span className="text-right font-semibold text-[#132A4C]">
                {course.duration || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Lessons</span>
              <span className="text-right font-semibold text-[#132A4C]">
                {lessons.length}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Students</span>
              <span className="text-right font-semibold text-[#132A4C]">
                {course.students ?? "—"}
              </span>
            </div>
          </div>

          {!isEnrolled && (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="mt-7 w-full rounded-xl bg-[#132A4C] px-5 py-3 font-semibold text-white transition hover:bg-[#0B1930] disabled:opacity-60"
            >
              {isEnrolling ? "Enrolling..." : "Enroll in this Course"}
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}