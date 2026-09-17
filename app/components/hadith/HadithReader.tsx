"use client";

import { Bookmark, Check, Copy } from "lucide-react";
import { useState } from "react";

type HadithReaderProps = {
  hadithNumber: string;
  arabic: string;
  translation: string;
  urduTranslation?: string;
  collectionName: string;
  bookName: string;
  chapterName: string;
};

export default function HadithReader({
  hadithNumber,
  arabic,
  translation,
  urduTranslation,
  collectionName,
  bookName,
  chapterName,
}: HadithReaderProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyHadith = async () => {
    const text = `${arabic}\n\n${translation}${
      urduTranslation
        ? `\n\n${urduTranslation}`
        : ""
    }`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      {/* Top */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-5">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-[#967438]">
            Hadith
          </span>

          <h2 className="mt-1 text-lg font-semibold text-stone-900">
            #{hadithNumber}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setBookmarked(!bookmarked)
            }
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-[#967438]"
            aria-label="Bookmark Hadith"
          >
            <Bookmark
              className="h-5 w-5"
              fill={
                bookmarked ? "currentColor" : "none"
              }
            />
          </button>

          <button
            onClick={copyHadith}
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-[#967438]"
            aria-label="Copy Hadith"
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Arabic */}
      {arabic && (
        <div className="border-b border-stone-100 py-8">
          <p
            dir="rtl"
            className="text-right text-2xl leading-[2.3] text-stone-900 md:text-3xl"
          >
            {arabic}
          </p>
        </div>
      )}

      {/* English */}
      <div className="border-b border-stone-100 py-7">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#967438]">
          English
        </p>

        <p className="text-[16px] leading-8 text-stone-700">
          {translation}
        </p>
      </div>

      {/* Urdu */}
      {urduTranslation && (
        <div className="py-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#967438]">
            اردو
          </p>

          <p
            dir="rtl"
            className="text-right text-[18px] leading-9 text-stone-700"
          >
            {urduTranslation}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 grid gap-4 border-t border-stone-100 pt-5 text-sm md:grid-cols-3">
        <div>
          <p className="text-xs text-stone-400">
            Collection
          </p>

          <p className="mt-1 font-medium text-stone-700">
            {collectionName}
          </p>
        </div>

        <div>
          <p className="text-xs text-stone-400">
            Book
          </p>

          <p className="mt-1 font-medium text-stone-700">
            {bookName}
          </p>
        </div>

        {chapterName && (
          <div>
            <p className="text-xs text-stone-400">
              Chapter
            </p>

            <p className="mt-1 font-medium text-stone-700">
              {chapterName}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}