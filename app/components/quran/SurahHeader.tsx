type SurahHeaderProps = {
  number: number;
  name: string;
  arabicName: string;
  versesCount: number;
  revelation: string;
};

export default function SurahHeader({
  number,
  name,
  arabicName,
  versesCount,
  revelation,
}: SurahHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/5" />
      </div>

      {/* Subtle Islamic Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="islamic-pattern"
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
            fill="url(#islamic-pattern)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-16">
        {/* Top Label */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-10 bg-[#d6b56d]" />

          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b56d]">
            Holy Quran
          </span>

          <div className="h-px w-10 bg-[#d6b56d]" />
        </div>

        {/* Main Content */}
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          {/* Left */}
          <div>
            <div className="flex items-center gap-5">
              {/* Number */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#d6b56d]/50">
                <div className="absolute inset-1 rounded-full border border-[#d6b56d]/20" />

                <span className="text-2xl font-semibold text-[#d6b56d]">
                  {number}
                </span>
              </div>

              <div>
                <p className="mb-1 text-sm uppercase tracking-[0.2em] text-stone-400">
                  Surah
                </p>

                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {name}
                </h1>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-400">
              <span className="capitalize">
                {revelation}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#d6b56d]" />

              <span>
                {versesCount} Ayahs
              </span>

              <span className="h-1 w-1 rounded-full bg-[#d6b56d]" />

              <span>
                Urdu & English
              </span>
            </div>
          </div>

          {/* Arabic */}
          <div className="text-left md:min-w-[280px] md:text-right">
            <p
              dir="rtl"
              lang="ar"
              translate="no"
              className="font-serif text-5xl leading-relaxed text-[#f5e7c1] md:text-6xl"
            >
              {arabicName}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-stone-500">
              {name}
            </p>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-12 flex items-center gap-4">
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