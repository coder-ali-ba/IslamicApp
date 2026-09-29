"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Users,
  Video,
} from "lucide-react";

type ClassCardItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
  students: number;
  maxStudents: number;
  seatsRemaining: number;
  meetingUrl?: string;
  featured?: boolean;
  isEnrolled?: boolean;
  enrollmentStatus?: "Registered" | "Attended" | "Cancelled" | null;
};

type ClassCardProps = {
  item: ClassCardItem;
};

export default function ClassCard({ item }: ClassCardProps) {
  const isFull = item.seatsRemaining <= 0;
  const isEnrolled = item.isEnrolled === true;
  const isLive = item.status === "Live";
  const isCompleted = item.status === "Completed";
  const isCancelled = item.status === "Cancelled";

  const getButtonContent = () => {
    if (isCancelled) {
      return (
        <>
          Cancelled
          <ArrowRight size={16} />
        </>
      );
    }

    if (isCompleted) {
      return (
        <>
          View Class
          <ArrowRight size={16} />
        </>
      );
    }

    if (isLive && isEnrolled && item.meetingUrl) {
      return (
        <>
          <Video size={16} />
          Join Class
        </>
      );
    }

    if (isEnrolled) {
      return (
        <>
          Enrolled
          <ArrowRight size={16} />
        </>
      );
    }

    if (isFull) {
      return (
        <>
          Class Full
          <ArrowRight size={16} />
        </>
      );
    }

    return (
      <>
        View Class
        <ArrowRight size={16} />
      </>
    );
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5">
      {/* Image / Visual Header */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-stone-800 via-stone-900 to-[#967438]">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/30" />
          <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full border border-white/20" />
        </div>

        <div className="relative z-10 px-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <CalendarDays
              size={26}
              className="text-[#f5e7c1]"
            />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-300">
            IlmHub Class
          </p>

          <p className="mt-1 line-clamp-2 text-lg font-semibold text-white">
            {item.title}
          </p>
        </div>

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-stone-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {item.category}
          </span>
        </div>

        {/* Status */}
        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${
              isLive
                ? "border-emerald-300/30 bg-emerald-950/70 text-emerald-200"
                : isCancelled
                  ? "border-red-300/30 bg-red-950/70 text-red-200"
                  : isCompleted
                    ? "border-stone-300/30 bg-stone-950/70 text-stone-300"
                    : "border-[#d6b56d]/30 bg-stone-950/70 text-[#f5e7c1]"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Level */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs text-stone-200">
            {item.level}
          </span>
        </div>

        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute bottom-4 right-4">
            <span className="rounded-full border border-emerald-300/30 bg-emerald-950/80 px-3 py-1.5 text-xs font-medium text-emerald-200 backdrop-blur-sm">
              Enrolled
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-stone-900">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
          {item.description || "Islamic learning session on IlmHub."}
        </p>

        {/* Instructor */}
        <div className="mt-5">
          <p className="text-xs text-stone-400">
            Instructor
          </p>

          <p className="mt-1 text-sm font-medium text-stone-800">
            {item.instructor || "Scholar"}
          </p>
        </div>

        {/* Schedule */}
        <div className="mt-5 space-y-2.5 border-t border-stone-100 pt-5">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CalendarDays
              size={15}
              className="shrink-0 text-[#967438]"
            />

            <span>{item.date}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Clock3
              size={15}
              className="shrink-0 text-[#967438]"
            />

            <span>
              {item.time} • {item.duration}
            </span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Users
              size={15}
              className="shrink-0 text-[#967438]"
            />

            <span>
              {item.students}/{item.maxStudents} seats filled
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-4">
          {/* Seats */}
          <div>
            <p className="text-xs text-stone-400">
              {isFull ? "Availability" : "Seats Available"}
            </p>

            <p
              className={`mt-1 text-lg font-semibold ${
                isFull
                  ? "text-red-600"
                  : isEnrolled
                    ? "text-emerald-600"
                    : "text-[#967438]"
              }`}
            >
              {isFull
                ? "Full"
                : isEnrolled
                  ? "Enrolled"
                  : item.seatsRemaining}
            </p>
          </div>

          {/* Action */}
          <Link
            href={`/classes/${item.id}`}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isCancelled
                ? "pointer-events-none bg-stone-200 text-stone-500"
                : isFull && !isEnrolled
                  ? "bg-stone-200 text-stone-600"
                  : isLive && isEnrolled && item.meetingUrl
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : isEnrolled
                      ? "bg-[#967438] text-white hover:bg-[#80612e]"
                      : "bg-stone-900 text-white hover:bg-stone-800"
            }`}
          >
            {getButtonContent()}
          </Link>
        </div>
      </div>
    </article>
  );
}