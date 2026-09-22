"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Users,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import EnrollButton from "@/app/components/courses/EnrollmentButton";

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  image: string;
  featured: boolean;
  status: string;
  instructor?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function CourseDetailsPage() {
  const params = useParams();

  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load course"
          );
        }

        setCourse(data.course);
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

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-5 w-32 rounded bg-stone-200" />

            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div className="h-[420px] rounded-3xl bg-stone-200" />

              <div className="space-y-5">
                <div className="h-10 w-3/4 rounded bg-stone-200" />
                <div className="h-5 w-full rounded bg-stone-200" />
                <div className="h-5 w-5/6 rounded bg-stone-200" />
                <div className="h-32 rounded-2xl bg-stone-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <BookOpen className="h-6 w-6 text-stone-600" />
          </div>

          <h1 className="text-2xl font-semibold text-stone-900">
            Course not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            {error || "The course you are looking for does not exist."}
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
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
      {/* Hero */}
      <section className="bg-stone-950">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d6b56d]/30 bg-[#d6b56d]/10 px-3 py-1 text-xs font-medium text-[#d6b56d]">
                  {course.category}
                </span>

                <span className="rounded-full border border-stone-700 bg-stone-900 px-3 py-1 text-xs font-medium text-stone-300">
                  {course.level}
                </span>

                {course.featured && (
                  <span className="rounded-full bg-[#d6b56d] px-3 py-1 text-xs font-medium text-stone-950">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-stone-400">
                {course.description}
              </p>

              {course.instructor && (
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6b56d]/15 text-[#d6b56d]">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-500">
                      Instructor
                    </p>

                    <p className="text-sm font-medium text-stone-200">
                      {course.instructor.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-[300px] w-full object-cover lg:h-[360px]"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center bg-stone-900 lg:h-[360px]">
                  <BookOpen className="h-16 w-16 text-stone-700" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              About this course
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-stone-600">
              {course.description}
            </p>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-stone-900">
                What you&apos;ll get
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  "Structured course lessons",
                  "Learn from qualified instructors",
                  "Practical Islamic knowledge",
                  "Progress-based learning",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                    <span className="text-sm leading-6 text-stone-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <aside>
            <div className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Course Price
                </p>

                <p className="mt-2 text-3xl font-semibold text-stone-900">
                  {course.price === 0
                    ? "Free"
                    : `Rs. ${course.price.toLocaleString()}`}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <Clock3 className="h-5 w-5 text-[#967438]" />

                  <p className="mt-3 text-xs text-stone-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {course.duration}
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <BookOpen className="h-5 w-5 text-[#967438]" />

                  <p className="mt-3 text-xs text-stone-400">
                    Lessons
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {course.lessons}
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <Users className="h-5 w-5 text-[#967438]" />

                  <p className="mt-3 text-xs text-stone-400">
                    Students
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {course.students}
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <GraduationCap className="h-5 w-5 text-[#967438]" />

                  <p className="mt-3 text-xs text-stone-400">
                    Level
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {course.level}
                  </p>
                </div>
              </div>

              <EnrollButton courseId={course._id} />

              <p className="mt-4 text-center text-xs leading-5 text-stone-400">
                You can enroll using a student account.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

