"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type QuestionStatus =
  | "Pending"
  | "Answered"
  | "Closed";

type Question = {
  _id: string;
  question: string;
  category: string;
  answer?: string;
  status: QuestionStatus;
  createdAt: string;
  answeredAt?: string | null;
  student?: {
    _id: string;
    name: string;
    email?: string;
  } | null;
  teacher?: {
    _id: string;
    name: string;
    role: "teacher" | "scholar";
  } | null;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(
    []
  );

  const [selectedQuestion, setSelectedQuestion] =
    useState<Question | null>(null);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filter, setFilter] = useState<
    "All" | QuestionStatus
  >("All");

  /* =========================================================
     LOAD QUESTIONS
  ========================================================= */
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/questions/teacher`,
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
            "Failed to load questions."
        );
      }

      const loadedQuestions: Question[] =
        Array.isArray(data.questions)
          ? data.questions
          : [];

      setQuestions(loadedQuestions);

      if (selectedQuestion) {
        const updated = loadedQuestions.find(
          (item) =>
            item._id === selectedQuestion._id
        );

        if (updated) {
          setSelectedQuestion(updated);
          setAnswer(updated.answer || "");
        }
      }
    } catch (err) {
      console.error(
        "Fetch teacher questions error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load questions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     FILTER
  ========================================================= */
  const filteredQuestions = useMemo(() => {
    if (filter === "All") {
      return questions;
    }

    return questions.filter(
      (question) => question.status === filter
    );
  }, [questions, filter]);

  /* =========================================================
     SELECT QUESTION
  ========================================================= */
  const handleSelectQuestion = (
    question: Question
  ) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || "");
    setSuccess("");
    setError("");
  };

  /* =========================================================
     ANSWER QUESTION
  ========================================================= */
  const handleAnswer = async () => {
    if (!selectedQuestion) return;

    if (!answer.trim()) {
      setError("Please write an answer.");
      return;
    }

    if (answer.trim().length < 5) {
      setError(
        "Answer must contain at least 5 characters."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/questions/teacher/${selectedQuestion._id}/answer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            answer: answer.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to submit answer."
        );
      }

      setSuccess(
        "Answer submitted successfully."
      );

      if (data.question) {
        setSelectedQuestion(data.question);
        setAnswer(data.question.answer || "");
      }

      await fetchQuestions();
    } catch (err) {
      console.error(
        "Answer question error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     CLOSE QUESTION
  ========================================================= */
  const handleClose = async () => {
    if (!selectedQuestion) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/questions/teacher/${selectedQuestion._id}/close`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to close question."
        );
      }

      setSuccess(
        "Question closed successfully."
      );

      if (data.question) {
        setSelectedQuestion(data.question);
      }

      await fetchQuestions();
    } catch (err) {
      console.error(
        "Close question error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to close question."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     COUNTS
  ========================================================= */
  const pendingCount = questions.filter(
    (question) =>
      question.status === "Pending"
  ).length;

  const answeredCount = questions.filter(
    (question) =>
      question.status === "Answered"
  ).length;

  const closedCount = questions.filter(
    (question) =>
      question.status === "Closed"
  ).length;

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-900">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
            Student Questions
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
                Questions & Answers
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                Review questions assigned to you and
                provide clear Islamic guidance to
                students.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchQuestions}
              className="w-fit rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<Clock3 size={18} />}
          />

          <StatCard
            label="Answered"
            value={answeredCount}
            icon={<CheckCircle2 size={18} />}
          />

          <StatCard
            label="Closed"
            value={closedCount}
            icon={<XCircle size={18} />}
          />
        </div>

        {/* =====================================================
            ERROR / SUCCESS
        ===================================================== */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* =====================================================
            FILTERS
        ===================================================== */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              "All",
              "Pending",
              "Answered",
              "Closed",
            ] as const
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filter === item
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* ===================================================
              QUESTION LIST
          =================================================== */}
          <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-stone-900">
                  Questions
                </h2>

                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                  {filteredQuestions.length}
                </span>
              </div>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {loading ? (
                <div className="space-y-3 p-5">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-2xl bg-stone-100"
                      />
                    )
                  )}
                </div>
              ) : filteredQuestions.length ===
                0 ? (
                <div className="px-5 py-12 text-center">
                  <MessageSquareText
                    size={30}
                    className="mx-auto text-stone-300"
                  />

                  <p className="mt-4 text-sm font-medium text-stone-700">
                    No questions found
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-400">
                    Questions assigned to you will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredQuestions.map(
                    (question) => {
                      const selected =
                        selectedQuestion?._id ===
                        question._id;

                      return (
                        <button
                          key={question._id}
                          type="button"
                          onClick={() =>
                            handleSelectQuestion(
                              question
                            )
                          }
                          className={`w-full px-5 py-4 text-left transition ${
                            selected
                              ? "bg-[#d6b56d]/10"
                              : "hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-stone-800">
                                {question.student
                                  ?.name ||
                                  "Student"}
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
                                {
                                  question.question
                                }
                              </p>
                            </div>

                            <StatusBadge
                              status={
                                question.status
                              }
                            />
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[11px] text-stone-400">
                              {question.category}
                            </span>

                            <span className="text-[11px] text-stone-400">
                              {formatDate(
                                question.createdAt
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ===================================================
              QUESTION DETAIL
          =================================================== */}
          <section className="min-h-[600px] rounded-3xl border border-stone-200 bg-white shadow-sm">
            {!selectedQuestion ? (
              <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-[#967438]">
                  <MessageSquareText size={28} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-stone-900">
                  Select a question
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
                  Select a student question from the
                  list to review it and provide an
                  answer.
                </p>
              </div>
            ) : (
              <div>
                {/* Detail header */}
                <div className="border-b border-stone-100 px-6 py-5 sm:px-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <UserRound
                          size={16}
                          className="text-[#967438]"
                        />

                        <span className="text-sm font-semibold text-stone-800">
                          {selectedQuestion
                            .student?.name ||
                            "Student"}
                        </span>
                      </div>

                      {selectedQuestion
                        .student?.email && (
                        <p className="mt-1 text-xs text-stone-400">
                          {
                            selectedQuestion
                              .student.email
                          }
                        </p>
                      )}
                    </div>

                    <StatusBadge
                      status={
                        selectedQuestion.status
                      }
                    />
                  </div>
                </div>

                <div className="space-y-7 p-6 sm:p-8">
                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#967438]">
                      Category
                    </p>

                    <p className="mt-2 text-sm font-medium text-stone-800">
                      {selectedQuestion.category}
                    </p>
                  </div>

                  {/* Question */}
                  <div>
                    <div className="flex items-center gap-2">
                      <MessageSquareText
                        size={16}
                        className="text-[#967438]"
                      />

                      <h2 className="text-sm font-semibold text-stone-800">
                        Student's Question
                      </h2>
                    </div>

                    <div className="mt-3 rounded-2xl bg-stone-50 p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
                        {
                          selectedQuestion.question
                        }
                      </p>
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <label
                      htmlFor="answer"
                      className="mb-2 block text-sm font-semibold text-stone-800"
                    >
                      Your Answer
                    </label>

                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(event) =>
                        setAnswer(
                          event.target.value
                        )
                      }
                      disabled={
                        selectedQuestion.status ===
                        "Closed"
                      }
                      rows={9}
                      maxLength={10000}
                      placeholder="Write a clear and helpful answer for the student..."
                      className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm leading-7 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="mt-2 flex justify-end">
                      <span className="text-xs text-stone-400">
                        {answer.length}/10000
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedQuestion.status !==
                    "Closed" && (
                    <div className="flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Close Question
                      </button>

                      <button
                        type="button"
                        onClick={handleAnswer}
                        disabled={
                          submitting ||
                          !answer.trim()
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={16} />

                        {submitting
                          ? "Submitting..."
                          : "Submit Answer"}
                      </button>
                    </div>
                  )}

                  {/* Answered info */}
                  {selectedQuestion.status ===
                    "Answered" && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 text-emerald-600"
                        />

                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Answer submitted
                          </p>

                          <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                            The student can now see your
                            answer in their question
                            section.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Closed info */}
                  {selectedQuestion.status ===
                    "Closed" && (
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="flex items-start gap-3">
                        <XCircle
                          size={18}
                          className="mt-0.5 text-stone-500"
                        />

                        <div>
                          <p className="text-sm font-semibold text-stone-700">
                            Question closed
                          </p>

                          <p className="mt-1 text-xs leading-5 text-stone-500">
                            This question is no longer
                            accepting answers.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


/* =========================================================
   STAT CARD
========================================================= */
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d]/10 text-[#967438]">
          {icon}
        </div>

        <span className="text-2xl font-semibold text-stone-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>
    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */
function StatusBadge({
  status,
}: {
  status: QuestionStatus;
}) {
  if (status === "Answered") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 size={12} />
        Answered
      </span>
    );
  }

  if (status === "Closed") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
        <XCircle size={12} />
        Closed
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <Clock3 size={12} />
      Pending
    </span>
  );
}


/* =========================================================
   DATE FORMAT
========================================================= */
function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}