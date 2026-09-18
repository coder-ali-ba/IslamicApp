import Link from "next/link";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import type { Fatwa } from "@/app/src/lib/fatwa";

type FatwaCardProps = {
  fatwa: Fatwa;
};

export default function FatwaCard({ fatwa }: FatwaCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5">
      {/* Category */}
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full border border-[#d6b56d]/30 bg-[#d6b56d]/10 px-3 py-1.5 text-xs font-semibold text-[#967438]">
          {fatwa.category}
        </span>

        {fatwa.featured && (
          <span className="text-xs font-medium text-[#967438]">
            Featured
          </span>
        )}
      </div>

      {/* Question */}
      <h3 className="mt-5 text-lg font-semibold leading-7 text-stone-900 transition-colors group-hover:text-stone-700">
        {fatwa.question}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-500">
        {fatwa.shortAnswer}
      </p>

      {/* Meta */}
      <div className="mt-6 space-y-2 border-t border-stone-100 pt-5">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <UserRound size={14} className="text-[#b8944f]" />
          <span>{fatwa.scholar}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <CalendarDays size={14} className="text-[#b8944f]" />
          <span>{fatwa.date}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <span className="text-xs text-stone-400">
          Ref: {fatwa.reference}
        </span>

        <Link
          href={`/fatwa/${fatwa.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 transition-colors hover:text-[#967438]"
        >
          Read
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}