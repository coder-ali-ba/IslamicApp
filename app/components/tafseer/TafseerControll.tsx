"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TafseerResource = {
  id: number;
  name: string;
  language: string;
  authorName: string | null;
};

type Surah = {
  id: number;
  name: string;
  arabic: string;
};

type TafseerControlsProps = {
  tafseers: TafseerResource[];
  surahs: Surah[];
  selectedTafseer: number;
  selectedSurah: number;
  selectedLanguage: string;
};

export default function TafseerControls({
  tafseers,
  surahs,
  selectedTafseer,
  selectedSurah,
  selectedLanguage,
}: TafseerControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);

    router.push(`/tafseer?${params.toString()}`, {
      scroll: false,
    });
  };

  const filteredTafseers = tafseers.filter(
    (item) => item.language === selectedLanguage
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-3">
        {/* Language */}
        <div>
          <label
            htmlFor="language"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Language
          </label>

          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => {
              const language = e.target.value;

              const firstTafseer = tafseers.find(
                (item) => item.language === language
              );

              const params = new URLSearchParams(
                searchParams.toString()
              );

              params.set("language", language);

              if (firstTafseer) {
                params.set(
                  "tafsir",
                  String(firstTafseer.id)
                );
              }

              router.push(`/tafseer?${params.toString()}`, {
                scroll: false,
              });
            }}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          >
            <option value="urdu">Urdu</option>
            <option value="english">English</option>
          </select>
        </div>

        {/* Tafseer */}
        <div>
          <label
            htmlFor="tafsir"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Tafseer
          </label>

          <select
            id="tafsir"
            value={selectedTafseer}
            onChange={(e) =>
              updateParam("tafsir", e.target.value)
            }
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          >
            {filteredTafseers.map((tafsir) => (
              <option key={tafsir.id} value={tafsir.id}>
                {tafsir.name}
              </option>
            ))}
          </select>
        </div>

        {/* Surah */}
        <div>
          <label
            htmlFor="surah"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Surah
          </label>

          <select
            id="surah"
            value={selectedSurah}
            onChange={(e) =>
              updateParam("surah", e.target.value)
            }
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          >
            {surahs.map((surah) => (
              <option key={surah.id} value={surah.id}>
                {surah.id}. {surah.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}