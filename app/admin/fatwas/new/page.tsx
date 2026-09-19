"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  FileText,
  Save,
} from "lucide-react";

const categories = [
  "Salah",
  "Fasting",
  "Zakat",
  "Hajj & Umrah",
  "Family",
  "Business",
  "General",
];

const scholars = [
  "IlmHub Scholar",
  "Mufti Abdullah",
  "Dr. Ibrahim Khan",
  "Ustadh Muhammad Ahmed",
];

export default function NewFatwaPage() {
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Backend/API will be connected later
    console.log("Fatwa form submitted");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/fatwas"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Fatwas
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  Create Fatwa
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Add a new Islamic question and scholarly answer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/fatwas"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              form="fatwa-form"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Fatwa
            </button>
          </div>
        </div>

        <form
          id="fatwa-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Review Notice */}
          <div className="flex gap-4 rounded-2xl border border-[#d6b56d]/40 bg-[#d6b56d]/10 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d6b56d] text-stone-950">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Scholar Review Required
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Ensure the answer and references have been reviewed and
                approved by a qualified scholar before publishing.
              </p>
            </div>
          </div>

          {/* Question */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <FileText className="h-5 w-5 text-[#967438]" />
                Question
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Enter the question that needs Islamic guidance.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="question"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Question
                </label>

                <textarea
                  id="question"
                  name="question"
                  required
                  rows={5}
                  placeholder="e.g. What is the importance of establishing Salah?"
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              {/* Category + Scholar */}
              <div className="grid gap-5 sm:grid-cols-2">
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

                <div>
                  <label
                    htmlFor="scholar"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    Scholar
                  </label>

                  <select
                    id="scholar"
                    name="scholar"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="" disabled>
                      Select scholar
                    </option>

                    {scholars.map((scholar) => (
                      <option key={scholar} value={scholar}>
                        {scholar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Answer */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Scholarly Answer
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add the reviewed answer to the question.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="shortAnswer"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Short Answer
                </label>

                <textarea
                  id="shortAnswer"
                  name="shortAnswer"
                  required
                  rows={4}
                  placeholder="Enter a concise answer..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="answer"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Detailed Answer
                </label>

                <textarea
                  id="answer"
                  name="answer"
                  required
                  rows={10}
                  placeholder="Write the complete scholarly answer here..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* References */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                References
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Add the Quran, Hadith, or scholarly references supporting the
                answer.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="reference"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Primary Reference
                </label>

                <input
                  id="reference"
                  name="reference"
                  type="text"
                  required
                  placeholder="e.g. Quran 4:103"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="additionalReferences"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Additional References
                </label>

                <textarea
                  id="additionalReferences"
                  name="additionalReferences"
                  rows={5}
                  placeholder="Add additional references, books, Hadith numbers, or scholarly sources..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* Publishing */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Publishing
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Control when this guidance becomes publicly visible.
              </p>
            </div>

            <div className="space-y-5">
              {/* Status */}
              <div>
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Fatwa Status
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(["Draft", "Published"] as const).map((item) => (
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
                          {item === "Draft"
                            ? "Keep this guidance hidden until reviewed."
                            : "Make this guidance visible to users."}
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

              {/* Featured */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Featured Fatwa
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Highlight this guidance on the Fatwa page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  aria-pressed={featured}
                  className={`relative h-6 w-11 rounded-full transition ${
                    featured ? "bg-stone-900" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      featured ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/fatwas"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Fatwa
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}