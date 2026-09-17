"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Check,
  Copy,
  Pause,
  Play,
  Share2,
} from "lucide-react";

type AyahCardProps = {
  number: number;
  arabic: string;
  translation: string;
  translationName: string;
  audioUrl: string;
};

export default function AyahCard({
  number,
  arabic,
  translation,
  translationName,
  audioUrl,
}: AyahCardProps) {
  const [playing, setPlaying] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = async () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);

      audioRef.current.onended = () => {
        setPlaying(false);
      };
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      console.error("Audio playback failed:", error);
      setPlaying(false);
    }
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  const handleCopy = async () => {
    const text = `${arabic}\n\n${translation}`;

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

  const handleShare = async () => {
    const text = `${arabic}\n\n${translation}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Quran Ayah ${number}`,
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      {/* Top actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-600">
          {number}
        </div>

        <div className="flex items-center gap-1">
          {/* Play */}
          <button
            type="button"
            onClick={handlePlay}
            disabled={!audioUrl}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`rounded-full p-2 transition ${
              bookmarked
                ? "text-[#967438]"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            }`}
            aria-label="Bookmark"
          >
            <Bookmark
              size={18}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="Copy"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Arabic */}
      <p
        dir="rtl"
        lang="ar"
        translate="no"
        className="font-serif text-right text-3xl leading-[2.2] text-stone-900 md:text-4xl"
      >
        {arabic}
      </p>

      {/* Translation */}
      {translation && (
        <div className="mt-7 border-t border-stone-100 pt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
            {translationName}
          </p>

          <p
            dir={translationName.toLowerCase().includes("urdu") ? "rtl" : "ltr"}
            className={`text-lg leading-9 text-stone-600 ${
              translationName.toLowerCase().includes("urdu")
                ? "text-right"
                : "text-left"
            }`}
          >
            {translation}
          </p>
        </div>
      )}
    </article>
  );
}