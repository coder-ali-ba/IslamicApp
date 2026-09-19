"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Save,
  Users,
  Video,
} from "lucide-react";

const teachers = [
  "Ustadh Muhammad Ahmed",
  "Ustadh Abdul Rahman",
  "Dr. Ibrahim Khan",
  "Ustadh Omar Farooq",
  "Mufti Abdullah",
  "Dr. Hamza Malik",
];

const categories = ["Quran", "Tajweed", "Arabic", "Hadith", "Fiqh"];

const levels = ["Beginner", "Intermediate", "Advanced"];

const statuses = ["Upcoming", "Live", "Completed", "Cancelled"];

export default function NewClassPage() {
  const [status, setStatus] = useState<
    "Upcoming" | "Live" | "Completed" | "Cancelled"
  >("Upcoming");

  const [recording, setRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend/API will be connected later
    console.log("Class form submitted");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/classes"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Classes
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Create Class
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Schedule a new live Islamic class on IlmHub.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/classes"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              form="class-form"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Class
            </button>
          </div>
        </div>

        <form
          id="class-form"
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
                Add the main information about the class.
              </p>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Class Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Quran Reading Live Class"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
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
                  rows={5}
                  required
                  placeholder="Describe what students will learn in this class..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Teacher + Category */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="teacher"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    Teacher
                  </label>

                  <select
                    id="teacher"
                    name="teacher"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="" disabled>
                      Select teacher
                    </option>

                    {teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>

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
                    defaultValue=""
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level */}
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
                  defaultValue=""
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="" disabled>
                    Select level
                  </option>

                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <CalendarDays className="h-5 w-5 text-[#967438]" />
                Class Schedule
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Set the date and time for this class.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Time */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Start Time
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-800"
                >
                  <Clock3 className="h-4 w-4 text-stone-500" />
                  Duration
                </label>

                <select
                  id="duration"
                  name="duration"
                  defaultValue="60"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label
                  htmlFor="timezone"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Timezone
                </label>

                <select
                  id="timezone"
                  name="timezone"
                  defaultValue="Asia/Karachi"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="Asia/Karachi">
                    Pakistan Standard Time
                  </option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Riyadh">Arabia Standard Time</option>
                  <option value="Asia/Dubai">Gulf Standard Time</option>
                </select>
              </div>
            </div>
          </section>

          {/* Class Capacity */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <Users className="h-5 w-5 text-[#967438]" />
                Class Capacity
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Set the maximum number of students who can join.
              </p>
            </div>

            <div className="max-w-md">
              <label
                htmlFor="maxStudents"
                className="mb-2 block text-sm font-medium text-stone-800"
              >
                Maximum Students
              </label>

              <input
                id="maxStudents"
                name="maxStudents"
                type="number"
                min="1"
                defaultValue="30"
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />

              <p className="mt-2 text-xs text-stone-400">
                Students will not be able to enroll once this limit is reached.
              </p>
            </div>
          </section>

          {/* Online Class */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <Video className="h-5 w-5 text-[#967438]" />
                Online Class
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add the meeting information for the live class.
              </p>
            </div>

            <div className="space-y-5">
              {/* Meeting Link */}
              <div>
                <label
                  htmlFor="meetingLink"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Meeting Link
                </label>

                <input
                  id="meetingLink"
                  name="meetingLink"
                  type="url"
                  placeholder="https://meet.example.com/class-room"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-2 text-xs text-stone-400">
                  This can later be replaced with your own WebRTC classroom
                  system.
                </p>
              </div>

              {/* Recording */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Record Class
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Allow this class to be recorded for enrolled students.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRecording(!recording)}
                  aria-pressed={recording}
                  className={`relative h-6 w-11 rounded-full transition ${
                    recording ? "bg-stone-900" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      recording ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Class Status
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Choose the current status of this class.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {statuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setStatus(
                      item as
                        | "Upcoming"
                        | "Live"
                        | "Completed"
                        | "Cancelled",
                    )
                  }
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
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
                      {item === "Upcoming" &&
                        "Class is scheduled and waiting to start."}

                      {item === "Live" &&
                        "Class is currently available for students."}

                      {item === "Completed" &&
                        "The class has already finished."}

                      {item === "Cancelled" &&
                        "The class has been cancelled."}
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
          </section>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/classes"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Class
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}