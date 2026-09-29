"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  Send,
  UserRound,
} from "lucide-react";

import { fatwaCategories } from "@/app/src/lib/fatwa";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Teacher = {
  _id: string;
  name: string;
  role: "teacher" | "scholar";
};

type StudentQuestion = {
  _id: string;
  question: string;
  category: string;
  answer?: string;
  status: "Pending" | "Answered" | "Closed";
  createdAt: string;
  answeredAt?: string | null;
  teacher?: {
    _id: string;
    name: string;
    role: "teacher" | "scholar";
  } | null;
};

export default function AskFatwaForm() {
  const [submitted, setSubmitted] = useState(false);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [teacher, setTeacher] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [latestQuestion, setLatestQuestion] =
    useState<StudentQuestion | null>(null);

  const [loadingLatest, setLoadingLatest] =
    useState(true);

  /* =========================================================
     LOAD TEACHERS / SCHOLARS
  ========================================================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);

        const response = await fetch(
          `${API_URL}/questions/teachers`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data?.message ||
              "Failed to load teachers and scholars."
          );
        }

        setTeachers(
          Array.isArray(data.teachers)
            ? data.teachers
            : []
        );
      } catch (err) {
        console.error(
          "Fetch question teachers error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load teachers."
        );
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  /* =========================================================
     LOAD STUDENT'S LATEST QUESTION
  ========================================================= */
  const fetchLatestQuestion = async () => {
    try {
      setLoadingLatest(true);

      const response = await fetch(
        `${API_URL}/questions/my`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to load your questions."
        );
      }

      const questions: StudentQuestion[] =
        Array.isArray(data.questions)
          ? data.questions
          : [];

      if (questions.length > 0) {
        setLatestQuestion(questions[0]);
      } else {
        setLatestQuestion(null);
      }
    } catch (err) {
      console.error(
        "Fetch latest question error:",
        err
      );

      setLatestQuestion(null);
    } finally {
      setLoadingLatest(false);
    }
  };

  useEffect(() => {
    fetchLatestQuestion();
  }, []);

  /* =========================================================
     SUBMIT QUESTION
  ========================================================= */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!teacher) {
      setError(
        "Please select a teacher or scholar."
      );
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!question.trim()) {
      setError("Please write your question.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            question: question.trim(),
            category,
            teacher,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to submit your question."
        );
      }

      /*
       * Immediately show the newly submitted
       * question above the form.
       */
      if (data.question) {
        setLatestQuestion(data.question);
      } else {
        await fetchLatestQuestion();
      }

      setSubmitted(true);

      setQuestion("");
      setCategory("");
      setTeacher("");
    } catch (err) {
      console.error(
        "Submit question error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your question."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     SUCCESS STATE
  ========================================================= */
  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Latest Question / Answer */}
        {latestQuestion && (
          <LatestQuestionCard
            question={latestQuestion}
          />
        )}

        {/* Success */}
        <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d6b56d]/10 text-[#967438]">
            <CheckCircle2 size={30} />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-stone-900">
            Question Submitted
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-500">
            Your question has been sent to the
            selected teacher or scholar. You will be
            able to see the answer once it has been
            provided.
          </p>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setError("");
            }}
            className="mt-7 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Ask Another Question
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */
  return (
    <div className="space-y-8">
      {/* =====================================================
          LATEST QUESTION
      ===================================================== */}
      {!loadingLatest && latestQuestion && (
        <LatestQuestionCard
          question={latestQuestion}
        />
      )}

      {/* =====================================================
          ASK QUESTION FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
      >
        {/* Header */}
        <div className="border-b border-stone-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <MessageSquareText size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
                Ask a Question
              </p>

              <h2 className="mt-1 text-xl font-semibold text-stone-900">
                Submit your question
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-stone-500">
            Select a qualified teacher or scholar and
            provide enough context so your question can
            be understood properly.
          </p>
        </div>

        {/* Fields */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {/* Teacher / Scholar */}
          <div className="sm:col-span-2">
            <label
              htmlFor="teacher"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
            >
              <UserRound
                size={14}
                className="text-[#967438]"
              />
              Ask Teacher / Scholar
            </label>

            <select
              id="teacher"
              name="teacher"
              value={teacher}
              onChange={(event) =>
                setTeacher(event.target.value)
              }
              required
              disabled={loadingTeachers}
              className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition-all focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingTeachers
                  ? "Loading teachers and scholars..."
                  : "Select a teacher or scholar"}
              </option>

              {teachers.map((person) => (
                <option
                  key={person._id}
                  value={person._id}
                >
                  {person.name}{" "}
                  {person.role === "scholar"
                    ? "(Scholar)"
                    : "(Teacher)"}
                </option>
              ))}
            </select>

            {!loadingTeachers &&
              teachers.length === 0 && (
                <p className="mt-2 text-xs text-stone-400">
                  No active teachers or scholars are
                  currently available.
                </p>
              )}
          </div>

          {/* Category */}
          <div className="sm:col-span-2">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              required
              className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition-all focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
            >
              <option value="" disabled>
                Select a category
              </option>

              {fatwaCategories.map((categoryItem) => (
                <option
                  key={categoryItem}
                  value={categoryItem}
                >
                  {categoryItem}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div className="sm:col-span-2">
            <label
              htmlFor="question"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
            >
              <MessageSquareText
                size={14}
                className="text-[#967438]"
              />
              Your Question
            </label>

            <textarea
              id="question"
              name="question"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              required
              rows={7}
              maxLength={5000}
              placeholder="Write your question and provide any important details or circumstances..."
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm leading-6 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-stone-400">
                {question.length}/5000
              </span>
            </div>
          </div>

          {/* Attachment */}
          <div className="sm:col-span-2">
            <label
              htmlFor="attachment"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
            >
              <FileText
                size={14}
                className="text-[#967438]"
              />

              Attachment

              <span className="font-normal text-stone-400">
                (Optional)
              </span>
            </label>

            <input
              id="attachment"
              name="attachment"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="block w-full rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500 file:mr-4 file:border-0 file:border-r file:border-stone-200 file:bg-white file:px-4 file:py-3 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-50"
            />

            <p className="mt-2 text-xs text-stone-400">
              PDF, JPG, JPEG or PNG.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {/* Notice */}
        <div className="mt-7 rounded-2xl border border-[#d6b56d]/20 bg-[#d6b56d]/5 p-4">
          <p className="text-xs leading-6 text-stone-600">
            <span className="font-semibold text-stone-800">
              Please note:
            </span>{" "}
            Personal and complex matters may require
            direct consultation with a qualified scholar.
            Avoid sharing unnecessary private or
            sensitive information.
          </p>
        </div>

        {/* Submit */}
        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            disabled={
              submitting ||
              loadingTeachers ||
              teachers.length === 0
            }
            className="group inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Sending..."
              : "Submit Question"}

            <Send
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </form>
    </div>
  );
}


/* =========================================================
   LATEST QUESTION CARD
========================================================= */
function LatestQuestionCard({
  question,
}: {
  question: StudentQuestion;
}) {
  const isAnswered =
    question.status === "Answered";

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Your Latest Question
          </p>

          <h3 className="mt-1 text-xl font-semibold text-stone-900">
            Question & Answer
          </h3>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isAnswered
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isAnswered ? (
            <CheckCircle2 size={14} />
          ) : (
            <Clock3 size={14} />
          )}

          {question.status}
        </div>
      </div>

      {/* Question */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <MessageSquareText
            size={16}
            className="text-[#967438]"
          />

          <p className="text-sm font-semibold text-stone-800">
            Your Question
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-stone-50 p-4 sm:p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
            {question.question}
          </p>
        </div>
      </div>

      {/* Teacher */}
      {question.teacher && (
        <div className="mt-5 flex items-center gap-2 text-sm text-stone-500">
          <UserRound
            size={15}
            className="text-[#967438]"
          />

          <span>
            Answered by{" "}
            <span className="font-semibold text-stone-800">
              {question.teacher.name}
            </span>

            <span className="ml-1 text-xs text-stone-400">
              (
              {question.teacher.role === "scholar"
                ? "Scholar"
                : "Teacher"}
              )
            </span>
          </span>
        </div>
      )}

      {/* Answer */}
      {isAnswered && question.answer ? (
        <div className="mt-7 border-t border-stone-100 pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="text-emerald-600"
            />

            <p className="text-sm font-semibold text-stone-800">
              Answer
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
              {question.answer}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-start gap-3">
            <Clock3
              size={17}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-800">
                Waiting for an answer
              </p>

              <p className="mt-1 text-xs leading-6 text-amber-700/80">
                Your question has been sent to the
                selected teacher or scholar. The answer
                will appear here once it is submitted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}