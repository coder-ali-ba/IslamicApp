"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

type CourseInfo = {
  _id: string;
  title?: string;
  category?: string;
  level?: string;
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  duration?: string | number;
  order?: number;
  course?: CourseInfo | string;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isSliding, setIsSliding] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentIndex = lessons.findIndex((item) => item._id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const loadLessonData = useCallback(async () => {
    if (!courseId || !lessonId) return;

    setIsLoading(true);
    setError("");

    try {
      const headers = {
        ...getAuthHeaders(),
      };

      const [lessonResponse, lessonsResponse] = await Promise.all([
        fetch(`${API_URL}/lessons/${lessonId}`, {
          method: "GET",
          headers,
          credentials: "include",
          cache: "no-store",
        }),

        fetch(`${API_URL}/lessons/course/${courseId}`, {
          method: "GET",
          headers,
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const lessonData = await lessonResponse.json().catch(() => ({}));
      const lessonsData = await lessonsResponse.json().catch(() => ({}));

      if (!lessonResponse.ok) {
        throw new Error(lessonData.message || "Lesson load nahi ho saka.");
      }

      if (!lessonsResponse.ok) {
        throw new Error(lessonsData.message || "Lessons list load nahi hui.");
      }

      setLesson(lessonData.lesson);
      setLessons(
        (lessonsData.lessons || []).sort(
          (a: Lesson, b: Lesson) => (a.order || 0) - (b.order || 0)
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    loadLessonData();
  }, [loadLessonData]);

  const goToLesson = useCallback(
    (targetLesson: Lesson, slideDirection: "left" | "right") => {
      if (isSliding || targetLesson._id === lessonId) return;

      setDirection(slideDirection);
      setIsSliding(true);

      // Slide transition ke baad next/previous lesson page open hoga.
      window.setTimeout(() => {
        router.push(
          `/courses/${courseId}/lessons/${targetLesson._id}`
        );
      }, 180);
    },
    [courseId, isSliding, lessonId, router]
  );

  const goNext = useCallback(() => {
    if (nextLesson) goToLesson(nextLesson, "left");
  }, [goToLesson, nextLesson]);

  const goPrevious = useCallback(() => {
    if (previousLesson) goToLesson(previousLesson, "right");
  }, [goToLesson, previousLesson]);

  // Keyboard navigation: left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goNext();
      } else if (event.key === "ArrowLeft") {
        goPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  // Mobile swipe navigation
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    // Vertical scrolling ko swipe navigation na samjhein.
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const courseInfo =
    lesson?.course && typeof lesson.course !== "string"
      ? lesson.course
      : null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-8 h-12 w-2/3 rounded bg-slate-200" />
          <div className="mt-6 h-96 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#132A4C]">
            Lesson load nahi ho saka
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {error || "Lesson available nahi hai."}
          </p>
          <button
            onClick={loadLessonData}
            className="mt-6 rounded-lg bg-[#132A4C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B1930]"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="text-sm font-semibold text-[#132A4C] hover:text-[#D99B33]"
          >
            ← Back to Course
          </button>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              {courseInfo?.title || "Course Lessons"}
            </p>
            <p className="text-sm font-semibold text-[#132A4C]">
              Lesson {currentIndex >= 0 ? currentIndex + 1 : "—"} of{" "}
              {lessons.length}
            </p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-200">
        <div
          className="h-full bg-[#D99B33] transition-all duration-300"
          style={{
            width:
              currentIndex >= 0 && lessons.length > 0
                ? `${((currentIndex + 1) / lessons.length) * 100}%`
                : "0%",
          }}
        />
      </div>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Lesson heading */}
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {courseInfo?.category && (
              <span className="rounded-full bg-[#132A4C]/10 px-3 py-1 text-xs font-semibold text-[#132A4C]">
                {courseInfo.category}
              </span>
            )}

            {lesson.duration && (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600">
                {lesson.duration}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold leading-tight text-[#132A4C] sm:text-4xl">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Lesson content with swipe support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`min-h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 ${
            isSliding
              ? direction === "left"
                ? "-translate-x-8 opacity-0"
                : "translate-x-8 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <div className="min-h-[380px] p-5 sm:p-8 lg:p-10">
            {lesson.content ? (
              <div className="whitespace-pre-wrap break-words text-base leading-8 text-slate-700">
                {lesson.content}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-center">
                <p className="text-slate-500">
                  Is lesson ka content abhi available nahi hai.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            onClick={goPrevious}
            disabled={!previousLesson || isSliding}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-[#132A4C] transition hover:border-[#D99B33] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
          >
            <span className="text-lg">←</span>
            <span>Previous Lesson</span>
          </button>

          <span className="hidden text-sm text-slate-500 sm:block">
            Use ← → keys or swipe
          </span>

          <button
            onClick={goNext}
            disabled={!nextLesson || isSliding}
            className="flex items-center gap-2 rounded-xl bg-[#132A4C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0B1930] disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
          >
            <span>Next Lesson</span>
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* Lesson list */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-[#132A4C]">
            All Lessons
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {lessons.map((item, index) => {
              const active = item._id === lessonId;

              return (
                <button
                  key={item._id}
                  onClick={() =>
                    goToLesson(
                      item,
                      index > currentIndex ? "left" : "right"
                    )
                  }
                  disabled={active || isSliding}
                  className={`flex w-full items-center gap-4 border-b border-slate-100 p-4 text-left last:border-b-0 ${
                    active
                      ? "bg-amber-50"
                      : "transition hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? "bg-[#D99B33] text-[#0B1930]"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span
                    className={`flex-1 text-sm font-semibold ${
                      active ? "text-[#132A4C]" : "text-slate-600"
                    }`}
                  >
                    {item.title}
                  </span>

                  {active && (
                    <span className="text-xs font-bold text-[#D99B33]">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}