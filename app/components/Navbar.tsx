"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, Search } from "lucide-react";

const navLinks = [
  { name: "Quran", href: "/quran" },
  { name: "Tafseer", href: "/tafseer" },
  { name: "Hadith", href: "/hadith" },
  { name: "Courses", href: "/courses" },
  { name: "Fatwa", href: "/fatwa" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#faf9f6]/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
            <BookOpen size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900">
              IlmHub
            </h1>
            <p className="text-[10px] tracking-widest text-stone-500">
              LEARN • UNDERSTAND • GROW
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-stone-600 transition hover:text-stone-950"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <Search size={18} />
          </button>

          <Link
            href="/login"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-950"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-stone-200 bg-[#faf9f6] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex gap-3 border-t border-stone-200 pt-4">
            <Link
              href="/login"
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-center text-sm font-medium"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="flex-1 rounded-lg bg-stone-900 py-2.5 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}