import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
  Users,
} from "lucide-react";

import { courses } from "@/app/src/lib/course";
import { courseDetails } from "@/app/src/lib/course-detail";

type CourseDetailsPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;

  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    notFound();
  }

  const details = courseDetails[course.id];

  if (!details) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {/* Background Decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

          <div className="absolute -right-28 -top-28 h-[300px] w-[300px] rounded-full border border-[#d6b56d]/10" />

          <div className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full border border-white/5" />

          <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-[#d6b56d]/5 blur-3xl" />
        </div>

        {/* Islamic Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="course-detail-pattern"
                width="90"
                height="90"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M45 5 L85 45 L45 85 L5 45 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />

                <path
                  d="M45 20 L70 45 L45 70 L20 45 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />

                <circle
                  cx="45"
                  cy="45"
                  r="5"
                  fill="none"
                  stroke="white"
                />
              </pattern>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="url(#course-detail-pattern)"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          {/* Back */}
          <Link
            href="/courses"
            className="mb-10 inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-[#d6b56d]"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_440px]">
            {/* Left */}
            <div>
              {/* Badges */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
                  {course.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300">
                  {course.level}
                </span>

                {course.featured && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10">
                  <GraduationCap
                    size={20}
                    className="text-[#d6b56d]"
                  />
                </div>

                <div>
                  <p className="text-xs text-stone-500">
                    Instructor
                  </p>

                  <p className="text-sm font-medium text-stone-200">
                    {course.instructor}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-stone-400">
                <span className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#d6b56d]" />
                  {course.duration}
                </span>

                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#d6b56d]" />
                  {course.lessons} Lessons
                </span>

                <span className="flex items-center gap-2">
                  <Users size={16} className="text-[#d6b56d]" />
                  {course.students.toLocaleString()} Students
                </span>
              </div>
            </div>

            {/* Course Image */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[#d6b56d]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-stone-800">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-[300px] w-full object-cover sm:h-[360px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d6b56d]">
                    IlmHub Course
                  </p>

                  <p className="mt-1 text-lg font-medium text-white">
                    Learn with purpose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {/* Content */}
          <div>
            {/* What You'll Learn */}
            <section>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
                  Course Benefits
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  What you'll learn
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {details.whatYouLearn.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-[#967438]"
                    />

                    <p className="text-sm leading-6 text-stone-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section className="mt-16">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
                  Course Content
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  Curriculum
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  {details.curriculum.length} lessons •{" "}
                  {course.duration}
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {details.curriculum.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 px-5 py-5 ${
                      index !== details.curriculum.length - 1
                        ? "border-b border-stone-100"
                        : ""
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-800">
                        {lesson.title}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs text-stone-400">
                      <PlayCircle size={15} />
                      {lesson.duration}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="mt-16">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
                  Before You Start
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  Requirements
                </h2>
              </div>

              <div className="space-y-3">
                {details.requirements.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6b56d]" />

                    <p className="text-sm leading-7 text-stone-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Enrollment Card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              id="enroll"
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="border-b border-stone-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Course Fee
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-stone-900">
                    Rs. {course.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Level
                  </span>

                  <span className="font-medium text-stone-800">
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Duration
                  </span>

                  <span className="font-medium text-stone-800">
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Lessons
                  </span>

                  <span className="font-medium text-stone-800">
                    {course.lessons}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">
                    Students
                  </span>

                  <span className="font-medium text-stone-800">
                    {course.students.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Enroll Now
                    <ArrowLeft
                      size={17}
                      className="rotate-180"
                    />
                  </button>
                </div>

                <p className="text-center text-xs leading-5 text-stone-400">
                  Secure enrollment will be available after
                  account setup.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}