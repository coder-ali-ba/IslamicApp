import { quranClient } from "@/app/src/lib/quran";
import { surahs } from "@/app/src/lib/surah";

import TafseerControls from "@/app/components/tafseer/TafseerControll";
import TafseerAyahCard from "@/app/components/tafseer/TafseerAyahCard";

type Props = {
  searchParams: Promise<{
    language?: string;
    tafsir?: string;
    surah?: string;
  }>;
};

export default async function TafseerPage({ searchParams }: Props) {
  const query = await searchParams;

  /*
   * Verified Tafseer IDs from Quran Foundation API
   */

  const allowedTafseers = [
    // Urdu
    {
      id: 157,
      name: "Fi Zilal al-Quran",
      language: "urdu",
      authorName: "Sayyid Ibrahim Qutb",
    },
    {
      id: 160,
      name: "Tafsir Ibn Kathir",
      language: "urdu",
      authorName: "Hafiz Ibn Kathir",
    },
    {
      id: 818,
      name: "Tazkir ul Quran",
      language: "urdu",
      authorName: "Maulana Wahid Uddin Khan",
    },
    {
      id: 159,
      name: "Bayan ul Quran",
      language: "urdu",
      authorName: "Dr. Israr Ahmad",
    },

    // English
    {
      id: 169,
      name: "Ibn Kathir (Abridged)",
      language: "english",
      authorName: "Hafiz Ibn Kathir",
    },
    {
      id: 168,
      name: "Ma'arif al-Qur'an",
      language: "english",
      authorName: "Mufti Muhammad Shafi",
    },
    {
      id: 817,
      name: "Tazkirul Quran",
      language: "english",
      authorName: "Maulana Wahid Uddin Khan",
    },
  ];

  /*
   * Language
   */

  const selectedLanguage = query.language === "english" ? "english" : "urdu";

  /*
   * Tafseer
   */

  const languageTafseers = allowedTafseers.filter(
    (item) => item.language === selectedLanguage,
  );

  const requestedTafseer = Number(query.tafsir);

  const selectedTafseer = languageTafseers.some(
    (item) => item.id === requestedTafseer,
  )
    ? requestedTafseer
    : languageTafseers[0].id;

  /*
   * Surah
   */

  const requestedSurah = Number(query.surah);

  const selectedSurah = surahs.some((item) => item.id === requestedSurah)
    ? requestedSurah
    : 1;

  const surah = surahs.find((item) => item.id === selectedSurah);

  if (!surah) {
    return null;
  }

  const selectedTafseerInfo = allowedTafseers.find(
    (item) => item.id === selectedTafseer,
  );

  /*
   * Get verses + Tafseer
   */

  const allVerses: any[] = [];

  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await quranClient.content.v4.verses.byChapter(
      String(selectedSurah),
      {
        words: true,

        wordFields: {
          textUthmani: true,
        },

        tafsirs: [selectedTafseer],

        page,

        perPage: 50,
      },
    );

    const verses = Array.isArray(response)
      ? response
      : (response?.verses ?? []);

    allVerses.push(...verses);

    if (allVerses.length >= surah.verses || verses.length === 0) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="tafsir-pattern"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M40 0 L80 40 L40 80 L0 40 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#tafsir-pattern)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-10 bg-[#d6b56d]" />

            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b56d]">
              Quran Studies
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Tafseer
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-400 md:text-lg">
            Explore the meanings and explanations of the Quran through
            established Tafaseer.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <TafseerControls
          tafseers={allowedTafseers}
          surahs={surahs}
          selectedTafseer={selectedTafseer}
          selectedSurah={selectedSurah}
          selectedLanguage={selectedLanguage}
        />

        {/* Current Surah */}
        <div className="my-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#967438]">
            Surah {surah.id}
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-stone-900">
            {surah.name}
          </h2>

          <p dir="rtl" className="mt-2 font-serif text-3xl text-stone-700">
            {surah.arabic}
          </p>

          <p className="mt-3 text-sm text-stone-400">
            {selectedTafseerInfo?.name}
            {selectedTafseerInfo?.authorName
              ? ` • ${selectedTafseerInfo.authorName}`
              : ""}
          </p>
        </div>

        {/* Ayahs */}
        <div className="space-y-6">
          {allVerses.map((verse) => {
            const arabic = verse.words
              ?.filter(
                (word: any) =>
                  word.charTypeName === "word" || word.charTypeName === "end",
              )
              .map((word: any) => word.textUthmani ?? "")
              .filter(Boolean)
              .join(" ");

            const tafseer =
              verse.tafsirs?.find(
                (item: any) => item.resourceId === selectedTafseer,
              )?.text ?? "";

            return (
              <TafseerAyahCard
                key={verse.id}
                number={verse.verseNumber}
                arabic={arabic ?? ""}
                tafseer={tafseer}
                tafseerName={selectedTafseerInfo?.name ?? "Tafseer"}
                language={selectedLanguage}
              />
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-stone-400">
          Tafseer data provided by Quran Foundation
        </p>
      </section>
    </main>
  );
}
