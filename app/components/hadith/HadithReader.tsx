"use client";

import { Bookmark, Check, Copy } from "lucide-react";
import { useState } from "react";

type HadithReaderProps = {
  hadithNumber: string;
  arabic: string;
  translation: string;
  collectionName: string;
  bookName: string;
  chapterName: string;
  language?: "urdu" | "english";
};

export default function HadithReader({
  hadithNumber,
  arabic,
  translation,
  collectionName,
  bookName,
  chapterName,
  language = "english",
}: HadithReaderProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUrdu = language === "urdu";

  const handleCopy = async () => {
    const text = `${arabic}\n\n${translation}\n\n${collectionName}, Hadith ${hadithNumber}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.04)]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b56d]/40 bg-[#faf7ef] text-sm font-semibold text-[#967438]">
            {hadithNumber}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
              Hadith
            </p>

            <p className="mt-0.5 text-xs text-stone-500">
              {collectionName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setBookmarked((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
              bookmarked
                ? "bg-[#faf7ef] text-[#967438]"
                : "text-stone-400 hover:bg-stone-100 hover:text-stone-800"
            }`}
            aria-label="Bookmark Hadith"
          >
            <Bookmark
              size={17}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-800"
            aria-label="Copy Hadith"
          >
            {copied ? (
              <Check size={17} />
            ) : (
              <Copy size={17} />
            )}
          </button>
        </div>
      </div>

      {/* Arabic */}
      <div className="px-5 py-9 md:px-8 md:py-11">
        <p
          dir="rtl"
          lang="ar"
          translate="no"
          className="font-serif text-right text-[29px] leading-[2.25] text-stone-900 md:text-[37px] md:leading-[2.3]"
        >
          {arabic}
        </p>
      </div>

      {/* Translation */}
      {translation && (
        <div className="border-t border-stone-100 bg-[#faf9f6] px-5 py-7 md:px-8 md:py-8">
          <div
            className={`mb-5 flex items-center gap-3 ${
              isUrdu ? "justify-end" : "justify-start"
            }`}
          >
            <div className="h-px w-9 bg-[#d6b56d]" />

            <p
              dir={isUrdu ? "rtl" : "ltr"}
              className={`text-sm font-semibold text-[#967438] ${
                isUrdu ? "font-serif" : ""
              }`}
            >
              {isUrdu ? "ترجمہ" : "Translation"}
            </p>
          </div>

          <p
            dir={isUrdu ? "rtl" : "ltr"}
            lang={isUrdu ? "ur" : "en"}
            className={
              isUrdu
                ? "font-serif text-right text-[20px] leading-[2.1] text-stone-700 md:text-[22px]"
                : "text-left text-[17px] leading-8 text-stone-700"
            }
          >
            {translation}
          </p>
        </div>
      )}

      {/* Reference */}
      <div className="border-t border-stone-100 px-5 py-5 md:px-8">
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone-400">
              Collection
            </p>

            <p className="mt-1 font-medium text-stone-700">
              {collectionName}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone-400">
              Book
            </p>

            <p className="mt-1 font-medium text-stone-700">
              {bookName}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone-400">
              Chapter
            </p>

            <p className="mt-1 font-medium text-stone-700">
              {chapterName}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}