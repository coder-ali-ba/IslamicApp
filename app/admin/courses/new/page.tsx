"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
} from "lucide-react";

const categories = [
  "Quran",
  "Hadith",
  "Arabic",
  "Fiqh",
  "Seerah",
  "Islamic Studies",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

type CourseStatus = "Draft" | "Published";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
};

export default function NewCoursePage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<CourseStatus>("Draft");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Stores the newly created course ID
  const [createdCourseId, setCreatedCourseId] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setTeachersLoading(true);

        const response = await fetch(
          `${API_URL}/auth/teachers`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load instructors"
          );
        }

        setTeachers(data.teachers || []);
      } catch (error) {
        console.error("Fetch Teachers Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load instructors"
        );
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, [API_URL]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const title = String(
        formData.get("title") || ""
      ).trim();

      const description = String(
        formData.get("description") || ""
      ).trim();

      const category = String(
        formData.get("category") || ""
      );

      const level = String(
        formData.get("level") || ""
      );

      const instructor = String(
        formData.get("instructor") || ""
      );

      const duration = String(
        formData.get("duration") || ""
      ).trim();

      const price = Number(
        formData.get("price") || 0
      );

      const image = String(
        formData.get("image") || ""
      ).trim();

      if (!title || !description) {
        throw new Error(
          "Please enter the course title and description."
        );
      }

      if (!category || !level) {
        throw new Error(
          "Please select a category and level."
        );
      }

      if (!instructor) {
        throw new Error(
          "Please select an instructor."
        );
      }

      if (!duration) {
        throw new Error(
          "Please enter the course duration."
        );
      }

      if (price < 0) {
        throw new Error(
          "Price cannot be negative."
        );
      }

      const response = await fetch(
        `${API_URL}/courses`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
            level,
            instructor,
            duration,
            lessons: 0,
            price,
            image,
            featured,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create course"
        );
      }

      // Save the newly created course ID
      const courseId =
        data.course?._id || data.course?.id;

      if (!courseId) {
        throw new Error(
          "Course was created, but course ID was not returned."
        );
      }

      setCreatedCourseId(courseId);
      setSuccess(
        "Course created successfully. You can now add lessons."
      );
    } catch (error) {
      console.error(
        "Create Course Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the course."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/courses"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Create Course
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Add a new Islamic course to IlmHub.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            {!createdCourseId && (
              <button
                form="course-form"
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {submitting
                  ? "Saving..."
                  : "Save Course"}
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Check className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-green-800">
                  Course created successfully
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Your course has been created. Now you can add lessons to it.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/admin/courses/${createdCourseId}/lessons/new`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lesson
                  </Link>

                  <Link
                    href={`/admin/courses/${createdCourseId}/lessons`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    <BookOpen className="h-4 w-4" />
                    Manage Lessons
                  </Link>

                  <Link
                    href="/admin/courses"
                    className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                  >
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Form */}
        <form
          id="course-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Enter the main information about this course.
              </p>
            </div>

            <div className="space-y-5">

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Course Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  disabled={!!createdCourseId}
                  placeholder="e.g. Quran with Tajweed"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  required
                  disabled={!!createdCourseId}
                  rows={5}
                  placeholder="Describe what students will learn in this course..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                />
              </div>

              {/* Category + Level */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    required
                    disabled={!!createdCourseId}
                    defaultValue=""
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    Level
                  </label>

                  <select
                    id="level"
                    name="level"
                    required
                    disabled={!!createdCourseId}
                    defaultValue=""
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                  >
                    <option value="" disabled>
                      Select level
                    </option>

                    {levels.map((level) => (
                      <option
                        key={level}
                        value={level}
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </section>

          {/* Course Details */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Course Details
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add instructor, duration and pricing information.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Instructor */}
              <div>
                <label
                  htmlFor="instructor"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Instructor
                </label>

                <select
                  id="instructor"
                  name="instructor"
                  required
                  defaultValue=""
                  disabled={
                    teachersLoading ||
                    !!createdCourseId
                  }
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                >
                  <option value="" disabled>
                    {teachersLoading
                      ? "Loading instructors..."
                      : teachers.length === 0
                        ? "No instructors found"
                        : "Select instructor"}
                  </option>

                  {teachers.map((teacher) => (
                    <option
                      key={teacher._id}
                      value={teacher._id}
                    >
                      {teacher.name} ({teacher.role})
                    </option>
                  ))}
                </select>

                {!teachersLoading &&
                  teachers.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No active teacher or scholar accounts found.
                    </p>
                  )}
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="text"
                  required
                  disabled={!!createdCourseId}
                  placeholder="e.g. 8 weeks"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    disabled={!!createdCourseId}
                    placeholder="0"
                    defaultValue="0"
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-9 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                  />
                </div>

                <p className="mt-2 text-xs text-stone-400">
                  Use 0 for a free course.
                </p>
              </div>

            </div>
          </section>

          {/* Course Image */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Course Image
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add an image URL for the course thumbnail.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <ImageIcon className="h-8 w-8" />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  disabled={!!createdCourseId}
                  placeholder="https://example.com/course-image.jpg"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                />

                <p className="mt-2 text-xs text-stone-400">
                  Cloudinary upload will be connected later.
                </p>
              </div>
            </div>
          </section>

          {/* Publishing */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Publishing
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Control the visibility of this course.
              </p>
            </div>

            <div className="space-y-5">

              {/* Status */}
              <div>
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Course Status
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    ["Draft", "Published"] as CourseStatus[]
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      disabled={!!createdCourseId}
                      onClick={() =>
                        setStatus(item)
                      }
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        status === item
                          ? "border-[#d6b56d] bg-[#d6b56d]/10"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {item}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {item === "Draft"
                            ? "Keep the course hidden for now."
                            : "Make the course visible to students."}
                        </p>
                      </div>

                      {status === item && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6b56d] text-stone-950">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Featured Course
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Show this course in the featured courses section.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!!createdCourseId}
                  onClick={() =>
                    setFeatured(!featured)
                  }
                  aria-pressed={featured}
                  className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    featured
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      featured
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

            </div>
          </section>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/courses"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            {!createdCourseId && (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {submitting
                  ? "Saving..."
                  : "Save Course"}
              </button>
            )}

            {createdCourseId && (
              <Link
                href={`/admin/courses/${createdCourseId}/lessons/new`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
                Add Lesson
              </Link>
            )}
          </div>

        </form>
      </div>
    </main>
  );
}