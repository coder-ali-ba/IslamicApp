import {
  Users,
  GraduationCap,
  BookOpen,
  Video,
  MessageCircleQuestion,
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,248",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Teachers",
    value: "32",
    change: "+4.2%",
    icon: GraduationCap,
  },
  {
    title: "Courses",
    value: "48",
    change: "+8.1%",
    icon: BookOpen,
  },
  {
    title: "Live Classes",
    value: "16",
    change: "+6.4%",
    icon: Video,
  },
];

const recentEnrollments = [
  {
    name: "Ahmed Khan",
    course: "Quran with Tajweed",
    date: "Today, 10:30 AM",
  },
  {
    name: "Fatima Ali",
    course: "Understanding Hadith",
    date: "Today, 09:15 AM",
  },
  {
    name: "Usman Malik",
    course: "Arabic Language Basics",
    date: "Yesterday, 06:40 PM",
  },
  {
    name: "Ayesha Noor",
    course: "Islamic Foundations",
    date: "Yesterday, 04:20 PM",
  },
];

const upcomingClasses = [
  {
    title: "Quran Reading Live Class",
    teacher: "Ustadh Muhammad Ahmed",
    time: "07:00 PM",
  },
  {
    title: "Tajweed Correction Session",
    teacher: "Ustadh Abdul Rahman",
    time: "08:30 PM",
  },
  {
    title: "Hadith Study Circle",
    teacher: "Dr. Ibrahim Khan",
    time: "09:00 PM",
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-medium text-[#967438]">
          Welcome back, Admin
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          IlmHub Overview
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
          Manage your Islamic learning platform, monitor activity, and keep
          your content organized.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-stone-500">{stat.title}</p>

              <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Recent Enrollments */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h3 className="font-semibold text-stone-900">
                Recent Enrollments
              </h3>
              <p className="mt-1 text-xs text-stone-500">
                Latest student activity
              </p>
            </div>

            <button className="inline-flex items-center gap-1 text-xs font-medium text-[#967438] hover:text-stone-900">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentEnrollments.map((item) => (
              <div
                key={`${item.name}-${item.course}`}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                    {item.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {item.course}
                    </p>
                  </div>
                </div>

                <p className="hidden shrink-0 text-xs text-stone-400 sm:block">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 p-5">
            <h3 className="font-semibold text-stone-900">
              Upcoming Classes
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Today&apos;s scheduled sessions
            </p>
          </div>

          <div className="space-y-3 p-4">
            {upcomingClasses.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-stone-100 bg-[#faf9f6] p-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900">
                      {item.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-stone-500">
                      {item.teacher}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#967438]">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="mb-4 font-semibold text-stone-900">Quick Actions</h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/courses"
            className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-[#d6b56d] hover:shadow-md"
          >
            + Add Course
          </a>

          <a
            href="/admin/classes"
            className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-[#d6b56d] hover:shadow-md"
          >
            + Create Class
          </a>

          <a
            href="/admin/teachers"
            className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-[#d6b56d] hover:shadow-md"
          >
            + Add Teacher
          </a>

          <a
            href="/admin/fatwas"
            className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-[#d6b56d] hover:shadow-md"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Review Fatwas
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}