"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
};

type CourseForm = {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: string;
  price: string;
  image: string;
  status: "Draft" | "Published";
  featured: boolean;
};

type Lesson = {
  _id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: "Draft" | "Published";
  videoUrl: string;
};

const categories = [
  "Quran",
  "Hadith",
  "Arabic",
  "Fiqh",
  "Seerah",
  "Islamic Studies",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<CourseForm>({
    title: "",
    description: "",
    category: "",
    level: "",
    instructor: "",
    duration: "",
    price: "0",
    image: "",
    status: "Draft",
    featured: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --------------------------------------------------
  // FETCH COURSE + TEACHERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, teachersResponse] = await Promise.all([
          fetch(`${API_URL}/courses/${courseId}`, {
            credentials: "include",
          }),

          fetch(`${API_URL}/auth/teachers`, {
            credentials: "include",
          }),
        ]);

        const courseData = await courseResponse.json();
        const teachersData = await teachersResponse.json();

        if (!courseResponse.ok) {
          throw new Error(
            courseData?.message || "Failed to fetch course"
          );
        }

        if (!teachersResponse.ok) {
          throw new Error(
            teachersData?.message || "Failed to fetch teachers"
          );
        }

        const course = courseData.course;

        setTeachers(teachersData.teachers || []);

        setForm({
          title: course?.title || "",
          description: course?.description || "",
          category: course?.category || "",
          level: course?.level || "",
          instructor: course?.instructor?._id || "",
          duration: course?.duration || "",
          price: String(course?.price ?? 0),
          image: course?.image || "",
          status: course?.status || "Draft",
          featured: course?.featured ?? false,
        });
      } catch (error) {
        console.error("Fetch Edit Course Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [API_URL, courseId]);

  // --------------------------------------------------
  // FETCH LESSONS
  // --------------------------------------------------

  const fetchLessons = async () => {
    try {
      setLessonsLoading(true);

      const response = await fetch(
        `${API_URL}/lessons/admin/course/${courseId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch lessons"
        );
      }

      setLessons(data.lessons || []);
    } catch (error) {
      console.error("Fetch Lessons Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load lessons"
      );
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  // --------------------------------------------------
  // HANDLE COURSE FORM
  // --------------------------------------------------

  const handleChange = (
    field: keyof CourseForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // UPDATE COURSE
  // --------------------------------------------------

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/courses/${courseId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            category: form.category,
            level: form.level,
            instructor: form.instructor,
            duration: form.duration,
            price: Number(form.price),
            image: form.image,
            status: form.status,
            featured: form.featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update course"
        );
      }

      setSuccess("Course updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Update Course Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE LESSON
  // --------------------------------------------------

  const handleDeleteLesson = async (lessonId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    try {
      setDeletingLesson(lessonId);
      setError("");

      const response = await fetch(
        `${API_URL}/lessons/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete lesson"
        );
      }

      setLessons((prev) =>
        prev.filter((lesson) => lesson._id !== lessonId)
      );

      setSuccess("Lesson deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Delete Lesson Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete lesson"
      );
    } finally {
      setDeletingLesson(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
            <Loader2 className="h-6 w-6 animate-spin text-[#967438]" />
          </div>

          <p className="mt-4 text-sm text-stone-500">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/courses"
            className="mb-3 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-white">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#967438]">
                Management
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                Edit Course
              </h2>
            </div>
          </div>
        </div>

        {/* TOP LESSON BUTTON */}
        <Link
          href={`/admin/courses/${courseId}/lessons`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          <BookOpen className="h-4 w-4" />
          Manage Lessons
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-800">
            Something went wrong
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <CheckCircle2 className="h-5 w-5 text-[#967438]" />

          <p className="text-sm font-medium text-stone-800">
            {success}
          </p>
        </div>
      )}

      {/* COURSE FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFORMATION */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-stone-900">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Update the main information about this course.
            </p>
          </div>

          <div className="space-y-5">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Course Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                required
                minLength={3}
                maxLength={150}
                placeholder="Enter course title"
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                required
                maxLength={2000}
                rows={6}
                placeholder="Describe the course..."
                className="w-full resize-none rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* CATEGORY + LEVEL */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    handleChange(
                      "category",
                      e.target.value
                    )
                  }
                  required
                  className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Level
                </label>

                <select
                  value={form.level}
                  onChange={(e) =>
                    handleChange(
                      "level",
                      e.target.value
                    )
                  }
                  required
                  className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="">
                    Select level
                  </option>

                  {levels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* INSTRUCTOR & DETAILS */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-stone-900">
              Instructor & Course Details
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Manage instructor and course details.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* INSTRUCTOR */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Instructor
              </label>

              <select
                value={form.instructor}
                onChange={(e) =>
                  handleChange(
                    "instructor",
                    e.target.value
                  )
                }
                required
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              >
                <option value="">
                  Select instructor
                </option>

                {teachers.map((teacher) => (
                  <option
                    key={teacher._id}
                    value={teacher._id}
                  >
                    {teacher.name} — {teacher.role}
                  </option>
                ))}
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Duration
              </label>

              <input
                type="text"
                value={form.duration}
                onChange={(e) =>
                  handleChange(
                    "duration",
                    e.target.value
                  )
                }
                required
                placeholder="e.g. 8 weeks"
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Price (PKR)
              </label>

              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  handleChange(
                    "price",
                    e.target.value
                  )
                }
                placeholder="0"
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            {/* IMAGE */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Image URL
              </label>

              <input
                type="url"
                value={form.image}
                onChange={(e) =>
                  handleChange(
                    "image",
                    e.target.value
                  )
                }
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>
          </div>
        </div>

        {/* PUBLISHING */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-stone-900">
              Publishing
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Control the visibility of this course.
            </p>
          </div>

          <div className="space-y-5">
            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.value as
                      | "Draft"
                      | "Published"
                  )
                }
                className="h-12 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-4 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              >
                <option value="Draft">
                  Draft
                </option>

                <option value="Published">
                  Published
                </option>
              </select>
            </div>

            {/* FEATURED */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-[#faf9f6] p-4">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Featured Course
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Highlight this course on the platform.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  handleChange(
                    "featured",
                    e.target.checked
                  )
                }
                className="h-5 w-5 accent-[#967438]"
              />
            </label>
          </div>
        </div>

        {/* COURSE ACTIONS */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/courses"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-stone-200 bg-white px-6 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Course Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* ================================================= */}
      {/* LESSONS SECTION */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* LESSON HEADER */}
        <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                <BookOpen className="h-5 w-5 text-[#967438]" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  Course Lessons
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  Add, edit or remove lessons for this course.
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>

        {/* LESSONS */}
        <div className="p-6">
          {lessonsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#967438]" />

                <p className="mt-3 text-sm text-stone-500">
                  Loading lessons...
                </p>
              </div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-[#faf9f6] px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                <BookOpen className="h-5 w-5 text-stone-500" />
              </div>

              <h4 className="mt-4 text-sm font-semibold text-stone-900">
                No lessons yet
              </h4>

              <p className="mt-1 text-sm text-stone-500">
                Start adding lessons to this course.
              </p>

              <Link
                href={`/admin/courses/${courseId}/lessons/new`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
                Add First Lesson
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson._id}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 transition hover:border-stone-300 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* LESSON INFO */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-white">
                      {lesson.order || index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-stone-900">
                          {lesson.title}
                        </h4>

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

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-400">
                        <span>
                          Lesson {lesson.order}
                        </span>

                        {lesson.duration && (
                          <span>
                            {lesson.duration}
                          </span>
                        )}

                        {lesson.videoUrl && (
                          <span>
                            Video available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/courses/${courseId}/lessons/${lesson._id}/edit`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteLesson(lesson._id)
                      }
                      disabled={
                        deletingLesson === lesson._id
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingLesson === lesson._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {lessons.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-stone-200 bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              {lessons.length}{" "}
              {lessons.length === 1
                ? "lesson"
                : "lessons"}{" "}
              in this course
            </p>

            <Link
              href={`/admin/courses/${courseId}/lessons`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#967438] transition hover:text-stone-900"
            >
              Manage all lessons
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}