"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

type TafseerAyahCardProps = {
  number: number;
  arabic: string;
  tafseer: string;
  tafseerName: string;
  language: "urdu" | "english";
};

export default function TafseerAyahCard({
  number,
  arabic,
  tafseer,
  tafseerName,
  language,
}: TafseerAyahCardProps) {
  const [copied, setCopied] = useState(false);

  const isUrdu = language === "urdu";

  const handleCopy = async () => {
    const text = `${arabic}\n\n${tafseer}`;

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
      {/* Ayah Header */}
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b56d]/40 bg-[#faf7ef] text-sm font-semibold text-[#967438]">
            {number}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
              Ayah
            </p>
            <p className="mt-0.5 text-xs text-stone-400">
              {number}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-800"
          aria-label="Copy ayah and tafseer"
        >
          {copied ? (
            <Check size={17} />
          ) : (
            <Copy size={17} />
          )}
        </button>
      </div>

      {/* Arabic */}
      <div className="px-5 py-8 md:px-8 md:py-10">
        <p
          dir="rtl"
          lang="ar"
          translate="no"
          className="font-serif text-right text-[30px] leading-[2.2] text-stone-900 md:text-[38px] md:leading-[2.3]"
        >
          {arabic}
        </p>
      </div>

      {/* Tafseer */}
      {tafseer && (
        <div className="border-t border-stone-100 bg-[#faf9f6] px-5 py-7 md:px-8 md:py-8">
          {/* Tafseer heading */}
          <div
            className={`mb-6 flex items-center gap-3 ${
              isUrdu ? "justify-end" : "justify-start"
            }`}
          >
            {isUrdu ? (
              <>
                <div className="h-px w-10 bg-[#d6b56d]" />

                <div className="text-right">
                  <p
                    dir="rtl"
                    className="font-serif text-lg font-semibold text-[#967438]"
                  >
                    تفسیر
                  </p>

                  <p className="mt-0.5 text-xs text-stone-400">
                    {tafseerName}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-px w-10 bg-[#d6b56d]" />

                <div>
                  <p className="text-sm font-semibold text-[#967438]">
                    Tafseer
                  </p>

                  <p className="mt-0.5 text-xs text-stone-400">
                    {tafseerName}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Tafseer content */}
          <div
            dir={isUrdu ? "rtl" : "ltr"}
            lang={isUrdu ? "ur" : "en"}
            className={
              isUrdu
                ? "font-serif text-right text-[20px] leading-[2.15] text-stone-700 md:text-[22px] md:leading-[2.2]"
                : "text-left text-[17px] leading-8 text-stone-700"
            }
            dangerouslySetInnerHTML={{
              __html: tafseer,
            }}
          />
        </div>
      )}
    </article>
  );
}