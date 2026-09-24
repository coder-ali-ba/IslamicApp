"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  PlayCircle,
} from "lucide-react";

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  duration?: string;
  order?: number;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration?: string;
  lessons?: number;
  image?: string;
  instructor?: {
    _id: string;
    name: string;
  };
};

export default function CourseLearningPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
          {
            credentials: "include",
          }
        );

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Course API returned ${response.status} instead of JSON.`
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load course"
          );
        }

        setCourse(data.course);

        /*
         * If your backend already returns lessons with the course,
         * this will use them.
         */
        setLessons(data.lessons || data.course?.lessonsList || []);
      } catch (error) {
        console.error("Course Details Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading course...
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-10">
        <div className="mx-auto max-w-xl py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-stone-900">
            Unable to load course
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {error || "Course not found."}
          </p>

          <Link
            href="/courses"
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/courses/my"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>

        {/* Course Header */}
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">

            {/* Image */}
            <div className="flex min-h-[280px] items-center justify-center bg-stone-100 lg:min-h-[360px]">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookOpen className="h-20 w-20 text-stone-300" />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  {course.category}
                </span>

                <span className="rounded-full bg-[#d6b56d]/15 px-3 py-1 text-xs font-medium text-[#806329]">
                  {course.level}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-4 text-sm leading-7 text-stone-500">
                {course.description}
              </p>

              {course.instructor?.name && (
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-[#d6b56d]">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Instructor
                    </p>

                    <p className="text-sm font-medium text-stone-800">
                      {course.instructor.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-stone-500">
                {course.duration && (
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {course.duration}
                  </span>
                )}

                {course.lessons !== undefined && (
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons} lessons
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lessons */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-medium text-[#967438]">
              Course Content
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-stone-900">
              Lessons
            </h2>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
              <BookOpen className="mx-auto h-10 w-10 text-stone-300" />

              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Lessons coming soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                The instructor has not added lessons to this course yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons
                .sort(
                  (a, b) =>
                    (a.order || 0) - (b.order || 0)
                )
                .map((lesson, index) => (
                  <Link
                    key={lesson._id}
                    href={`/courses/${courseId}/lessons/${lesson._id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition group-hover:bg-stone-900 group-hover:text-[#d6b56d]">
                      <PlayCircle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-stone-400">
                        Lesson {index + 1}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-semibold text-stone-900">
                        {lesson.title}
                      </h3>

                      {lesson.description && (
                        <p className="mt-1 truncate text-xs text-stone-500">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    <div className="hidden items-center gap-2 text-xs text-stone-400 sm:flex">
                      {lesson.duration && (
                        <>
                          <Clock3 className="h-3.5 w-3.5" />
                          {lesson.duration}
                        </>
                      )}
                    </div>

                    <CheckCircle2 className="h-5 w-5 text-stone-300" />
                  </Link>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}