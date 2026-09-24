"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  GraduationCap,
  Loader2,
  Plus,
  User,
  Users,
} from "lucide-react";

type Instructor = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
};

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: Instructor | null;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  image: string;
  featured: boolean;
  status: "Draft" | "Published";
  createdAt: string;
  updatedAt: string;
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

export default function AdminCourseDetailsPage() {
  const params = useParams();

  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --------------------------------------------------
  // FETCH COURSE
  // --------------------------------------------------

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/courses/${courseId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch course"
          );
        }

        setCourse(data.course);
      } catch (error) {
        console.error("Fetch Course Details Error:", error);

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
      fetchCourse();
    }
  }, [API_URL, courseId]);

  // --------------------------------------------------
  // FETCH LESSONS
  // --------------------------------------------------

  useEffect(() => {
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
        console.error("Fetch Course Lessons Error:", error);
      } finally {
        setLessonsLoading(false);
      }
    };

    if (courseId) {
      fetchLessons();
    }
  }, [API_URL, courseId]);

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
  // ERROR / NOT FOUND
  // --------------------------------------------------

  if (error || !course) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Course not found
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "The requested course could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString(
        "en-PK",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "N/A";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/courses"
            className="mb-3 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <p className="text-sm font-medium text-[#967438]">
            Course Management
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Course Details
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            <Edit3 className="h-4 w-4" />
            Edit Course
          </Link>

          <Link
            href={`/admin/courses/${courseId}/lessons/new`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* COURSE HERO */}
      {/* ------------------------------------------------ */}

      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[280px_1fr]">
          {/* IMAGE */}
          <div className="relative min-h-[220px] bg-stone-100 lg:min-h-full">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="h-full min-h-[220px] w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center">
                <BookOpen className="h-16 w-16 text-stone-300" />
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                {course.category}
              </span>

              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500">
                {course.level}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  course.status === "Published"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {course.status}
              </span>

              {course.featured && (
                <span className="rounded-full bg-[#f5eddc] px-3 py-1.5 text-xs font-medium text-[#967438]">
                  Featured
                </span>
              )}
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {course.title}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-500">
              {course.description}
            </p>

            {/* COURSE META */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-[#faf9f6] p-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-xs">
                    Duration
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {course.duration || "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f6] p-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">
                    Lessons
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {course.lessons}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f6] p-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">
                    Students
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {course.students}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f6] p-4">
                <div className="flex items-center gap-2 text-stone-400">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs">
                    Price
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {course.price === 0
                    ? "Free"
                    : `Rs. ${course.price.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* TWO COLUMN INFORMATION */}
      {/* ------------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INSTRUCTOR */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
              <User className="h-5 w-5 text-stone-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Instructor
              </h3>

              <p className="text-xs text-stone-400">
                Course instructor information
              </p>
            </div>
          </div>

          {course.instructor ? (
            <div className="rounded-xl bg-[#faf9f6] p-4">
              <p className="text-sm font-semibold text-stone-900">
                {course.instructor.name}
              </p>

              <p className="mt-1 text-sm text-stone-500">
                {course.instructor.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600">
                {course.instructor.role}
              </span>
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              No instructor assigned.
            </p>
          )}
        </div>

        {/* COURSE INFORMATION */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
              <CalendarDays className="h-5 w-5 text-stone-600" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Course Information
              </h3>

              <p className="text-xs text-stone-400">
                Course record details
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-sm text-stone-500">
                Created
              </span>

              <span className="text-sm font-medium text-stone-800">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-sm text-stone-500">
                Category
              </span>

              <span className="text-sm font-medium text-stone-800">
                {course.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">
                Level
              </span>

              <span className="text-sm font-medium text-stone-800">
                {course.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* LESSONS */}
      {/* ------------------------------------------------ */}

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
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
                  {lessons.length}{" "}
                  {lessons.length === 1
                    ? "lesson"
                    : "lessons"}{" "}
                  in this course
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/admin/courses/${courseId}/lessons`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Manage Lessons
          </Link>
        </div>

        <div className="p-6">
          {lessonsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#967438]" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-[#faf9f6] px-6 py-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-stone-300" />

              <h4 className="mt-3 text-sm font-semibold text-stone-900">
                No lessons yet
              </h4>

              <p className="mt-1 text-sm text-stone-500">
                Add lessons to start building this course.
              </p>

              <Link
                href={`/admin/courses/${courseId}/lessons/new`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
                Add Lesson
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson._id}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-white">
                      {lesson.order || index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-stone-900">
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

                      <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                        <span>
                          Lesson {lesson.order}
                        </span>

                        {lesson.duration && (
                          <span>
                            {lesson.duration}
                          </span>
                        )}

                        {lesson.videoUrl && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Video
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/courses/${courseId}/lessons/${lesson._id}/edit`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}