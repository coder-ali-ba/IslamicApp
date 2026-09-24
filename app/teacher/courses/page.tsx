"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Clock3,
  GraduationCap,
  Layers3,
  Loader2,
  Users,
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

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/courses/teacher/my`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch courses");
        }

        setCourses(data.courses || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="animate-spin" size={22} />
          Loading your courses...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#967438]">
          Teaching
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          My Courses
        </h1>

        <p className="mt-2 text-sm text-stone-500">
          Manage the courses assigned to you and their lessons.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && courses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-stone-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ead0] text-[#80652c]">
            <BookOpen size={25} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-stone-900">
            No courses assigned
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
            You don't have any courses assigned to you yet.
            Courses assigned by the admin will appear here.
          </p>
        </div>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={`/teacher/courses/${course._id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-stone-300 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen
                      size={42}
                      className="text-stone-300"
                    />
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm">
                    {course.category}
                  </span>
                </div>

                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                      course.status === "Published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-semibold text-stone-900 transition group-hover:text-[#80652c]">
                      {course.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-1 shrink-0 text-stone-300 transition group-hover:text-[#967438]">
                    <ChevronRight size={20} />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-stone-100 pt-4">
                  <CourseStat
                    icon={<Layers3 size={14} />}
                    value={course.lessons}
                    label="Lessons"
                  />

                  <CourseStat
                    icon={<Users size={14} />}
                    value={course.students}
                    label="Students"
                  />

                  <CourseStat
                    icon={<Clock3 size={14} />}
                    value={course.duration || "—"}
                    label="Duration"
                  />
                </div>

                {/* Level */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
                    <GraduationCap size={14} />
                    {course.level}
                  </span>

                  <span className="text-xs font-medium text-[#80652c]">
                    Manage Course
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-stone-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-1 text-sm font-semibold text-stone-800">
        {value}
      </p>
    </div>
  );
}