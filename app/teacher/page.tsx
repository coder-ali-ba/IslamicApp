import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  MessageSquare,
  Plus,
  Users,
  Video,
} from "lucide-react";

const stats = [
  {
    title: "My Courses",
    value: "6",
    description: "Active courses",
    icon: BookOpen,
  },
  {
    title: "My Students",
    value: "248",
    description: "Total enrolled",
    icon: Users,
  },
  {
    title: "Upcoming Classes",
    value: "8",
    description: "This month",
    icon: CalendarDays,
  },
  {
    title: "Messages",
    value: "12",
    description: "Unread messages",
    icon: MessageSquare,
  },
];

const upcomingClasses = [
  {
    title: "Quran Reading Live Class",
    category: "Quran",
    date: "Today",
    time: "07:00 PM",
    students: 24,
    status: "Upcoming",
  },
  {
    title: "Tajweed Correction Session",
    category: "Tajweed",
    date: "Tomorrow",
    time: "06:30 PM",
    students: 18,
    status: "Upcoming",
  },
  {
    title: "Hadith Study Circle",
    category: "Hadith",
    date: "20 Sep",
    time: "08:00 PM",
    students: 31,
    status: "Upcoming",
  },
];

const recentStudents = [
  {
    name: "Ahmed Khan",
    course: "Learn Quran Reading",
    date: "18 Sep 2026",
    initials: "AK",
  },
  {
    name: "Fatima Ali",
    course: "Quran with Tajweed",
    date: "17 Sep 2026",
    initials: "FA",
  },
  {
    name: "Usman Malik",
    course: "Understanding Hadith",
    date: "16 Sep 2026",
    initials: "UM",
  },
  {
    name: "Ayesha Noor",
    course: "Arabic Language Basics",
    date: "15 Sep 2026",
    initials: "AN",
  },
];

export default function TeacherDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <section className="overflow-hidden rounded-3xl bg-stone-950 p-6 text-white shadow-sm sm:p-8">
        <div className="relative">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#d6b56d]/10" />
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-[#d6b56d]/10" />

          <div className="relative max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-[#d6b56d]">
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Teacher & Scholar
              </span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Assalamu Alaikum, Ustadh Muhammad Ahmed
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              Manage your courses, classes, students, and Islamic
              learning activities from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/teacher/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d6b56d] px-5 py-3 text-sm font-medium text-stone-950 transition hover:bg-[#e0c27e]"
              >
                Manage Courses
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/teacher/classes"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-5 py-3 text-sm font-medium text-stone-200 transition hover:border-[#d6b56d] hover:text-white"
              >
                View Classes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-stone-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-stone-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-stone-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Upcoming Classes */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h3 className="font-semibold text-stone-900">
                Upcoming Classes
              </h3>

              <p className="mt-1 text-xs text-stone-500">
                Your scheduled classes
              </p>
            </div>

            <Link
              href="/teacher/classes"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#967438] hover:text-stone-900"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {upcomingClasses.map((item) => (
              <div
                key={item.title}
                className="p-5 transition hover:bg-stone-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                      <Video className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="font-medium text-stone-900">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-xs text-[#967438]">
                        {item.category}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {item.date}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.time}
                        </span>

                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {item.students} students
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="font-semibold text-stone-900">
              Quick Actions
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Manage your teaching activities
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <Link
              href="/teacher/courses"
              className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-[#d6b56d] hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">
                  Manage Courses
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  View and update your courses
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/teacher/classes"
              className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-[#d6b56d] hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">
                  Manage Classes
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Schedule and manage live classes
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/teacher/students"
              className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-[#d6b56d] hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Users className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">
                  View Students
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Check your enrolled students
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-900" />
            </Link>

            <Link
              href="/teacher/messages"
              className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition hover:border-[#d6b56d] hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <MessageSquare className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">
                  Messages
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  12 unread student messages
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-900" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Students */}
      <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 p-5">
          <div>
            <h3 className="font-semibold text-stone-900">
              Recent Students
            </h3>

            <p className="mt-1 text-xs text-stone-500">
              Latest course enrollments
            </p>
          </div>

          <Link
            href="/teacher/students"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#967438] hover:text-stone-900"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y divide-stone-100">
          {recentStudents.map((student) => (
            <div
              key={student.name}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-[#d6b56d]">
                  {student.initials}
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {student.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {student.course}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-400">
                Enrolled {student.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Note */}
      <section className="rounded-2xl border border-[#d6b56d]/30 bg-[#d6b56d]/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
            <Plus className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Keep your teaching activities organized
            </h3>

            <p className="mt-1 text-xs leading-6 text-stone-600">
              Manage your courses, classes, and students from your
              teacher dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}