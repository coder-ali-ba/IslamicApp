"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../src/lib/api";

type Course = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  students?: number;
  price?: number;
  image?: string;
  featured?: boolean;
  status?: string;
  instructor?: {
    name?: string;
  };
};

type Enrollment = {
  _id: string;
  course?: Course | string;
  status: "pending" | "active" | "cancelled" | "expired";
  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "not_required";
  amount?: number;
  currency?: string;
  transactionId?: string;
};

const categories = [
  "All",
  "Quran",
  "Hadith",
  "Arabic",
  "Fiqh",
  "Seerah",
  "Islamic Studies",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
}

function getCourseId(course: Course | string | undefined): string {
  if (!course) return "";
  return typeof course === "string" ? course : course._id;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        api.get("/courses", { withCredentials: true }),
        api
          .get("/enrollments/my", { withCredentials: true })
          .catch(() => null),
      ]);

      const coursesData = coursesResponse.data;
      const enrollmentData = enrollmentsResponse?.data;

      const courseList = Array.isArray(coursesData)
        ? coursesData
        : coursesData?.courses ||
          coursesData?.data ||
          coursesData?.data?.courses ||
          [];

      const enrollmentList = Array.isArray(enrollmentData)
        ? enrollmentData
        : enrollmentData?.enrollments ||
          enrollmentData?.data ||
          enrollmentData?.data?.enrollments ||
          [];

      setCourses(
        courseList.filter(
          (course: Course) =>
            !course.status || course.status === "Published"
        )
      );

      setEnrollments(enrollmentList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        (course.description || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (course.instructor?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, selectedCategory, selectedLevel]);

  const getEnrollment = (courseId: string) => {
    return enrollments.find(
      (enrollment) => getCourseId(enrollment.course) === courseId
    );
  };

  const handleEnroll = async (course: Course) => {
    setMessage("");
    setError("");
    setEnrollingId(course._id);

    try {
      const response = await api.post(
        `/enrollments/course/${course._id}`,
        {},
        { withCredentials: true }
      );

      const data = response.data;
      const newEnrollment: Enrollment =
        data?.enrollment || data?.data?.enrollment || data?.data || data;

      if (newEnrollment?._id) {
        setEnrollments((previous) => [
          ...previous.filter((item) => item._id !== newEnrollment._id),
          newEnrollment,
        ]);
      } else {
        await loadCourses();
      }

      if (
        newEnrollment?.status === "active" ||
        newEnrollment?.paymentStatus === "not_required"
      ) {
        setMessage(
          `You have successfully enrolled in "${course.title}".`
        );
      } else if (newEnrollment?.status === "pending") {
        setMessage(
          `Your enrollment for "${course.title}" is pending admin approval.`
        );
      } else {
        setMessage(
          data?.message || "Your enrollment request has been submitted."
        );
      }

      await loadCourses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setEnrollingId(null);
    }
  };

  const formatPrice = (price = 0) => {
    if (price === 0) return "Free";

    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getButtonDetails = (course: Course) => {
    const enrollment = getEnrollment(course._id);

    if (!enrollment) {
      return {
        label: course.price && course.price > 0
          ? "Enroll & Pay"
          : "Enroll for Free",
        disabled: false,
        className: "bg-[#D99B33] text-[#0B1930] hover:bg-[#e9ad4b]",
      };
    }

    if (enrollment.status === "active") {
      return {
        label: "Already Enrolled",
        disabled: true,
        className: "bg-emerald-100 text-emerald-800 cursor-not-allowed",
      };
    }

    if (enrollment.status === "pending") {
      return {
        label: "Awaiting Approval",
        disabled: true,
        className: "bg-amber-100 text-amber-800 cursor-not-allowed",
      };
    }

    if (enrollment.status === "expired") {
      return {
        label: "Renew Enrollment",
        disabled: false,
        className: "bg-[#D99B33] text-[#0B1930] hover:bg-[#e9ad4b]",
      };
    }

    return {
      label: "Enroll Again",
      disabled: false,
      className: "bg-[#D99B33] text-[#0B1930] hover:bg-[#e9ad4b]",
    };
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1930] px-5 py-16 text-white md:py-24">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D99B33]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-[#D99B33]/40 bg-[#D99B33]/10 px-4 py-2 text-sm font-semibold text-[#F0BB62]">
              ILMHUB · ONLINE ISLAMIC LEARNING
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Learn Islam with
              <span className="block text-[#D99B33]">
                Knowledge & Understanding
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Explore our Islamic courses, learn from qualified instructors,
              and strengthen your understanding of the Quran, Hadith, Fiqh,
              Arabic, and Islamic studies.
            </p>

            <a
              href="#courses"
              className="mt-8 inline-flex items-center rounded-lg bg-[#D99B33] px-7 py-3.5 font-bold text-[#0B1930] transition hover:bg-[#e9ad4b]"
            >
              Explore Courses
              <span className="ml-2">↓</span>
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-[#D99B33]">
                {courses.length}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Available Courses
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-[#D99B33]">
                {categories.length - 1}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Study Categories
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-5 md:col-span-1">
              <p className="text-3xl font-extrabold text-[#D99B33]">
                Online
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Learn at Your Pace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-[#B77D1D]">
                Start Learning
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-[#0B1930] md:text-4xl">
                Explore Our Courses
              </h2>

              <p className="mt-3 text-slate-600">
                Find a course that matches your interests and learning goals.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
            >
              <span className="text-lg">✓</span>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              <p>{error}</p>

              <button
                onClick={() => setError("")}
                className="font-bold"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label
                  htmlFor="course-search"
                  className="mb-2 block text-sm font-semibold text-[#0B1930]"
                >
                  Search Courses
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ⌕
                  </span>

                  <input
                    id="course-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title or instructor..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 outline-none transition focus:border-[#D99B33] focus:ring-2 focus:ring-[#D99B33]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="course-category"
                  className="mb-2 block text-sm font-semibold text-[#0B1930]"
                >
                  Category
                </label>

                <select
                  id="course-category"
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#D99B33] focus:ring-2 focus:ring-[#D99B33]/20"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="course-level"
                  className="mb-2 block text-sm font-semibold text-[#0B1930]"
                >
                  Difficulty Level
                </label>

                <select
                  id="course-level"
                  value={selectedLevel}
                  onChange={(event) => setSelectedLevel(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#D99B33] focus:ring-2 focus:ring-[#D99B33]/20"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "All" ? "All Levels" : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(search ||
              selectedCategory !== "All" ||
              selectedLevel !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                className="mt-4 text-sm font-semibold text-[#A66E13] hover:underline"
              >
                Clear all filters ×
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-48 bg-slate-200" />
                  <div className="space-y-4 p-5">
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 rounded bg-slate-200" />
                    <div className="h-10 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Course Cards */}
          {!loading && filteredCourses.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollment(course._id);
                const button = getButtonDetails(course);

                return (
                  <article
                    key={course._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Course Image */}
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0B1930] to-[#28466C]">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-6xl text-[#D99B33]">
                            ☪
                          </span>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {course.category && (
                          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0B1930]">
                            {course.category}
                          </span>
                        )}

                        {course.featured && (
                          <span className="rounded-full bg-[#D99B33] px-3 py-1 text-xs font-bold text-[#0B1930]">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-4 right-4 rounded-lg bg-[#0B1930]/90 px-3 py-2 text-sm font-bold text-[#D99B33]">
                        {formatPrice(course.price)}
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {course.level && (
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {course.level}
                          </span>
                        )}

                        {course.duration && (
                          <span className="text-xs text-slate-500">
                            ◷ {course.duration}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold leading-snug text-[#0B1930] transition group-hover:text-[#A66E13]">
                        {course.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Explore this course and develop your Islamic knowledge with IlmHub."}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Instructor
                          </p>
                          <p className="mt-1 font-semibold text-[#0B1930]">
                            {course.instructor?.name || "IlmHub Instructor"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            Students
                          </p>
                          <p className="mt-1 font-semibold text-[#0B1930]">
                            {course.students ?? 0}
                          </p>
                        </div>
                      </div>

                      {/* Enrollment Status */}
                      {enrollment && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Enrollment Status
                          </p>

                          <p
                            className={`mt-1 text-sm font-bold ${
                              enrollment.status === "active"
                                ? "text-emerald-700"
                                : enrollment.status === "pending"
                                  ? "text-amber-700"
                                  : "text-slate-700"
                            }`}
                          >
                            {enrollment.status === "active"
                              ? "Active Enrollment"
                              : enrollment.status === "pending"
                                ? "Pending Admin Approval"
                                : enrollment.status === "expired"
                                  ? "Enrollment Expired"
                                  : "Cancelled"}
                          </p>

                          {enrollment.transactionId && (
                            <p className="mt-1 break-all text-xs text-slate-500">
                              Transaction: {enrollment.transactionId}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Enrollment Button */}
                      <button
                        type="button"
                        onClick={() => handleEnroll(course)}
                        disabled={button.disabled || enrollingId === course._id}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold transition disabled:cursor-not-allowed ${button.className}`}
                      >
                        {enrollingId === course._id ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          button.label
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="text-5xl text-[#D99B33]">⌕</div>

              <h3 className="mt-4 text-xl font-bold text-[#0B1930]">
                No Courses Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-500">
                We could not find any courses matching your search. Try
                another category or clear your filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                className="mt-6 rounded-lg bg-[#0B1930] px-6 py-3 font-semibold text-white transition hover:bg-[#132A4C]"
              >
                Show All Courses
              </button>
            </div>
          )}

          {/* Refresh */}
          {!loading && (
            <div className="mt-10 text-center">
              <button
                onClick={loadCourses}
                className="rounded-lg border border-[#132A4C] px-6 py-3 font-semibold text-[#132A4C] transition hover:bg-[#132A4C] hover:text-white"
              >
                ↻ Refresh Courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0B1930] px-6 py-12 text-center text-white md:px-12 md:py-16">
          <span className="text-4xl text-[#D99B33]">☪</span>

          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Begin Your Islamic Learning Journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Choose a course, submit your enrollment request, and start building
            your knowledge through IlmHub.
          </p>

          <a
            href="#courses"
            className="mt-7 inline-flex rounded-lg bg-[#D99B33] px-7 py-3.5 font-bold text-[#0B1930] transition hover:bg-[#e9ad4b]"
          >
            Browse Courses
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-lg font-extrabold text-[#0B1930]">
            Ilm<span className="text-[#D99B33]">Hub</span>
          </p>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} IlmHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}