import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Users,
} from "lucide-react";

import { teachers } from "@/app/src/lib/teachers";
import { courses } from "@/app/src/lib/course";
import { classes } from "@/app/src/lib/classes";

type TeacherProfilePageProps = {
  params: Promise<{
    teacherId: string;
  }>;
};

export default async function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  const { teacherId } = await params;

  const teacher = teachers.find(
    (item) => item.id === teacherId
  );

  if (!teacher) {
    notFound();
  }

  // Match teacher's courses/classes by instructor name
  const teacherCourses = courses.filter(
    (course) => course.instructor === teacher.name
  );

  const teacherClasses = classes.filter(
    (classItem) => classItem.instructor === teacher.name
  );

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
              linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d)
            `,
            backgroundSize: "70px 120px",
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -right-40 bottom-[-160px] h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          {/* Back */}
          <Link
            href="/teachers"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-stone-300 transition hover:text-[#d6b56d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Image */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] border border-[#d6b56d]/10" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-stone-800">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="h-[420px] w-full object-cover sm:h-[500px]"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent p-6 pt-24">
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {teacher.featured && (
                  <span className="rounded-full border border-[#d6b56d]/30 bg-[#d6b56d]/10 px-3 py-1.5 text-xs font-semibold text-[#e4c98d]">
                    Featured Teacher
                  </span>
                )}

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300">
                  {teacher.experience} Experience
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {teacher.name}
              </h1>

              <p className="mt-4 text-lg font-medium text-[#d6b56d]">
                {teacher.title}
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-stone-300">
                {teacher.bio}
              </p>

              {/* Qualification */}
              <div className="mt-7 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6b56d]/10">
                  <GraduationCap className="h-5 w-5 text-[#d6b56d]" />
                </div>

                <div>
                  <p className="text-xs text-stone-500">
                    Qualification
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {teacher.qualification}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <Users className="mb-2 h-5 w-5 text-[#d6b56d]" />

                  <p className="text-xl font-semibold">
                    {teacher.students.toLocaleString()}+
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Students
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <BookOpen className="mb-2 h-5 w-5 text-[#d6b56d]" />

                  <p className="text-xl font-semibold">
                    {teacher.courses}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Courses
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <PlayCircle className="mb-2 h-5 w-5 text-[#d6b56d]" />

                  <p className="text-xl font-semibold">
                    {teacher.classes}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Live Classes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-12">
            {/* About */}
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                About The Teacher
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                Learn With {teacher.name}
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-600">
                {teacher.bio} Their teaching approach focuses on
                understanding, practical learning, and creating a
                comfortable environment where students can ask questions
                and improve step by step.
              </p>
            </section>

            {/* Subjects */}
            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                Areas Of Knowledge
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                Subjects Taught
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {teacher.subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                      <BookOpen className="h-5 w-5 text-[#967438]" />
                    </div>

                    <div>
                      <p className="font-semibold text-stone-800">
                        {subject}
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        Available for learning
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses */}
            {teacherCourses.length > 0 && (
              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                      Courses
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                      Courses By {teacher.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {teacherCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="group flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-md sm:flex-row sm:items-center"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-36"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                            {course.category}
                          </span>

                          <span className="rounded-full bg-[#d6b56d]/10 px-2.5 py-1 text-[11px] font-medium text-[#967438]">
                            {course.level}
                          </span>
                        </div>

                        <h3 className="mt-2 font-semibold text-stone-900">
                          {course.title}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                          {course.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-400">
                          <span>{course.duration}</span>
                          <span>{course.lessons} Lessons</span>
                          <span>
                            Rs {course.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="hidden h-5 w-5 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#967438] sm:block" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Live Classes */}
            {teacherClasses.length > 0 && (
              <section>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Live Learning
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  Upcoming Classes
                </h2>

                <div className="mt-6 space-y-4">
                  {teacherClasses.map((classItem) => {
                    const availableSeats =
                      classItem.maxStudents - classItem.students;

                    return (
                      <Link
                        key={classItem.id}
                        href={`/classes/${classItem.id}`}
                        className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                          <img
                            src={classItem.image}
                            alt={classItem.title}
                            className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-36"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
                                {classItem.category}
                              </span>

                              <span className="rounded-full bg-[#d6b56d]/10 px-2.5 py-1 text-[11px] font-medium text-[#967438]">
                                {classItem.status}
                              </span>
                            </div>

                            <h3 className="mt-2 font-semibold text-stone-900">
                              {classItem.title}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {classItem.date}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <PlayCircle className="h-3.5 w-3.5" />
                                {classItem.time}
                              </span>

                              <span>
                                {availableSeats} seats left
                              </span>
                            </div>
                          </div>

                          <ArrowRight className="hidden h-5 w-5 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#967438] sm:block" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 p-6">
                <p className="text-sm font-medium text-stone-500">
                  Learn With This Teacher
                </p>

                <h3 className="mt-2 text-xl font-semibold text-stone-900">
                  Start Your Learning Journey
                </h3>
              </div>

              <div className="space-y-5 p-6">
                {/* Experience */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                    <GraduationCap className="h-5 w-5 text-[#967438]" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Experience
                    </p>

                    <p className="text-sm font-semibold text-stone-800">
                      {teacher.experience}
                    </p>
                  </div>
                </div>

                {/* Students */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                    <Users className="h-5 w-5 text-[#967438]" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Students
                    </p>

                    <p className="text-sm font-semibold text-stone-800">
                      {teacher.students.toLocaleString()}+
                    </p>
                  </div>
                </div>

                {/* Qualification */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <BookOpen className="h-5 w-5 text-[#967438]" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Qualification
                    </p>

                    <p className="text-sm font-semibold leading-5 text-stone-800">
                      {teacher.qualification}
                    </p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-5">
                  <div className="space-y-3">
                    {teacher.subjects.map((subject) => (
                      <div
                        key={subject}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#967438]" />
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask About Classes
                </button>

                <Link
                  href="/classes"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 px-5 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Explore All Classes
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-center text-xs leading-5 text-stone-400">
                  Teacher communication and direct booking will be
                  connected after authentication and backend setup.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
            <GraduationCap className="h-7 w-7 text-[#967438]" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Continue Learning
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-stone-900">
            Find the right class for you
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Explore upcoming live sessions and learn directly from
            experienced instructors.
          </p>

          <Link
            href="/classes"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Browse Classes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}