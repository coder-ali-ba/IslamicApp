"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  FileText,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

const categories = [
  "Aqeedah",
  "Fiqh",
  "Worship",
  "Family",
  "Finance",
  "Business",
  "Marriage",
  "Divorce",
  "Halal & Haram",
  "Quran",
  "Hadith",
  "Other",
];

const statuses = [
  "Pending",
  "Answered",
  "Rejected",
  "Closed",
] as const;

type FatwaStatus =
  | "Pending"
  | "Answered"
  | "Rejected"
  | "Closed";

type Scholar = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
};

type Fatwa = {
  _id: string;
  question: string;
  shortAnswer?: string;
  answer: string;
  category: string;
  status: FatwaStatus;
  scholar?: {
    _id: string;
    name: string;
    email: string;
    role: "teacher" | "scholar";
  } | null;
  primaryReference?: string;
  additionalReferences?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EditFatwaPage() {
  const params = useParams();
  const router = useRouter();

  const fatwaId = params.fatwaId as string;

  const [fatwa, setFatwa] = useState<Fatwa | null>(
    null
  );

  const [scholars, setScholars] = useState<Scholar[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [loadingScholars, setLoadingScholars] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     FORM STATES
  ========================= */

  const [question, setQuestion] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [scholar, setScholar] = useState("");

  const [primaryReference, setPrimaryReference] =
    useState("");

  const [additionalReferences, setAdditionalReferences] =
    useState("");

  const [status, setStatus] =
    useState<FatwaStatus>("Pending");

  const [published, setPublished] = useState(false);

  /* =========================
     FETCH FATWA
  ========================= */

  useEffect(() => {
    if (!fatwaId) return;

    const fetchFatwa = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/fatwas/admin/${fatwaId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load Fatwa"
          );
        }

        const item: Fatwa = data.fatwa;

        setFatwa(item);

        setQuestion(item.question || "");
        setShortAnswer(item.shortAnswer || "");
        setAnswer(item.answer || "");
        setCategory(item.category || "");
        setScholar(item.scholar?._id || "");
        setPrimaryReference(
          item.primaryReference || ""
        );
        setAdditionalReferences(
          item.additionalReferences || ""
        );
        setStatus(item.status || "Pending");
        setPublished(Boolean(item.published));
      } catch (err) {
        console.error("Fetch Fatwa Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Fatwa"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFatwa();
  }, [fatwaId]);

  /* =========================
     FETCH SCHOLARS
  ========================= */

  useEffect(() => {
    const fetchScholars = async () => {
      try {
        setLoadingScholars(true);

        const response = await fetch(
          `${API_URL}/fatwas/admin/scholars`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load scholars"
          );
        }

        setScholars(data.scholars || []);
      } catch (err) {
        console.error("Fetch Scholars Error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load scholars"
        );
      } finally {
        setLoadingScholars(false);
      }
    };

    fetchScholars();
  }, []);

  /* =========================
     SAVE FATWA
  ========================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!question.trim()) {
      setError("Question cannot be empty.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!scholar) {
      setError("Please select a scholar.");
      return;
    }

    if (status === "Answered" && !answer.trim()) {
      setError(
        "Detailed answer is required for an Answered Fatwa."
      );
      return;
    }

    if (published && status !== "Answered") {
      setError(
        "A Fatwa can only be published after it is marked as Answered."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/fatwas/admin/${fatwaId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
            shortAnswer: shortAnswer.trim(),
            answer: answer.trim(),
            category,
            scholar,
            status,
            primaryReference:
              primaryReference.trim(),
            additionalReferences:
              additionalReferences.trim(),
            published:
              status === "Answered"
                ? published
                : false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update Fatwa"
        );
      }

      setFatwa(data.fatwa);

      setSuccess(
        "Fatwa updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Update Fatwa Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update Fatwa"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE FATWA
  ========================= */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this Fatwa?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/fatwas/admin/${fatwaId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete Fatwa"
        );
      }

      router.push("/admin/fatwas");
      router.refresh();
    } catch (err) {
      console.error("Delete Fatwa Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete Fatwa"
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#967438]" />

              <p className="text-sm">
                Loading Fatwa...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!fatwa) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-900">
                  Fatwa not found
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error ||
                    "The requested Fatwa could not be found."}
                </p>

                <Link
                  href="/admin/fatwas"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Fatwas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ================= HEADER ================= */}

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
                  Manage Fatwa
                </h1>

                <p className="mt-1 text-sm text-stone-500">
                  Review and update this scholarly guidance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              Delete
            </button>

            <Link
              href="/admin/fatwas"
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              form="fatwa-form"
              type="submit"
              disabled={saving || deleting}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <Check className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="text-sm font-semibold">
                Saved successfully
              </p>

              <p className="mt-1 text-sm">
                {success}
              </p>
            </div>
          </div>
        )}

        <form
          id="fatwa-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ================= QUESTION ================= */}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <FileText className="h-5 w-5 text-[#967438]" />
                Question
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Edit the Islamic question and its classification.
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
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>

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
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="scholar"
                    className="mb-2 block text-sm font-medium text-stone-800"
                  >
                    Scholar / Teacher
                  </label>

                  <select
                    id="scholar"
                    value={scholar}
                    onChange={(e) =>
                      setScholar(e.target.value)
                    }
                    required
                    disabled={loadingScholars}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:bg-stone-50"
                  >
                    <option value="">
                      {loadingScholars
                        ? "Loading..."
                        : "Select scholar / teacher"}
                    </option>

                    {scholars.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name} — {item.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ANSWER ================= */}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Scholarly Answer
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Review and update the answer.
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
                  value={shortAnswer}
                  onChange={(e) =>
                    setShortAnswer(e.target.value)
                  }
                  rows={4}
                  maxLength={2000}
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
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  rows={12}
                  maxLength={10000}
                  required={status === "Answered"}
                  placeholder="Write the complete scholarly answer..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* ================= REFERENCES ================= */}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                References
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Quran, Hadith and scholarly sources supporting
                the answer.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="primaryReference"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Primary Reference
                </label>

                <input
                  id="primaryReference"
                  type="text"
                  value={primaryReference}
                  onChange={(e) =>
                    setPrimaryReference(e.target.value)
                  }
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
                  value={additionalReferences}
                  onChange={(e) =>
                    setAdditionalReferences(
                      e.target.value
                    )
                  }
                  rows={6}
                  placeholder="Add additional references, books, Hadith numbers, or scholarly sources..."
                  className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </section>

          {/* ================= PUBLISHING ================= */}

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-stone-900">
                Publishing
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Control the status and public visibility.
              </p>
            </div>

            <div className="space-y-5">
              {/* Status */}
              <div>
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Fatwa Status
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {statuses.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setStatus(item)
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
                          {item === "Pending" &&
                            "Awaiting scholarly review."}

                          {item === "Answered" &&
                            "Question has a scholarly answer."}

                          {item === "Rejected" &&
                            "Question has been rejected."}

                          {item === "Closed" &&
                            "Fatwa is closed and no longer active."}
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

              {/* Published */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Publish Fatwa
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Make this Fatwa visible on the public
                    Fatwa page.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={status !== "Answered"}
                  onClick={() =>
                    setPublished(!published)
                  }
                  aria-pressed={published}
                  className={`relative h-6 w-11 rounded-full transition ${
                    published
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  } ${
                    status !== "Answered"
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      published
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {status !== "Answered" && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                  Publishing is available only when the
                  Fatwa status is Answered.
                </p>
              )}
            </div>
          </section>

          {/* ================= BOTTOM ACTIONS ================= */}

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mr-auto"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {deleting
                ? "Deleting..."
                : "Delete Fatwa"}
            </button>

            <Link
              href="/admin/fatwas"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}