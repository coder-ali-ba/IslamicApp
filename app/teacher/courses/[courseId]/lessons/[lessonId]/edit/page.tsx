"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default function EditTeacherLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState<
    "Draft" | "Published"
  >("Draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/lessons/teacher/${lessonId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch lesson"
          );
        }

        const fetchedLesson = data.lesson;

        setLesson(fetchedLesson);

        setTitle(fetchedLesson.title || "");
        setDescription(
          fetchedLesson.description || ""
        );
        setContent(fetchedLesson.content || "");
        setVideoUrl(fetchedLesson.videoUrl || "");
        setDuration(fetchedLesson.duration || "");
        setOrder(String(fetchedLesson.order || ""));
        setStatus(fetchedLesson.status || "Draft");
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load lesson"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    if (!order || Number(order) < 1) {
      setError("Lesson order must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/lessons/teacher/${lessonId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            videoUrl: videoUrl.trim(),
            duration: duration.trim(),
            order: Number(order),
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update lesson"
        );
      }

      router.push(
        `/teacher/courses/${courseId}/lessons`
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update lesson"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Loading lesson...
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <Link
          href={`/teacher/courses/${courseId}/lessons`}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft size={17} />
          Back to Lessons
        </Link>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          {error || "Lesson not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link
        href={`/teacher/courses/${courseId}/lessons`}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft size={17} />
        Back to Lessons
      </Link>

      <div>
        <p className="text-sm font-medium text-[#967438]">
          Course Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-stone-900">
          Edit Lesson
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Update this lesson and save your changes.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-7"
      >
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Lesson Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Lesson Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-xl border border-stone-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />
          </div>

          {/* Video */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Video URL
            </label>

            <input
              type="url"
              value={videoUrl}
              onChange={(e) =>
                setVideoUrl(e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />
          </div>

          {/* Duration + Order */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Duration
              </label>

              <input
                type="text"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                placeholder="e.g. 30 minutes"
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Lesson Order
              </label>

              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) =>
                  setOrder(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "Draft" | "Published"
                )
              }
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-stone-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}