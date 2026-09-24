"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Edit,
  Layers3,
  Loader2,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  status: "Draft" | "Published";
};

export default function TeacherLessonsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchLessons = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/lessons/teacher/course/${courseId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lessons");
      }

      setLessons(data.lessons || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load lessons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const handleDelete = async (lessonId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    try {
      setDeleting(lessonId);

      const response = await fetch(
        `${API_URL}/lessons/teacher/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete lesson");
      }

      setLessons((prev) =>
        prev.filter((lesson) => lesson._id !== lessonId)
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete lesson"
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 size={22} className="animate-spin" />
          Loading lessons...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft size={17} />
        Back to Course
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#967438]">
            Course Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-stone-900">
            Course Lessons
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Create, edit and manage your course lessons.
          </p>
        </div>

        <Link
          href={`/teacher/courses/${courseId}/lessons/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
        >
          <Plus size={17} />
          Add Lesson
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Lessons */}
      {lessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ead0] text-[#80652c]">
            <Layers3 size={25} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-stone-900">
            No lessons yet
          </h2>

          <p className="mt-2 text-sm text-stone-500">
            Start building your course by adding the first lesson.
          </p>

          <Link
            href={`/teacher/courses/${courseId}/lessons/new`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Add First Lesson
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5ead0] font-semibold text-[#80652c]">
                    {lesson.order}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-stone-900">
                      {lesson.title}
                    </h2>

                    {lesson.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                        {lesson.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      {lesson.duration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={13} />
                          {lesson.duration}
                        </span>
                      )}

                      {lesson.videoUrl && (
                        <span className="inline-flex items-center gap-1">
                          <Video size={13} />
                          Video
                        </span>
                      )}

                      <span
                        className={
                          lesson.status === "Published"
                            ? "font-medium text-emerald-600"
                            : "font-medium text-stone-500"
                        }
                      >
                        {lesson.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/teacher/courses/${courseId}/lessons/${lesson._id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <Edit size={15} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={deleting === lesson._id}
                    onClick={() => handleDelete(lesson._id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting === lesson._id ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}

                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}