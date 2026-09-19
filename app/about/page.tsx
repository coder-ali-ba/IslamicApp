import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about IlmHub and our mission to make authentic Islamic knowledge accessible.",
};


import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Heart,
  Library,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
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

        {/* Decorative circles */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -left-28 -top-28 h-56 w-56 rounded-full border border-[#d6b56d]/10" />
        <div className="absolute -right-40 bottom-[-160px] h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b56d]/20 bg-[#d6b56d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#e4c98d]">
                <Sparkles className="h-4 w-4" />
                About IlmHub
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                A Place to
                <span className="block text-[#d6b56d]">
                  Learn With Purpose.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                IlmHub is a learning platform designed to make authentic
                Islamic knowledge easier to explore, understand, and
                learn through structured resources and guided classes.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d6b56d] px-5 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-[#e4c98d]"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/quran"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Quran
                </Link>
              </div>
            </div>

            {/* Right quote card */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] border border-[#d6b56d]/10" />

              <div className="relative rounded-[2rem] border border-white/10 bg-stone-800 p-8 shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d6b56d]/10">
                  <BookOpen className="h-5 w-5 text-[#d6b56d]" />
                </div>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#d6b56d]">
                  Our Inspiration
                </p>

                <p
                  dir="rtl"
                  className="mt-5 font-serif text-3xl leading-[2] text-[#e4c98d]"
                >
                  وَقُلْ رَبِّ زِدْنِي عِلْمًا
                </p>

                <p className="mt-5 text-sm leading-6 text-stone-300">
                  “And say, My Lord, increase me in knowledge.”
                </p>

                <div className="mt-5 h-px bg-white/10" />

                <p className="mt-4 text-xs text-stone-500">
                  Surah Taha • 20:114
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
              Our Mission
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
              Making Islamic learning simple, structured, and accessible.
            </h2>

            <p className="mt-6 text-sm leading-7 text-stone-600">
              Learning about Islam should feel clear and approachable.
              IlmHub brings useful resources and guided learning
              experiences together in one place so learners can explore
              knowledge at their own pace.
            </p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Whether you want to read the Quran, study Hadith, learn
              Arabic, understand Fiqh, or join a live class, IlmHub is
              designed to give you a structured place to continue your
              learning journey.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: BookOpen,
                title: "Quran",
                text: "Read, explore translations, and study the Quran.",
              },
              {
                icon: Library,
                title: "Hadith",
                text: "Explore major Hadith collections in multiple languages.",
              },
              {
                icon: GraduationCap,
                title: "Courses",
                text: "Learn through structured Islamic courses.",
              },
              {
                icon: Users,
                title: "Live Classes",
                text: "Learn directly with experienced instructors.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                    <Icon className="h-5 w-5 text-[#967438]" />
                  </div>

                  <h3 className="mt-5 font-semibold text-stone-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why IlmHub */}
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
              Why IlmHub
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">
              Built around the learner.
            </h2>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Every part of IlmHub is designed to make learning easier
              to navigate and more meaningful.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Structured Learning",
                text: "Find courses and classes organized around clear learning goals.",
              },
              {
                number: "02",
                title: "Multiple Resources",
                text: "Bring Quran, Hadith, Tafseer, and educational content together.",
              },
              {
                number: "03",
                title: "Learn With Teachers",
                text: "Connect learning resources with live guidance from instructors.",
              },
              {
                number: "04",
                title: "Learn At Your Pace",
                text: "Explore resources and choose learning opportunities that suit you.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-stone-200 bg-[#faf9f6] p-6"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-[#b99a5a]">
                  {item.number}
                </span>

                <h3 className="mt-5 font-semibold text-stone-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Journey */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
              Your Journey
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">
              Start wherever you are.
            </h2>

            <p className="mt-5 text-sm leading-7 text-stone-600">
              You do not have to know everything before you begin.
              Start with one subject, one lesson, or one question and
              continue from there.
            </p>

            <Link
              href="/teachers"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#967438] transition hover:text-stone-900"
            >
              Meet Our Teachers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: BookOpen,
                title: "Explore",
                text: "Discover Quran, Hadith, Tafseer, courses, and other learning resources.",
              },
              {
                icon: GraduationCap,
                title: "Learn",
                text: "Choose a structured course or join a live class with a teacher.",
              },
              {
                icon: MessageCircle,
                title: "Ask & Understand",
                text: "Engage with teachers and build a deeper understanding through questions and discussion.",
              },
              {
                icon: Heart,
                title: "Practice",
                text: "Turn what you learn into meaningful everyday practice.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-5 rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                    <Icon className="h-5 w-5 text-[#967438]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#b99a5a]">
                        0{index + 1}
                      </span>

                      <h3 className="font-semibold text-stone-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6b56d]">
                Our Values
              </p>

              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Knowledge with sincerity.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300">
                IlmHub is built around a simple idea: learning should
                lead to understanding, and understanding should lead to
                better practice.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Authentic learning",
                "Respect for knowledge",
                "Clear education",
                "Continuous learning",
              ].map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#d6b56d]" />

                  <span className="text-sm font-medium text-stone-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#faf9f6]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
            <GraduationCap className="h-7 w-7 text-[#967438]" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Begin Your Journey
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">
            There is always more to learn.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-500">
            Explore IlmHub and find a learning path that helps you
            grow in knowledge, understanding, and practice.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/classes"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              View Live Classes
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}