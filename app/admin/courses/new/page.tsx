"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
)
  .trim()
  .replace(/\/+$/, "");

function apiUrl(path: string) {
  const baseHasApi = /\/api$/i.test(API_BASE);
  return `${API_BASE}${baseHasApi ? "" : "/api"}/${path.replace(/^\/+/, "")}`;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#c4a15a] focus:ring-2 focus:ring-[#c4a15a]/20";

const labelClass = "text-sm font-medium text-stone-700";

type CourseForm = {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: string;
  price: string;
  image: string;
  featured: boolean;
  status: "Draft" | "Published";
  language: string;
  learningOutcomes: string;
  requirements: string;
  lessons: string;
  modules: string;
};

const initialForm: CourseForm = {
  title: "",
  description: "",
  category: "",
  level: "Beginner",
  instructor: "",
  duration: "",
  price: "0",
  image: "",
  featured: false,
  status: "Draft",
  language: "English",
  learningOutcomes: "",
  requirements: "",
  lessons: "0",
  modules: "[]",
};

export default function NewCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState<CourseForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = <K extends keyof CourseForm>(
    field: K,
    value: CourseForm[K]
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields: Array<keyof CourseForm> = [
      "title",
      "description",
      "category",
      "level",
      "instructor",
      "duration",
    ];

    const missingFields = requiredFields.filter(
      (field) => !String(form[field]).trim()
    );

    if (missingFields.length) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const price = Number(form.price);
    const lessonCount = Number(form.lessons);

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (
      !Number.isInteger(lessonCount) ||
      lessonCount < 0
    ) {
      setError("Lessons must be a non-negative integer.");
      return;
    }

    let modules: unknown;

    try {
      modules = JSON.parse(form.modules);

      if (!Array.isArray(modules)) {
        setError("Modules must be a valid JSON array.");
        return;
      }
    } catch {
      setError('Modules must contain valid JSON, for example: []');
      return;
    }

    const learningOutcomes = form.learningOutcomes
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const requirements = form.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      level: form.level,
      instructor: form.instructor.trim(),
      duration: form.duration.trim(),
      price,
      image: form.image.trim(),
      featured: form.featured,
      status: form.status,
      language: form.language.trim(),
      learningOutcomes,
      requirements,
      modules,
      lessons: lessonCount,
    };

    setLoading(true);

    try {
      const response = await fetch(apiUrl("courses"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      let data: {
        success?: boolean;
        message?: string;
        missingFields?: string[];
        course?: { _id?: string; id?: string };
      } = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        const missing = data.missingFields?.length
          ? ` Missing fields: ${data.missingFields.join(", ")}.`
          : "";

        throw new Error(
          `${data.message || `Failed to create course (${response.status})`}${missing}`
        );
      }

      setSuccess(data.message || "Course created successfully.");

      const courseId = data.course?._id || data.course?.id;

      window.setTimeout(() => {
        router.push(
          courseId
            ? `/admin/courses/${encodeURIComponent(courseId)}`
            : "/admin/courses"
        );
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Create Course Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Page header */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#967438]">
              Course Management
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Create New Course
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Enter the course details required by your backend.
            </p>
          </div>

          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5f0e5] text-[#967438] sm:flex">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* API feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="flex-1 break-words">{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="font-medium"
          >
            Close
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-stone-900">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Required course details.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                Course Title *
              </label>
              <input
                id="title"
                required
                maxLength={150}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Introduction to Quranic Studies"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={5}
                maxLength={10000}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Describe the course and what students will learn..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>
              <input
                id="category"
                required
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="Quran, Hadith, Fiqh..."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="level" className={labelClass}>
                Level *
              </label>
              <select
                id="level"
                required
                value={form.level}
                onChange={(e) => updateField("level", e.target.value)}
                className={inputClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="instructor" className={labelClass}>
                Instructor MongoDB ID *
              </label>
              <input
                id="instructor"
                required
                value={form.instructor}
                onChange={(e) =>
                  updateField("instructor", e.target.value)
                }
                placeholder="e.g. 65f123456789abcdef123456"
                className={inputClass}
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Backend validates this field as a MongoDB ObjectId. Enter
                the instructor's actual user ID, not their name or email.
              </p>
            </div>

            <div>
              <label htmlFor="duration" className={labelClass}>
                Duration *
              </label>
              <input
                id="duration"
                required
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="e.g. 8 weeks"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="language" className={labelClass}>
                Language
              </label>
              <input
                id="language"
                value={form.language}
                onChange={(e) => updateField("language", e.target.value)}
                placeholder="English, Urdu, Arabic..."
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Pricing and status */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-stone-900">
              Pricing & Publication
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Configure the price and course visibility.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price (PKR)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-stone-400">
                Enter 0 for a free course.
              </p>
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value as CourseForm["status"]
                  )
                }
                className={inputClass}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  updateField("featured", e.target.checked)
                }
                className="h-4 w-4 accent-[#967438]"
              />
              <span>
                <span className="block text-sm font-medium text-stone-800">
                  Featured Course
                </span>
                <span className="mt-1 block text-xs text-stone-500">
                  Mark this course as featured.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Image */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-stone-900">
              Course Image
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              The backend field is named image.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <label htmlFor="image" className={labelClass}>
              Image URL
            </label>
            <div className="relative">
              <ImagePlus className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                id="image"
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://example.com/course-image.jpg"
                className={`${inputClass} pl-10`}
              />
            </div>

            {form.image.trim() && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Course preview"
                  className="h-48 w-full rounded-xl border border-stone-200 object-cover sm:w-80"
                />
              </div>
            )}
          </div>
        </section>

        {/* Learning details */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-stone-900">
              Learning Details
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Enter one item per line.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label htmlFor="outcomes" className={labelClass}>
                Learning Outcomes
              </label>
              <textarea
                id="outcomes"
                rows={5}
                value={form.learningOutcomes}
                onChange={(e) =>
                  updateField("learningOutcomes", e.target.value)
                }
                placeholder={"Understand key concepts\nApply what you learn"}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="requirements" className={labelClass}>
                Requirements
              </label>
              <textarea
                id="requirements"
                rows={5}
                value={form.requirements}
                onChange={(e) =>
                  updateField("requirements", e.target.value)
                }
                placeholder={"Basic reading skills\nInternet connection"}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-stone-900">
              Course Modules
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Modules must be supplied as a JSON array matching your
              backend module schema. Use [] if you are adding modules later.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <label htmlFor="modules" className={labelClass}>
              Modules JSON
            </label>
            <textarea
              id="modules"
              rows={7}
              spellCheck={false}
              value={form.modules}
              onChange={(e) => updateField("modules", e.target.value)}
              className={`${inputClass} resize-y font-mono`}
              placeholder="[]"
            />

            <div className="mt-5 max-w-xs">
              <label htmlFor="lessons" className={labelClass}>
                Lesson Count
              </label>
              <input
                id="lessons"
                type="number"
                min="0"
                step="1"
                value={form.lessons}
                onChange={(e) => updateField("lessons", e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-stone-500">
                The backend calculates lesson count from modules when
                modules are provided.
              </p>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/courses"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-[#d6b56d] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}