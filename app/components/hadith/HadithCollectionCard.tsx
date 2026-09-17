import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

type HadithCollectionCardProps = {
  name: string;
  arabicName: string;
  description: string;
  hadithCount: string;
  slug: string;
};

export default function HadithCollectionCard({
  name,
  arabicName,
  description,
  hadithCount,
  slug,
}: HadithCollectionCardProps) {
  return (
    <Link
      href={`/hadith/${slug}`}
      className="group block"
    >
      <article className="relative h-full overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b56d]/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
        {/* Decorative Circle */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#d6b56d]/10 bg-[#faf7ef]" />

        {/* Icon */}
        <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf7ef] text-[#967438]">
          <BookOpen size={22} strokeWidth={1.7} />
        </div>

        {/* Arabic Name */}
        <p
          dir="rtl"
          lang="ar"
          translate="no"
          className="relative font-serif text-2xl text-stone-800"
        >
          {arabicName}
        </p>

        {/* English Name */}
        <h3 className="relative mt-3 text-xl font-semibold text-stone-900">
          {name}
        </h3>

        {/* Description */}
        <p className="relative mt-3 text-sm leading-6 text-stone-500">
          {description}
        </p>

        {/* Footer */}
        <div className="relative mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
            {hadithCount} Hadith
          </span>

          <span className="flex items-center gap-1.5 text-sm font-medium text-[#967438] transition group-hover:gap-2.5">
            Explore
            <ArrowRight size={16} />
          </span>
        </div>
      </article>
    </Link>
  );
}