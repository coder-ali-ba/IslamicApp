import Link from "next/link";
import { BookOpen, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d6b56d] text-stone-950">
                <BookOpen size={19} strokeWidth={2.2} />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                IlmHub
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-stone-400">
              A place to learn, understand, and practice Islamic knowledge with
              purpose.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition hover:border-[#d6b56d] hover:text-[#d6b56d]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.66.34-1 1-1Z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition hover:border-[#d6b56d] hover:text-[#d6b56d]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle
                    cx="17.4"
                    cy="6.7"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-800 text-stone-400 transition hover:border-[#d6b56d] hover:text-[#d6b56d]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="hidden sm:block">
            <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/quran" className="transition hover:text-[#d6b56d]">
                  Quran
                </Link>
              </li>

              <li>
                <Link
                  href="/hadith"
                  className="transition hover:text-[#d6b56d]"
                >
                  Hadith
                </Link>
              </li>

              <li>
                <Link href="/fatwa" className="transition hover:text-[#d6b56d]">
                  Fatwa
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="transition hover:text-[#d6b56d]"
                >
                  Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div className="hidden sm:block">
            <h3 className="mb-4 text-sm font-semibold text-white">Learning</h3>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/classes"
                  className="transition hover:text-[#d6b56d]"
                >
                  Live Classes
                </Link>
              </li>

              <li>
                <Link
                  href="/teachers"
                  className="transition hover:text-[#d6b56d]"
                >
                  Teachers
                </Link>
              </li>

              <li>
                <Link href="/blog" className="transition hover:text-[#d6b56d]">
                  Articles
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-[#d6b56d]">
                  About IlmHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="hidden sm:block">
            <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>

            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#d6b56d]" />
                <span>info@ilmhub.com</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#d6b56d]" />
                <span>Online Islamic Learning Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-800 pt-6 sm:hidden">
          <Link
            href="/quran"
            className="text-xs text-stone-400 hover:text-[#d6b56d]"
          >
            Quran
          </Link>

          <Link
            href="/hadith"
            className="text-xs text-stone-400 hover:text-[#d6b56d]"
          >
            Hadith
          </Link>

          <Link
            href="/fatwa"
            className="text-xs text-stone-400 hover:text-[#d6b56d]"
          >
            Fatwa
          </Link>

          <Link
            href="/courses"
            className="text-xs text-stone-400 hover:text-[#d6b56d]"
          >
            Courses
          </Link>

          <Link
            href="/classes"
            className="text-xs text-stone-400 hover:text-[#d6b56d]"
          >
            Classes
          </Link>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-3 border-t border-stone-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} IlmHub. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-stone-500">
            <Link href="/privacy" className="hover:text-[#d6b56d]">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-[#d6b56d]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
