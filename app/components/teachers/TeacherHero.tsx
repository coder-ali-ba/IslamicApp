"use client";

import { Search, Sparkles, Users, BookOpen, GraduationCap } from "lucide-react";

type TeachersHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function TeachersHero({
  search,
  onSearchChange,
}: TeachersHeroProps) {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Decorative circles */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full border border-[#d6b56d]/10" />
      <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full border border-[#d6b56d]/10" />

      <div className="absolute -right-40 bottom-[-160px] h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />
      <div className="absolute -right-28 bottom-[-148px] h-[330px] w-[330px] rounded-full border border-[#d6b56d]/10" />

      {/* Islamic pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
            linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d)
          `,
          backgroundSize: "70px 120px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e4c98d]">
              <GraduationCap className="h-4 w-4" />
              Learn From Knowledgeable Teachers
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn From Those
              <span className="block text-[#d6b56d]">
                Who Teach With Purpose.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Explore our teachers and find knowledgeable instructors for
              Quran, Tajweed, Hadith, Arabic, Fiqh, and Islamic Studies.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-sm">
                <Search className="ml-3 h-5 w-5 shrink-0 text-stone-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search teachers or subjects..."
                  className="h-12 w-full bg-transparent px-1 text-sm text-white outline-none placeholder:text-stone-500"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <GraduationCap className="mb-3 h-5 w-5 text-[#d6b56d]" />
                <p className="text-xl font-semibold">6+</p>
                <p className="mt-1 text-xs text-stone-400">
                  Teachers
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Users className="mb-3 h-5 w-5 text-[#d6b56d]" />
                <p className="text-xl font-semibold">7K+</p>
                <p className="mt-1 text-xs text-stone-400">
                  Students
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <BookOpen className="mb-3 h-5 w-5 text-[#d6b56d]" />
                <p className="text-xl font-semibold">10+</p>
                <p className="mt-1 text-xs text-stone-400">
                  Courses
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-5 rounded-[2rem] border border-[#d6b56d]/10" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-stone-800 p-8 shadow-2xl">
              <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10">
                <Sparkles className="h-4 w-4 text-[#d6b56d]" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d6b56d]">
                Seek Knowledge
              </p>

              <h2 className="mt-5 text-3xl font-semibold leading-tight">
                Good teachers
                <br />
                make knowledge
                <br />
                easier to reach.
              </h2>

              <div className="my-8 h-px bg-white/10" />

              <p
                dir="rtl"
                className="font-serif text-3xl leading-loose text-[#e4c98d]"
              >
                وَقُلْ رَبِّ زِدْنِي عِلْمًا
              </p>

              <p className="mt-4 text-sm leading-6 text-stone-300">
                “And say, My Lord, increase me in knowledge.”
              </p>

              <p className="mt-3 text-xs font-medium text-stone-500">
                Surah Taha • 20:114
              </p>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-14 flex items-center gap-3">
          <div className="h-px w-16 bg-[#d6b56d]/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
          <div className="h-px w-8 bg-[#d6b56d]/20" />
        </div>
      </div>
    </section>
  );
}