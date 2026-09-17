import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Users,
} from "lucide-react";
import type { Course } from "@/app/src/lib/course";

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({
  course,
}: CourseCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-stone-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {course.category}
        </span>

        {/* Level */}
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-700">
          {course.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="line-clamp-2 text-xl font-semibold text-stone-900">
          {course.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
          {course.description}
        </p>

        {/* Instructor */}
        <p className="mt-5 text-sm font-medium text-stone-700">
          {course.instructor}
        </p>

        {/* Stats */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-100 pt-5 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" />
            {course.duration}
          </span>

          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {course.lessons} lessons
          </span>

          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {course.students.toLocaleString()}
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400">
              Course Fee
            </p>

            <p className="mt-1 text-lg font-semibold text-[#967438]">
              Rs. {course.price.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            View Course
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

