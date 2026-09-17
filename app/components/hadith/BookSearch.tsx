"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type Book = {
  number: number;
  arabic: string;
  urdu: string;
  english: string;
};

type BooksSearchProps = {
  books: Book[];
  collection: string;
};

export default function BooksSearch({
  books,
  collection,
}: BooksSearchProps) {
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.english
          .toLocaleLowerCase()
          .includes(query) ||
        book.urdu
          .toLocaleLowerCase()
          .includes(query) ||
        book.arabic
          .toLocaleLowerCase()
          .includes(query) ||
        String(book.number).includes(query)
      );
    });
  }, [books, search]);

  return (
    <div>
      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-8">
        <div className="relative">
          <Search
            size={20}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search books by Arabic, Urdu, English or number..."
            className="h-14 w-full rounded-2xl border border-stone-200 bg-white pl-12 pr-12 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search result count */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}{" "}
            found
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xs font-medium text-[#967438] transition hover:text-[#7d5f2e]"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          BOOK RESULTS
      ===================================================== */}

      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf7ef] text-[#967438]">
            <Search size={22} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-stone-800">
            No books found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try searching with another book name,
            language or book number.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredBooks.map((book) => (
            <Link
              key={book.number}
              href={`/hadith/${collection}/${book.number}`}
              prefetch={false}
              className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#d6b56d]/60 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 w-full">
                  {/* Number */}
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d]/10 text-sm font-semibold text-[#967438]">
                    {book.number}
                  </div>

                  {/* Arabic */}
                  {book.arabic && (
                    <h3
                      dir="rtl"
                      lang="ar"
                      className="font-serif text-2xl leading-relaxed text-stone-900"
                    >
                      {book.arabic}
                    </h3>
                  )}

                  {/* Urdu */}
                  {book.urdu && (
                    <p
                      dir="rtl"
                      lang="ur"
                      className="mt-2 font-serif text-xl leading-relaxed text-stone-700"
                    >
                      {book.urdu}
                    </p>
                  )}

                  {/* English */}
                  {book.english && (
                    <p className="mt-3 text-lg font-semibold text-stone-900">
                      {book.english}
                    </p>
                  )}

                  {/* Book number */}
                  <p className="mt-4 text-xs uppercase tracking-[0.12em] text-stone-400">
                    Book {book.number}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#967438]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

