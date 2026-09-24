"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit,
  GraduationCap,
  Layers3,
  Loader2,
  Plus,
  Users,
  Video,
  XCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Instructor = {
  _id: string;
  name: string;
  email: string;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: Instructor;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  image?: string;
  featured?: boolean;
  status: "Draft" | "Published";
};

type Lesson = {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  status: "Draft" | "Published";
};

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, lessonsResponse] = await Promise.all([
          fetch(`${API_URL}/courses/teacher/my/${courseId}`, {
            credentials: "include",
          }),

          fetch(`${API_URL}/lessons/course/${courseId}`, {
            credentials: "include",
          }),
        ]);

        const courseData = await courseResponse.json();

        if (!courseResponse.ok) {
          throw new Error(
            courseData.message || "Unable to load course"
          );
        }

        const lessonsData = await lessonsResponse.json();

        if (!lessonsResponse.ok) {
          throw new Error(
            lessonsData.message || "Unable to load lessons"
          );
        }

        setCourse(courseData.course);
        setLessons(lessonsData.lessons || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 size={22} className="animate-spin" />
          Loading course...
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-stone-900">
            Unable to Open Course
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            {error || "Course not found."}
          </p>

          <Link
            href="/teacher/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
          >
            <ArrowLeft size={16} />
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Back */}
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft size={17} />
        Back to My Courses
      </Link>

      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                {course.category}
              </span>

              <span className="rounded-full bg-[#f5ead0] px-3 py-1 text-xs font-medium text-[#80652c]">
                {course.level}
              </span>

              {course.status === "Published" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={13} />
                  Published
                </span>
              ) : (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                  Draft
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              {course.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              {course.description}
            </p>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/teacher/courses/${course._id}/lessons/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
              >
                <Plus size={16} />
                Add Lesson
              </Link>

              <Link
                href={`/teacher/courses/${course._id}/lessons`}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                <Layers3 size={16} />
                Manage Lessons
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="min-h-[220px] bg-stone-100">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center">
                <BookOpen size={48} className="text-stone-300" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Layers3 size={20} />}
          label="Lessons"
          value={course.lessons}
        />

        <StatCard
          icon={<Users size={20} />}
          label="Students"
          value={course.students}
        />

        <StatCard
          icon={<Clock3 size={20} />}
          label="Duration"
          value={course.duration || "—"}
        />

        <StatCard
          icon={<BookOpen size={20} />}
          label="Price"
          value={
            course.price === 0
              ? "Free"
              : `Rs. ${course.price.toLocaleString()}`
          }
        />
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Lessons */}
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Lessons
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Manage lessons for this course.
              </p>
            </div>

            <Link
              href={`/teacher/courses/${course._id}/lessons`}
              className="text-sm font-medium text-[#80652c] hover:underline"
            >
              View all
            </Link>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-12 text-center">
              <Layers3
                size={34}
                className="mx-auto text-stone-300"
              />

              <h3 className="mt-4 font-medium text-stone-800">
                No published lessons
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Add a lesson to start building this course.
              </p>

              <Link
                href={`/teacher/courses/${course._id}/lessons/new`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
              >
                <Plus size={16} />
                Add Lesson
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5ead0] text-sm font-semibold text-[#80652c]">
                      {lesson.order}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-stone-900">
                        {lesson.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-stone-500">
                        {lesson.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} />
                            {lesson.duration}
                          </span>
                        )}

                        {lesson.videoUrl && (
                          <span className="inline-flex items-center gap-1">
                            <Video size={13} />
                            Video
                          </span>
                        )}

                        <span
                          className={
                            lesson.status === "Published"
                              ? "text-emerald-600"
                              : "text-stone-500"
                          }
                        >
                          {lesson.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/teacher/courses/${course._id}/lessons/${lesson._id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <Edit size={15} />
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Course Info */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">
              Course Information
            </h2>

            <div className="mt-5 space-y-4">
              <InfoRow
                label="Category"
                value={course.category}
              />

              <InfoRow
                label="Level"
                value={course.level}
              />

              <InfoRow
                label="Status"
                value={course.status}
              />

              <InfoRow
                label="Duration"
                value={course.duration || "Not specified"}
              />

              <InfoRow
                label="Students"
                value={String(course.students)}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">
              Instructor
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5ead0] text-[#80652c]">
                <GraduationCap size={21} />
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">
                  {course.instructor?.name}
                </p>

                <p className="truncate text-xs text-stone-500">
                  {course.instructor?.email}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5ead0] text-[#80652c]">
          {icon}
        </div>

        <div>
          <p className="text-xs text-stone-400">{label}</p>
          <p className="mt-1 font-semibold text-stone-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-stone-500">{label}</span>

      <span className="text-right text-sm font-medium text-stone-800">
        {value}
      </span>
    </div>
  );
}