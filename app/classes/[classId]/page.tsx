import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";

import { classes } from "@/app/src/lib/classes";
import { classDetails } from "@/app/src/lib/class-details";

type ClassDetailsPageProps = {
  params: Promise<{
    classId: string;
  }>;
};

export default async function ClassDetailsPage({
  params,
}: ClassDetailsPageProps) {
  const { classId } = await params;

  const classItem = classes.find((item) => item.id === classId);

  if (!classItem) {
    notFound();
  }

  const details = classDetails[classItem.id];

  if (!details) {
    notFound();
  }

  const availableSeats =
    classItem.maxStudents - classItem.students;

  const seatsPercentage =
    (classItem.students / classItem.maxStudents) * 100;

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {/* Islamic pattern */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
              linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
              linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
              linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d)
            `,
            backgroundSize: "80px 140px",
            backgroundPosition:
              "0 0, 0 0, 40px 70px, 40px 70px",
          }}
        />

        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full border border-[#d6b56d]/10" />

        <div className="absolute -right-40 bottom-[-160px] h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          {/* Back */}
          <Link
            href="/classes"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-300 transition hover:text-[#d6b56d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Content */}
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d6b56d]/30 bg-[#d6b56d]/10 px-3 py-1.5 text-xs font-semibold text-[#e4c98d]">
                  {classItem.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-stone-300">
                  {classItem.level}
                </span>

                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-stone-300">
                  <Video className="h-3.5 w-3.5" />
                  Live Class
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {classItem.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                {classItem.description}
              </p>

              {/* Instructor */}
              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10">
                  <GraduationCap className="h-5 w-5 text-[#d6b56d]" />
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    Instructor
                  </p>
                  <p className="font-medium text-white">
                    {classItem.instructor}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <CalendarDays className="mb-2 h-4 w-4 text-[#d6b56d]" />
                  <p className="text-xs text-stone-400">Date</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.date}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Clock3 className="mb-2 h-4 w-4 text-[#d6b56d]" />
                  <p className="text-xs text-stone-400">Time</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.time}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Clock3 className="mb-2 h-4 w-4 text-[#d6b56d]" />
                  <p className="text-xs text-stone-400">
                    Duration
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.duration}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <Users className="mb-2 h-4 w-4 text-[#d6b56d]" />
                  <p className="text-xs text-stone-400">Students</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {classItem.students}/{classItem.maxStudents}
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl border border-[#d6b56d]/10" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-stone-800 shadow-2xl">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="h-[360px] w-full object-cover sm:h-[420px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/10 bg-stone-950/70 p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-stone-400">
                          Class Fee
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-[#e4c98d]">
                          Rs {classItem.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
                        <p className="text-xs text-stone-400">
                          Available
                        </p>
                        <p className="font-semibold text-white">
                          {availableSeats} seats
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-10">
            {/* What you'll learn */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Learning Outcomes
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  What You&apos;ll Learn
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {details.whatYouWillLearn.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                    <p className="text-sm leading-6 text-stone-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Topics */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Session Topics
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  What We&apos;ll Cover
                </h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {details.topics.map((topic, index) => (
                  <div
                    key={topic}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      index !== details.topics.length - 1
                        ? "border-b border-stone-100"
                        : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="text-sm font-medium text-stone-700">
                      {topic}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Before You Join
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
                  Requirements
                </h2>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <div className="space-y-4">
                  {details.requirements.map((requirement) => (
                    <div
                      key={requirement}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b99a5a]" />

                      <p className="text-sm leading-6 text-stone-600">
                        {requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Booking Card */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-100 p-6">
                <p className="text-sm font-medium text-stone-500">
                  Reserve Your Seat
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-semibold text-stone-900">
                    Rs {classItem.price.toLocaleString()}
                  </span>

                  <span className="mb-1 text-sm text-stone-400">
                    per class
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <CalendarDays className="h-5 w-5 text-stone-600" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-stone-800">
                      {classItem.date}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Clock3 className="h-5 w-5 text-stone-600" />
                  </div>

                  <div>
                    <p className="text-xs text-stone-400">
                      Time & Duration
                    </p>
                    <p className="mt-1 text-sm font-medium text-stone-800">
                      {classItem.time} • {classItem.duration}
                    </p>
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-stone-500">
                      Seats filled
                    </span>

                    <span className="font-medium text-stone-800">
                      {classItem.students}/{classItem.maxStudents}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-[#b99a5a]"
                      style={{
                        width: `${seatsPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-stone-400">
                    {availableSeats} seats remaining
                  </p>
                </div>

                {/* Booking button */}
                <Link
                  href="#booking"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Book This Class
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <p className="text-center text-xs leading-5 text-stone-400">
                  Booking and payment will be available after account
                  setup.
                </p>

                {/* Info */}
                <div className="rounded-2xl bg-stone-50 p-4">
                  <div className="flex gap-3">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        Live & Interactive
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Join the live session, interact with your
                        instructor, and ask questions during the class.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        id="booking"
        className="border-t border-stone-200 bg-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-14 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Start Learning
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-stone-900">
            Ready to join this class?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Reserve your place and learn directly with an instructor
            in a focused live session.
          </p>

          <Link
            href="/classes"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Explore More Classes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}