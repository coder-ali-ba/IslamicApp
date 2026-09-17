export default function HadithHero() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Islamic Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hadith-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />

              <circle
                cx="40"
                cy="40"
                r="16"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#hadith-pattern)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-10 bg-[#d6b56d]" />

          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b56d]">
            Hadith & Sunnah
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Hadith
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-400 md:text-lg">
          Explore authentic sayings, teachings, and traditions
          of the Prophet Muhammad ﷺ through well-known Hadith
          collections.
        </p>
      </div>
    </section>
  );
}