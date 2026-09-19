"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  GraduationCap,
  Save,
  UserRound,
} from "lucide-react";

const specializations = [
  "Quran & Tajweed",
  "Tajweed",
  "Hadith & Islamic Studies",
  "Arabic Language",
  "Fiqh",
  "Seerah & Islamic Studies",
];

export default function NewTeacherPage() {
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [verified, setVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend/API will be connected later
    console.log("Teacher form submitted");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/teachers"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teachers
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Add Teacher
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Add a new teacher to the IlmHub platform.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/teachers"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              form="teacher-form"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Teacher
            </button>
          </div>
        </div>

        <form
          id="teacher-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Personal Information */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Basic information about the teacher.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Ustadh Muhammad Ahmed"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="teacher@example.com"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Experience
                </label>

                <input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="e.g. 8 years"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* Teaching Information */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Teaching Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add the teacher&apos;s specialization and introduction.
              </p>
            </div>

            <div className="space-y-5">
              {/* Specialization */}
              <div>
                <label
                  htmlFor="specialization"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Specialization
                </label>

                <select
                  id="specialization"
                  name="specialization"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="" disabled>
                    Select specialization
                  </option>

                  {specializations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Teacher Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows={6}
                  placeholder="Write a short introduction about the teacher, their education and teaching experience..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Qualification */}
              <div>
                <label
                  htmlFor="qualification"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Qualification
                </label>

                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  placeholder="e.g. Alimiyyah, MA Islamic Studies"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* Profile Image */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Profile Image
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add the teacher&apos;s profile image.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                <UserRound className="h-9 w-9" />
              </div>

              <div className="w-full">
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Image URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/teacher.jpg"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-2 text-xs text-stone-400">
                  Cloudinary upload will be connected later.
                </p>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Account Settings
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Manage the teacher&apos;s platform status.
              </p>
            </div>

            <div className="space-y-5">
              {/* Status */}
              <div>
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Account Status
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(["Active", "Inactive"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatus(item)}
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
                          {item === "Active"
                            ? "Teacher can teach courses and classes."
                            : "Temporarily disable teacher access."}
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
              </div>

              {/* Verification */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Verified Teacher
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Mark this teacher as verified by the IlmHub administration.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setVerified(!verified)}
                  aria-pressed={verified}
                  className={`relative h-6 w-11 rounded-full transition ${
                    verified ? "bg-stone-900" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      verified ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/teachers"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Teacher
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}