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

import Navbar from "@/app/components/Navbar";

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
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,181,109,0.16),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          
          {/* Hero Content */}
          <div>
            <p className="mb-5 text-center text-2xl text-[#a18143] lg:text-left">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            <span className="inline-flex rounded-full border border-[#d6b56d]/40 bg-[#d6b56d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6d35]">
              Islamic Learning Platform
            </span>

            <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn Quran.
              <br />
              <span className="text-[#a18143]">Understand Islam.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              A peaceful place to read the Quran, explore Tafseer and Hadith,
              learn from teachers, and grow your Islamic knowledge.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quran"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Start Learning
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:bg-white"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Quran Card */}
          <div className="relative">
            <div className="mx-auto max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_25px_80px_rgba(28,25,23,0.08)]">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-400">
                    Continue Reading
                  </p>
                  <h3 className="mt-1 font-semibold">Surah Al-Baqarah</h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4ead5] text-[#967438]">
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="py-8 text-center">
                <p className="font-serif text-3xl leading-loose text-stone-800">
                  ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ
                </p>

                <p className="mt-5 text-sm leading-7 text-stone-500">
                  This is the Book about which there is no doubt, a guidance
                  for those conscious of Allah.
                </p>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-xs text-stone-500">
                  <span>Reading Progress</span>
                  <span>16%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full w-[16%] rounded-full bg-[#b89554]" />
                </div>
              </div>

              <Link
                href="/quran"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-stone-50 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Continue Reading
                <ArrowRight size={16} />
              </Link>
            </div>
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