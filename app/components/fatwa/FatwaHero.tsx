import Link from "next/link";
import { ArrowRight, BookOpen, Search, ShieldCheck } from "lucide-react";

export default function FatwaHero() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border border-[#d6b56d]/10" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-[#d6b56d]/10" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-[#d6b56d]/5 blur-3xl" />

      {/* Islamic pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
            linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
            linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
            linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d)
          `,
          backgroundPosition: "0 0, 0 0, 12px 12px, 12px 12px",
          backgroundSize: "24px 42px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d6b56d]/20 bg-[#d6b56d]/10 text-[#d6b56d]">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#d6b56d]">
                  Islamic Guidance
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  Learn with authentic references
                </p>
              </div>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Questions answered with{" "}
              <span className="text-[#d6b56d]">Islamic guidance.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              Explore questions and answers covering Salah, fasting, Zakat,
              family, business and other areas of Islamic life.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-2 backdrop-blur-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-stone-400">
                  <Search size={18} />
                </div>

                <input
                  type="text"
                  placeholder="Search a question..."
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-stone-500"
                />

                <button
                  type="button"
                  className="rounded-xl bg-[#d6b56d] px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-[#e2c47d]"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#fatwas"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
              >
                Browse Fatwas
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#ask"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-stone-200 transition-colors hover:bg-white/[0.08]"
              >
                Ask a Question
              </Link>
            </div>
          </div>

          {/* Right card */}
          <div className="relative lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#d6b56d]/10 blur-3xl" />

              <div className="relative">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d6b56d]/10 text-[#d6b56d]">
                  <ShieldCheck size={25} />
                </div>

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d6b56d]">
                  Seek Knowledge
                </p>

                <h2 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  Learn before you act.
                </h2>

                <p className="mt-4 text-sm leading-7 text-stone-400">
                  Explore Islamic guidance with references and scholarly
                  context. Personal matters should be referred to qualified
                  scholars who can understand the complete circumstances.
                </p>

                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="h-px w-10 bg-[#d6b56d]" />
                  <span className="text-xs text-stone-500">
                    Knowledge • Understanding • Practice
                  </span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-stone-900 px-4 py-3 shadow-xl sm:block">
              <p className="text-xs text-stone-500">Explore</p>
              <p className="mt-1 text-sm font-semibold text-white">
                Islamic Guidance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-5 pb-5 sm:px-6 lg:px-8">
        <div className="h-px w-12 bg-[#d6b56d]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
        <div className="h-px w-24 bg-stone-800" />
      </div>
    </section>
  );
}