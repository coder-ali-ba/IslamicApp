import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import { Teacher } from "@/app/src/lib/teachers";

type TeacherCardProps = {
  teacher: Teacher;
};

export default function TeacherCard({
  teacher,
}: TeacherCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-stone-100">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />

        {teacher.featured && (
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-stone-900/80 px-3 py-1.5 text-xs font-semibold text-[#e4c98d] backdrop-blur-sm">
            Featured Teacher
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#967438]">
          {teacher.experience} Experience
        </p>

        <h3 className="mt-2 text-xl font-semibold text-stone-900">
          {teacher.name}
        </h3>

        <p className="mt-1 text-sm font-medium text-stone-500">
          {teacher.title}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">
          {teacher.bio}
        </p>

        {/* Qualification */}
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-stone-50 p-3">
          <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

          <div>
            <p className="text-xs text-stone-400">
              Qualification
            </p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              {teacher.qualification}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-stone-200 border-y border-stone-100 py-4">
          <div className="text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-stone-400" />
            <p className="text-sm font-semibold text-stone-800">
              {teacher.students.toLocaleString()}+
            </p>
            <p className="text-[11px] text-stone-400">
              Students
            </p>
          </div>

          <div className="text-center">
            <BookOpen className="mx-auto mb-1 h-4 w-4 text-stone-400" />
            <p className="text-sm font-semibold text-stone-800">
              {teacher.courses}
            </p>
            <p className="text-[11px] text-stone-400">
              Courses
            </p>
          </div>

          <div className="text-center">
            <GraduationCap className="mx-auto mb-1 h-4 w-4 text-stone-400" />
            <p className="text-sm font-semibold text-stone-800">
              {teacher.classes}
            </p>
            <p className="text-[11px] text-stone-400">
              Classes
            </p>
          </div>
        </div>

        {/* Button */}
        <Link
          href={`/teachers/${teacher.id}`}
          className="group/button mt-5 flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          View Teacher Profile

          <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}