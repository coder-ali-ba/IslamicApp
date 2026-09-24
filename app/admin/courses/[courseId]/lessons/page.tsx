"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  Video,
  Loader2,
  FileText,
} from "lucide-react";

type Lesson = {
  _id: string;
  title: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: string;
  order: number;
  status: "Draft" | "Published";
};

type Course = {
  _id: string;
  title: string;
  category: string;
  level: string;
  lessons: number;
};

export default function AdminCourseLessonsPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        /*
         * Get course
         */
        const courseResponse = await fetch(
          `${API_URL}/courses/${courseId}`,
          {
            credentials: "include",
          }
        );

        const courseContentType =
          courseResponse.headers.get("content-type");

        if (!courseContentType?.includes("application/json")) {
          throw new Error(
            `Course API returned ${courseResponse.status} instead of JSON.`
          );
        }

        const courseData = await courseResponse.json();

        if (!courseResponse.ok) {
          throw new Error(
            courseData?.message || "Failed to load course."
          );
        }

        setCourse(courseData.course);

        /*
         * Get ALL lessons for admin
         */
        const lessonsResponse = await fetch(
          `${API_URL}/lessons/admin/course/${courseId}`,
          {
            credentials: "include",
          }
        );

        const lessonsContentType =
          lessonsResponse.headers.get("content-type");

        if (!lessonsContentType?.includes("application/json")) {
          throw new Error(
            `Lessons API returned ${lessonsResponse.status} instead of JSON.`
          );
        }

        const lessonsData = await lessonsResponse.json();

        if (!lessonsResponse.ok) {
          throw new Error(
            lessonsData?.message || "Failed to load lessons."
          );
        }

        setLessons(lessonsData.lessons || []);
      } catch (error) {
        console.error("Admin Lessons Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load lessons."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDelete = async (
    lessonId: string,
    lessonTitle: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${lessonTitle}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(lessonId);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const contentType = response.headers.get("content-type");

      const data = contentType?.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete lesson."
        );
      }

      setLessons((prev) =>
        prev.filter((lesson) => lesson._id !== lessonId)
      );

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              lessons: Math.max(prev.lessons - 1, 0),
            }
          : prev
      );
    } catch (error) {
      console.error("Delete Lesson Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete lesson."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-32">
          <div className="flex items-center gap-3 text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading lessons...
          </div>
        </div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-stone-300" />

          <h1 className="mt-5 text-2xl font-semibold text-stone-900">
            Unable to load course
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            {error}
          </p>

          <Link
            href="/admin/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:py-10">
        {/* Back */}
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#967438]">
              Course Management
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
              {course?.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                {course?.category}
              </span>

              <span className="rounded-full bg-[#d6b56d]/15 px-3 py-1 text-xs font-medium text-[#806329]">
                {course?.level}
              </span>

              <span className="text-sm text-stone-400">
                {lessons.length} lessons
              </span>
            </div>
          </div>

          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
          </div>
        )}

        {/* Lessons */}
        <section className="mt-10">
          {lessons.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
                <BookOpen className="h-7 w-7 text-stone-500" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-stone-900">
                No lessons yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Start building this course by adding the first
                lesson.
              </p>

              <Link
                href={`/admin/courses/${courseId}/lessons/new`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
                Add First Lesson
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* Order */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-[#d6b56d]">
                      {lesson.order}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-stone-900">
                          {lesson.title}
                        </h2>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            lesson.status === "Published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {lesson.status}
                        </span>
                      </div>

                      {lesson.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                          {lesson.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-400">
                        {lesson.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            {lesson.duration}
                          </span>
                        )}

                        {lesson.videoUrl && (
                          <span className="flex items-center gap-1.5">
                            <Video className="h-3.5 w-3.5" />
                            Video
                          </span>
                        )}

                        {lesson.content && (
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Content
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:shrink-0">
                      <Link
                        href={`/admin/courses/${courseId}/lessons/${lesson._id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            lesson._id,
                            lesson.title
                          )
                        }
                        disabled={
                          deletingId === lesson._id
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 p-2.5 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Delete ${lesson.title}`}
                      >
                        {deletingId === lesson._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}