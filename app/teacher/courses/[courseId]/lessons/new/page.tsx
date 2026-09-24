"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddTeacherLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">(
    "Draft"
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        `${API_URL}/lessons/teacher/course/${courseId}`,
        {
          method: "POST",
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
          data.message || "Failed to create lesson"
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
          : "Failed to create lesson"
      );
    } finally {
      setSaving(false);
    }
  };

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
          Add New Lesson
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Create a new lesson for this course.
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
              placeholder="e.g. Introduction to Surah Al-Fatiha"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this lesson..."
              rows={4}
              className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
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
              placeholder="Write the lesson content here..."
              rows={10}
              className="w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
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
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
            />

            <p className="mt-2 text-xs text-stone-400">
              You can add a YouTube, Vimeo or hosted video URL.
            </p>
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
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 25 minutes"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
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
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#967438] focus:ring-2 focus:ring-[#967438]/10"
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

          {/* Submit */}
          <div className="flex justify-end border-t border-stone-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Creating..." : "Create Lesson"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}