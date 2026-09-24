"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";

type LessonStatus = "Draft" | "Published";

export default function NewLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    duration: "",
    order: "1",
    status: "Draft" as LessonStatus,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!form.title.trim()) {
        setError("Lesson title is required.");
        setLoading(false);
        return;
      }

      if (!form.order || Number(form.order) < 1) {
        setError("Lesson order must be at least 1.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            course: courseId,
            content: form.content.trim(),
            videoUrl: form.videoUrl.trim(),
            duration: form.duration.trim(),
            order: Number(form.order),
            status: form.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create lesson."
        );
      }

      router.push(
        `/admin/courses/${courseId}/lessons`
      );
    } catch (error) {
      console.error("Create Lesson Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create lesson."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}/lessons`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d]">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Add New Lesson
              </h1>

              <p className="mt-1 text-sm text-stone-500">
                Create a new lesson for this course.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-8">

            {/* Basic Information */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Add the main information about this lesson.
                </p>
              </div>

              <div className="space-y-5">

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Lesson Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      handleChange("title", e.target.value)
                    }
                    placeholder="e.g. Introduction to Surah Al-Fatiha"
                    maxLength={150}
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Short Description
                  </label>

                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Briefly describe what students will learn..."
                    rows={4}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                {/* Order + Duration */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="order"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Lesson Order
                    </label>

                    <input
                      id="order"
                      type="number"
                      min="1"
                      value={form.order}
                      onChange={(e) =>
                        handleChange(
                          "order",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                    />

                    <p className="mt-1.5 text-xs text-stone-400">
                      Example: 1 for the first lesson.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Duration
                    </label>

                    <input
                      id="duration"
                      type="text"
                      value={form.duration}
                      onChange={(e) =>
                        handleChange(
                          "duration",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 25 minutes"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* Lesson Content */}
            <section className="border-t border-stone-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                  Lesson Content
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Add the actual lesson material students will read.
                </p>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Content
                </label>

                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    handleChange("content", e.target.value)
                  }
                  placeholder="Write the lesson content here..."
                  rows={12}
                  className="w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                />

                <p className="mt-2 text-xs text-stone-400">
                  You can later replace this with a rich text editor.
                </p>
              </div>
            </section>

            {/* Video */}
            <section className="border-t border-stone-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                  Video
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Optionally add a video URL for this lesson.
                </p>
              </div>

              <div>
                <label
                  htmlFor="videoUrl"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Video URL
                </label>

                <input
                  id="videoUrl"
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) =>
                    handleChange(
                      "videoUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                />

                <p className="mt-2 text-xs text-stone-400">
                  YouTube, Vimeo, or another supported video URL.
                </p>
              </div>
            </section>

            {/* Publishing */}
            <section className="border-t border-stone-100 pt-8">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-stone-900">
                  Publishing
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Choose whether students can see this lesson.
                </p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">
                    Published
                  </option>
                </select>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-8 sm:flex-row sm:justify-end">

              <Link
                href={`/admin/courses/${courseId}/lessons`}
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Lesson...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Lesson
                  </>
                )}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}