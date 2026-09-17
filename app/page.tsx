import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BookMarked,
  GraduationCap,
  MessageCircleQuestion,
  ScrollText,
  Users,
} from "lucide-react";



const features = [
  {
    icon: BookOpen,
    title: "Learn Quran",
    description:
      "Read the Quran with translations, recitation and a simple learning experience.",
    href: "/quran",
  },
  {
    icon: ScrollText,
    title: "Explore Tafseer",
    description:
      "Understand the meanings and explanations behind the verses.",
    href: "/tafseer",
  },
  {
    icon: BookMarked,
    title: "Study Hadith",
    description:
      "Explore authentic Hadith and build your Islamic knowledge.",
    href: "/hadith",
  },
  {
    icon: GraduationCap,
    title: "Learn from Teachers",
    description:
      "Discover structured courses and learn from qualified teachers.",
    href: "/courses",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask a Scholar",
    description:
      "Submit your Islamic questions for review by qualified scholars.",
    href: "/fatwa",
  },
  {
    icon: Users,
    title: "Join the Community",
    description:
      "Learn, reflect and grow together with other students.",
    href: "/community",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-900">
      

      {/* Hero */}
      {/* Hero */}
<section className="relative overflow-hidden bg-stone-900 text-white">
  {/* Background Decorations */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -right-40 -top-40 h-[460px] w-[460px] rounded-full border border-[#d6b56d]/10" />
    <div className="absolute -right-28 -top-28 h-[340px] w-[340px] rounded-full border border-[#d6b56d]/10" />
    <div className="absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full border border-[#d6b56d]/10" />

    <div className="absolute -bottom-52 -left-40 h-[520px] w-[520px] rounded-full border border-white/5" />

    <div className="absolute left-1/3 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#d6b56d]/5 blur-3xl" />
  </div>

  {/* Islamic Pattern */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
    <svg
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="home-pattern"
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
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#home-pattern)"
      />
    </svg>
  </div>

  {/* Content */}
  <div className="relative mx-auto max-w-7xl px-5 py-4 sm:py-8 lg:px-8 lg:py-12">
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">

      {/* Left Content */}
      <div>
        {/* Bismillah */}
        <p className="mb-6 text-center font-serif text-2xl text-[#d6b56d] lg:text-left">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>

        {/* Label */}
        <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6b56d]/20 bg-[#d6b56d]/10 text-[#d6b56d]">
            <BookOpen size={21} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              Welcome to IlmHub
            </p>

            <p className="text-sm font-medium text-[#d6b56d]">
              Islamic Learning Platform
            </p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-left lg:text-6xl xl:text-7xl">
          Learn Quran.
          <br />
          <span className="text-[#d6b56d]">
            Understand Islam.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-8 text-stone-300 sm:text-lg lg:mx-0 lg:text-left">
          A peaceful place to read the Quran, explore Tafseer and
          Hadith, learn from teachers, and build a deeper
          understanding of your faith.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href="/quran"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#d6b56d] px-7 py-3.5 text-sm font-semibold text-stone-950 shadow-lg shadow-black/10 transition duration-300 hover:bg-[#e0c27f]"
          >
            Start Learning

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-[#d6b56d]/40 hover:bg-white/[0.08]"
          >
            Explore Courses
          </Link>
        </div>

        {/* Small Highlights */}
        <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-stone-400 lg:justify-start">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
            Quran & Tafseer
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
            Authentic Hadith
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
            Live Learning
          </div>
        </div>
      </div>

      {/* Right Quran Card */}
      <div className="relative mx-auto w-full max-w-[420px]">

        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-[2rem] bg-[#d6b56d]/5 blur-2xl" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-md sm:p-8">

          {/* Top Ornament */}
          <div className="mb-7 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#d6b56d]/40" />

            <span className="text-sm text-[#d6b56d]">
              ✦
            </span>

            <div className="h-px w-12 bg-[#d6b56d]/40" />
          </div>

          {/* Card Label */}
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-stone-500">
            Daily Quran Reading
          </p>

          <h2 className="mt-4 text-center text-2xl font-semibold sm:text-3xl">
            Surah Al-Baqarah
          </h2>

          {/* Arabic */}
          <div className="py-9 text-center">
            <p
              dir="rtl"
              lang="ar"
              translate="no"
              className="font-serif text-3xl leading-[2.1] text-[#f5e7c1] sm:text-4xl"
            >
              ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ
            </p>

            <div className="mx-auto mt-7 h-px w-12 bg-[#d6b56d]/40" />

            <p className="mt-6 text-sm leading-7 text-stone-400">
              This is the Book about which there is no doubt,
              a guidance for those conscious of Allah.
            </p>

            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#d6b56d]/70">
              Al-Baqarah • 2:2
            </p>
          </div>

          {/* Progress */}
          <div className="border-t border-white/10 pt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Reading Progress
              </span>

              <span className="font-medium text-[#d6b56d]">
                16%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[16%] rounded-full bg-[#d6b56d]" />
            </div>
          </div>

          {/* Continue */}
          <Link
            href="/quran"
            className="group mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-stone-200 transition hover:border-[#d6b56d]/30 hover:bg-white/[0.08]"
          >
            Continue Reading

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Floating Badge */}
        <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-white/10 bg-stone-900/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500">
            Your Journey
          </p>

          <p className="mt-1 text-xs font-medium text-[#d6b56d]">
            One verse at a time
          </p>
        </div>

        {/* Gold Dot */}
        <div className="absolute -right-2 top-10 h-2.5 w-2.5 rounded-full bg-[#d6b56d] shadow-[0_0_0_6px_rgba(214,181,109,0.1)]" />
      </div>
    </div>

    {/* Bottom Decoration */}
    <div className="mt-14 flex items-center justify-center gap-4">
      <div className="h-px flex-1 bg-white/10" />

      <div className="flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-[#d6b56d]/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
        <span className="h-1 w-1 rounded-full bg-[#d6b56d]/60" />
      </div>

      <div className="h-px flex-1 bg-white/10" />
    </div>
  </div>
</section>

      {/* Features */}
      <section className="border-y border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A better way to learn
            </h2>

            <p className="mt-4 leading-7 text-stone-500">
              Explore Quran, Tafseer, Hadith and structured Islamic learning
              through one simple platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group rounded-2xl border border-stone-200 bg-[#faf9f6] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e5ce] text-[#8b6d35]">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#8b6d35]">
                    Explore
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-stone-900 px-7 py-14 text-center text-white sm:px-12">
          <p className="text-2xl text-[#d6b56d]">
            وَقُلْ رَبِّ زِدْنِي عِلْمًا
          </p>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Seek knowledge, one step at a time.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-300">
            Start your journey with the Quran and build a deeper understanding
            of your faith.
          </p>

          <Link
            href="/quran"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d6b56d] px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-[#e0c27f]"
          >
            Begin Your Journey
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}