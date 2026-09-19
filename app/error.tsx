"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-6 py-20">
      <div className="w-full max-w-xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-lg">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <p className="mt-7 text-sm font-medium uppercase tracking-[0.2em] text-[#967438]">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          We couldn&apos;t load this page
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-600">
          Something unexpected happened while loading this page. Please try
          again or return to the IlmHub home page.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 transition hover:border-[#d6b56d] hover:bg-stone-50"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Brand */}
        <p className="mt-10 text-xs tracking-wide text-stone-400">
          IlmHub — Learn, understand, and practice with purpose.
        </p>
      </div>
    </main>
  );
}