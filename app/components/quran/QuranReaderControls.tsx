"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Resource = {
  id: number;
  name: string;
};

type QuranReaderControlsProps = {
  translations: Resource[];
  selectedTranslation: number;
};

export default function QuranReaderControls({
  translations,
  selectedTranslation,
}: QuranReaderControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateTranslation = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("translation", value);

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="max-w-md">
        <label
          htmlFor="translation"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Translation
        </label>

        <select
          id="translation"
          value={selectedTranslation}
          onChange={(e) => updateTranslation(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
        >
          {translations.map((translation) => (
            <option key={translation.id} value={translation.id}>
              {translation.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}