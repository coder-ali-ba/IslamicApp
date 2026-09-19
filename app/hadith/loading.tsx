import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-[#d6b56d] shadow-lg">
          <BookOpen className="h-7 w-7 animate-pulse" />
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#d6b56d]" />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#d6b56d]"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#d6b56d]"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        <p className="mt-4 text-sm font-medium text-stone-700">
          Loading IlmHub...
        </p>

        <p className="mt-1 text-xs text-stone-400">
          Preparing your learning experience
        </p>
      </div>
    </main>
  );
}