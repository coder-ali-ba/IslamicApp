import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Users,
} from "lucide-react";

import type { IslamicClass } from "@/app/src/lib/classes";

type ClassCardProps = {
  item: IslamicClass;
};

export default function ClassCard({
  item,
}: ClassCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-stone-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {item.category}
          </span>
        </div>

        {/* Status */}
        <div className="absolute right-4 top-4">
          <span className="rounded-full border border-[#d6b56d]/30 bg-stone-950/70 px-3 py-1.5 text-xs font-medium text-[#f5e7c1] backdrop-blur-sm">
            {item.status}
          </span>
        </div>

        {/* Level */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs text-stone-200">
            {item.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-stone-900">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
          {item.description}
        </p>

        {/* Instructor */}
        <div className="mt-5">
          <p className="text-xs text-stone-400">
            Instructor
          </p>

          <p className="mt-1 text-sm font-medium text-stone-800">
            {item.instructor}
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CalendarDays
              size={15}
              className="text-[#967438]"
            />

            <span>{item.date}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Clock3
              size={15}
              className="text-[#967438]"
            />

            <span>
              {item.time} • {item.duration}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Users
              size={15}
              className="text-[#967438]"
            />

            <span>
              {item.students}/{item.maxStudents} seats filled
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400">
              Class Fee
            </p>

            <p className="mt-1 text-lg font-semibold text-[#967438]">
              Rs. {item.price.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/classes/${item.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            View Class
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}