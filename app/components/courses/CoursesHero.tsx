import { BookOpen, Search } from "lucide-react";

type CoursesHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function CoursesHero({
  search,
  onSearchChange,
}: CoursesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top Right Rings */}
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -right-28 -top-28 h-[300px] w-[300px] rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -right-16 -top-16 h-[180px] w-[180px] rounded-full border border-[#d6b56d]/10" />

        {/* Bottom Left Ring */}
        <div className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full border border-white/5" />
        <div className="absolute -bottom-32 -left-24 h-[350px] w-[350px] rounded-full border border-white/[0.04]" />

        {/* Soft Gold Glow */}
        <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-[#d6b56d]/5 blur-3xl" />
      </div>

      {/* Islamic Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="courses-pattern"
              width="90"
              height="90"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M45 5 L85 45 L45 85 L5 45 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />

              <path
                d="M45 20 L70 45 L45 70 L20 45 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />

              <path
                d="M45 5V20M85 45H70M45 85V70M5 45H20"
                stroke="white"
                strokeWidth="1"
              />

              <circle
                cx="45"
                cy="45"
                r="5"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#courses-pattern)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left Content */}
          <div>
            {/* Label */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6b56d]/20 bg-[#d6b56d]/10 text-[#d6b56d]">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  Explore
                </p>

                <p className="text-sm font-medium text-[#d6b56d]">
                  IlmHub Courses
                </p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn.
              <span className="text-[#d6b56d]"> Understand.</span>
              <br />
              Practice.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Explore structured courses in Quran, Hadith, Arabic,
              Fiqh, Seerah and Islamic Studies — designed to help
              you learn with understanding and practice with purpose.
            </p>

            {/* Search */}
            <div className="mt-9 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    onSearchChange(e.target.value)
                  }
                  placeholder="Search courses, subjects or instructors..."
                  className="w-full rounded-2xl border border-stone-700 bg-stone-900/80 py-4 pl-13 pr-5 text-sm text-white outline-none backdrop-blur-sm transition placeholder:text-stone-500 focus:border-[#d6b56d]/60 focus:ring-2 focus:ring-[#d6b56d]/10"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-9 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">
                  6+
                </p>
                <p className="text-xs text-stone-400">
                  Categories
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">
                  100+
                </p>
                <p className="text-xs text-stone-400">
                  Lessons
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <p className="text-xl font-semibold text-white">
                  All
                </p>
                <p className="text-xs text-stone-400">
                  Learning Levels
                </p>
              </div>
            </div>
          </div>

          {/* Right Featured Course */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-[#d6b56d]/5 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
              {/* Decorative Top */}
              <div className="mb-7 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-[#d6b56d]/40" />

                <span className="text-[#d6b56d]">✦</span>

                <div className="h-px w-12 bg-[#d6b56d]/40" />
              </div>

              {/* Small Label */}
              <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-stone-500">
                Begin Your Journey
              </p>

              {/* Main Text */}
              <h2 className="mt-5 text-center text-3xl font-semibold leading-tight text-white">
                Knowledge is a
                <span className="block text-[#d6b56d]">
                  Journey.
                </span>
              </h2>

              {/* Arabic */}
              <p
                dir="rtl"
                lang="ar"
                translate="no"
                className="mt-8 text-center font-serif text-3xl leading-[2] text-[#f5e7c1] sm:text-4xl"
              >
                وَقُلْ رَبِّ زِدْنِي عِلْمًا
              </p>

              {/* Translation */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-center text-sm italic leading-7 text-stone-400">
                  And say, “My Lord, increase me in knowledge.”
                </p>
              </div>

              {/* Reference */}
              <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#d6b56d]/70">
                Surah Taha • 20:114
              </p>

              {/* Bottom Ornament */}
              <div className="mt-7 flex items-center justify-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#d6b56d]/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
                <span className="h-1 w-1 rounded-full bg-[#d6b56d]/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#d6b56d]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
            <span className="h-1 w-1 rounded-full bg-[#d6b56d]" />
          </div>

          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>
    </section>
  );
}

