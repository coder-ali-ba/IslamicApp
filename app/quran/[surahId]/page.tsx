import { quranClient } from "@/app/src/lib/quran";
import SurahHeader from "@/app/components/quran/SurahHeader";
import AyahCard from "@/app/components/quran/AyahCard";
import QuranReaderControls from "@/app/components/quran/QuranReaderControls";
import { surahs } from "@/app/src/lib/surah";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{
    surahId: string;
  }>;

  searchParams: Promise<{
    translation?: string;
  }>;
};

export default async function SurahPage({
  params,
  searchParams,
}: Props) {
  const { surahId } = await params;
  const query = await searchParams;

  const id = Number(surahId);

  const surah = surahs.find((item) => item.id === id);

  if (!surah) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">
            Surah not found
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            The requested Surah does not exist.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Translation IDs
   *
   * 234 = Fatah Muhammad Jalandhari (Urdu)
   * 85  = M.A.S. Abdel Haleem (English)
   */

  const allowedTranslationIds = [234, 85];

  const requestedTranslation = Number(query.translation);

  const selectedTranslation = allowedTranslationIds.includes(
    requestedTranslation
  )
    ? requestedTranslation
    : 234;

  // Get available translation resources
  const translationResources =
    await quranClient.content.v4.resources.translations.list();

  const translations = translationResources
    .filter((item: any) =>
      allowedTranslationIds.includes(item.id)
    )
    .map((item: any) => ({
      id: item.id,
      name: item.name,
    }));

  // Get verses
  const allVerses: any[] = [];

  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response =
      await quranClient.content.v4.verses.byChapter(
        surahId,
        {
          words: true,

          wordFields: {
            textUthmani: true,
          },

          translations: [selectedTranslation],

          audio: 7,

          page,

          perPage: 50,
        }
      );

    const verses = Array.isArray(response)
      ? response
      : response?.verses ?? [];

    allVerses.push(...verses);

    if (
      allVerses.length >= surah.verses ||
      verses.length === 0
    ) {
      hasMore = false;
    } else {
      page++;
    }
  }

  const selectedTranslationName =
    translations.find(
      (item) => item.id === selectedTranslation
    )?.name ?? "Translation";

  return (
    <main
      className="min-h-screen bg-[#faf9f6]"
      translate="no"
    >
      <Navbar />
      <SurahHeader
        number={surah.id}
        name={surah.name}
        arabicName={surah.arabic}
        versesCount={surah.verses}
        revelation={surah.revelation}
      />

      <section className="mx-auto max-w-4xl px-6 py-10">
        {/* Translation selector */}
        <QuranReaderControls
          translations={translations}
          selectedTranslation={selectedTranslation}
        />

        {/* Ayahs */}
        <div className="space-y-6">
          {allVerses.map((verse) => {
            /*
             * Build Arabic text from words
             */
            const arabic = verse.words
              ?.filter(
                (word: any) =>
                  word.charTypeName === "word" ||
                  word.charTypeName === "end"
              )
              .map(
                (word: any) =>
                  word.textUthmani ?? ""
              )
              .filter(Boolean)
              .join(" ");

            /*
             * Selected translation
             */
            const translation =
              verse.translations?.find(
                (item: any) =>
                  item.resourceId ===
                  selectedTranslation
              )?.text ?? "";

            return (
              <AyahCard
                key={verse.id}
                number={verse.verseNumber}
                arabic={arabic ?? ""}
                translation={translation}
                translationName={selectedTranslationName}
                audioUrl={verse.audio?.url ?? ""}
              />
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-stone-400">
          Quran data provided by Quran Foundation
        </p>
      </section>
      <Footer />
    </main>
  );
}