import { BookOpen } from "lucide-react";

export default function QuranHero() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="absolute -right-28 -top-28 h-[300px] w-[300px] rounded-full border border-[#d6b56d]/10" />

        <div className="absolute -bottom-48 -left-40 h-[500px] w-[500px] rounded-full border border-white/5" />

        <div className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-[#d6b56d]/5 blur-3xl" />
      </div>

      {/* Subtle Islamic Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="quran-pattern"
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

              <circle
                cx="45"
                cy="45"
                r="5"
                fill="none"
                stroke="white"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#quran-pattern)"
          />
        </svg>
      </div>

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
                  The Noble Quran
                </p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Read.
              <span className="text-[#d6b56d]"> Reflect.</span>
              <br />
              Understand.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Read the Quran with trusted translations, explore
              its meaning through Tafseer, and build a deeper
              connection with the words of Allah.
            </p>

            {/* Stats */}
            <div className="mt-9 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-xl font-semibold text-white">
                  114
                </p>

                <p className="text-xs text-stone-400">
                  Surahs
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-xl font-semibold text-white">
                  6,236
                </p>

                <p className="text-xs text-stone-400">
                  Ayahs
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-xl font-semibold text-white">
                  Urdu
                </p>

                <p className="text-xs text-stone-400">
                  Translation
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-xl font-semibold text-white">
                  English
                </p>

                <p className="text-xs text-stone-400">
                  Translation
                </p>
              </div>
            </div>
          </div>

          {/* Right Quran Verse */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-[#d6b56d]/5 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
              {/* Decorative Top */}
              <div className="mb-7 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-[#d6b56d]/40" />

                <span className="text-[#d6b56d]">✦</span>

                <div className="h-px w-12 bg-[#d6b56d]/40" />
              </div>

              {/* Arabic */}
              <p
                dir="rtl"
                lang="ar"
                translate="no"
                className="text-center font-serif text-3xl leading-[2.2] text-[#f5e7c1] sm:text-4xl"
              >
                إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
              </p>

              {/* Translation */}
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-center text-sm italic leading-7 text-stone-400">
                  Indeed, this Quran guides to that which
                  is most upright.
                </p>
              </div>

              {/* Reference */}
              <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#d6b56d]/70">
                Surah Al-Isra • 17:9
              </p>
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