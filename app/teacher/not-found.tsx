import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#faf9f6] px-6 py-20 text-stone-900">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#d6b56d]/20" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full border border-[#d6b56d]/20" />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Icon */}
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-lg">
          <BookOpen className="h-8 w-8" />
        </div>

        {/* 404 */}
        <p className="text-8xl font-semibold tracking-tight text-stone-900 sm:text-9xl">
          404
        </p>

        <div className="mx-auto mt-4 h-px w-16 bg-[#d6b56d]" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-600 sm:text-base">
          The page you are looking for may have been moved, removed, or the
          address may be incorrect.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/quran"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-[#d6b56d] hover:bg-stone-50"
          >
            Explore Quran
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>

        {/* Small Brand Text */}
        <p className="mt-10 text-xs tracking-wide text-stone-400">
          IlmHub — Learn, understand, and practice with purpose.
        </p>
      </div>
    </main>
  );
}