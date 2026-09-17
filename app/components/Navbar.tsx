"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  Search,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Quran", href: "/quran" },
  { name: "Tafseer", href: "/tafseer" },
  { name: "Hadith", href: "/hadith" },
  { name: "Courses", href: "/courses" },
  { name: "Fatwa", href: "/fatwa" },
  { name: "Classes", href: "/classes" },
  { name: "Teachers", href: "/teachers" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d] text-stone-950 transition duration-300 group-hover:bg-[#c9a75f]">
            <BookOpen size={20} strokeWidth={2.2} />
          </div>

          <div className="leading-none">
            <h1 className="text-[19px] font-semibold tracking-tight text-stone-900">
              IlmHub
            </h1>

            <p className="mt-1 text-[9px] font-medium tracking-[0.18em] text-stone-500">
              LEARN • UNDERSTAND • GROW
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative py-2 text-[13px] font-medium text-stone-600 transition-colors duration-200 hover:text-stone-950"
            >
              {link.name}

              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#d6b56d] transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">

          {/* Search */}
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
          >
            <Search size={18} strokeWidth={1.8} />
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="rounded-lg border border-stone-300 px-4 py-2 text-[13px] font-medium text-stone-700 transition duration-200 hover:border-stone-500 hover:bg-stone-50 hover:text-stone-950"
          >
            Login
          </Link>

          {/* Get Started */}
          <Link
            href="/register"
            className="rounded-lg bg-stone-900 px-4 py-2 text-[13px] font-medium text-white transition duration-200 hover:bg-stone-800"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:border-[#d6b56d] hover:text-stone-950 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X size={21} strokeWidth={1.8} />
          ) : (
            <Menu size={21} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-stone-200 bg-[#faf9f6] px-5 py-5 lg:hidden">
          
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between border-b border-stone-200/70 px-2 py-3.5 text-sm font-medium text-stone-700 transition hover:text-stone-950"
              >
                <span>{link.name}</span>

                <ChevronDown
                  size={15}
                  className="-rotate-90 text-stone-400"
                />
              </Link>
            ))}
          </nav>

          {/* Mobile Actions */}
          <div className="mt-5 flex gap-3 border-t border-stone-200 pt-5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-lg bg-stone-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Search */}
          <Link
            href="/search"
            onClick={() => setIsOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
          >
            <Search size={16} />
            Search
          </Link>
        </div>
      )}
    </header>
  );
}