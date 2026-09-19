import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  UserRound,
} from "lucide-react";

import { fatwas } from "@/app/src/lib/fatwa";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const fatwa = fatwas.find((item) => item.slug === slug);

  if (!fatwa) {
    return {
      title: "Fatwa Not Found",
      description: "The requested Islamic guidance could not be found.",
    };
  }

  return {
    title: fatwa.question,
    description: fatwa.shortAnswer,
  };
}
export default async function FatwaDetailPage({ params }: Props) {
  const { slug } = await params;

  const fatwa = fatwas.find((item) => item.slug === slug);

  if (!fatwa) {
    notFound();
  }

  const relatedFatwas = fatwas
    .filter(
      (item) =>
        item.id !== fatwa.id && item.category === fatwa.category
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-900">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-950 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border border-[#d6b56d]/10" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-[#d6b56d]/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-[#d6b56d]/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-18 lg:px-8 lg:py-20">
          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Link
              href="/fatwa"
              className="text-stone-500 transition-colors hover:text-[#d6b56d]"
            >
              Fatwa
            </Link>

            <span className="text-stone-700">/</span>

            <span className="text-stone-400">
              {fatwa.category}
            </span>
          </div>

          {/* Category */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-8 bg-[#d6b56d]" />

            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#d6b56d]">
              {fatwa.category}
            </p>
          </div>

          {/* Question */}
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {fatwa.question}
          </h1>

          {/* Meta */}
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <UserRound
                size={15}
                className="text-[#d6b56d]"
              />
              <span>{fatwa.scholar}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-[#d6b56d]"
              />
              <span>{fatwa.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main answer */}
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            {/* Answer header */}
            <div className="flex items-center gap-3 border-b border-stone-100 pb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
                  Islamic Guidance
                </p>

                <h2 className="mt-1 text-lg font-semibold text-stone-900">
                  Answer
                </h2>
              </div>
            </div>

            {/* Answer */}
            <div className="mt-8">
              <p className="text-base leading-8 text-stone-700">
                {fatwa.shortAnswer}
              </p>

              <div className="my-8 h-px bg-stone-100" />

              <h3 className="text-lg font-semibold text-stone-900">
                Important Note
              </h3>

              <p className="mt-3 text-sm leading-7 text-stone-500">
                Islamic rulings can depend on the exact circumstances,
                intention, evidence, and scholarly interpretation involved.
                For personal or complex matters, consult a qualified scholar
                who can consider the complete situation.
              </p>
            </div>

            {/* Reference */}
            <div className="mt-8 rounded-2xl border border-[#d6b56d]/20 bg-[#d6b56d]/5 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-[#967438]"
                />

                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    Reference
                  </p>

                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {fatwa.reference}
                  </p>
                </div>
              </div>
            </div>

            {/* Scholar */}
            <div className="mt-8 border-t border-stone-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Reviewed / Provided By
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-[#d6b56d]">
                  <UserRound size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {fatwa.scholar}
                  </p>

                  <p className="text-xs text-stone-500">
                    Islamic Knowledge & Guidance
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Back */}
            <Link
              href="/fatwa"
              className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-semibold text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50"
            >
              <ArrowLeft size={16} />
              Back to Fatwas
            </Link>

            {/* Info */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
                Fatwa Details
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-stone-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {fatwa.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    Reference
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {fatwa.reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-stone-400">
                    Published
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {fatwa.date}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {relatedFatwas.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-100/60">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-16 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
                Continue Learning
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                Related Fatwas
              </h2>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedFatwas.map((related) => (
                <Link
                  key={related.id}
                  href={`/fatwa/${related.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5"
                >
                  <span className="text-xs font-semibold text-[#967438]">
                    {related.category}
                  </span>

                  <h3 className="mt-3 text-base font-semibold leading-6 text-stone-900">
                    {related.question}
                  </h3>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-stone-700 group-hover:text-[#967438]">
                    Read Fatwa
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </main>
  );
}