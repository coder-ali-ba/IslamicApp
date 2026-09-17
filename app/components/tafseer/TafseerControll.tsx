"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Languages,
  ChevronDown,
  Check,
} from "lucide-react";

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

  const [openDropdown, setOpenDropdown] = useState<
    "language" | "tafsir" | "surah" | null
  >(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);

    router.push(`/tafseer?${params.toString()}`, {
      scroll: false,
    });

    setOpenDropdown(null);
  };

  const filteredTafseers = tafseers.filter(
    (item) => item.language === selectedLanguage
  );

  const selectedTafseerData = tafseers.find(
    (item) => item.id === selectedTafseer
  );

  const selectedSurahData = surahs.find(
    (surah) => surah.id === selectedSurah
  );

  const languages = [
    {
      value: "urdu",
      label: "Urdu",
    },
    {
      value: "english",
      label: "English",
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 border-b border-stone-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
          <BookOpen size={17} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Tafseer Settings
          </h2>

          <p className="text-xs text-stone-500">
            Choose language, tafseer and Surah
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        {/* Language */}
        <CustomDropdown
          label="Language"
          icon={<Languages size={14} />}
          value={
            languages.find(
              (item) => item.value === selectedLanguage
            )?.label ?? "Select Language"
          }
          open={openDropdown === "language"}
          onToggle={() =>
            setOpenDropdown(
              openDropdown === "language"
                ? null
                : "language"
            )
          }
          options={languages.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          selectedValue={selectedLanguage}
          onSelect={(value) => {
            const firstTafseer = tafseers.find(
              (item) => item.language === value
            );

            const params = new URLSearchParams(
              searchParams.toString()
            );

            params.set("language", value);

            if (firstTafseer) {
              params.set(
                "tafsir",
                String(firstTafseer.id)
              );
            }

            router.push(
              `/tafseer?${params.toString()}`,
              {
                scroll: false,
              }
            );

            setOpenDropdown(null);
          }}
        />

        {/* Tafseer */}
        <CustomDropdown
          label="Tafseer"
          icon={<BookOpen size={14} />}
          value={
            selectedTafseerData?.name ??
            "Select Tafseer"
          }
          open={openDropdown === "tafsir"}
          onToggle={() =>
            setOpenDropdown(
              openDropdown === "tafsir"
                ? null
                : "tafsir"
            )
          }
          options={filteredTafseers.map((tafsir) => ({
            value: String(tafsir.id),
            label: tafsir.name,
            description: tafsir.authorName ?? undefined,
          }))}
          selectedValue={String(selectedTafseer)}
          onSelect={(value) =>
            updateParam("tafsir", value)
          }
        />

        {/* Surah */}
        <CustomDropdown
          label="Surah"
          icon={
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#b8944f] text-[8px]">
              S
            </span>
          }
          value={
            selectedSurahData
              ? `${selectedSurahData.id}. ${selectedSurahData.name}`
              : "Select Surah"
          }
          open={openDropdown === "surah"}
          onToggle={() =>
            setOpenDropdown(
              openDropdown === "surah"
                ? null
                : "surah"
            )
          }
          options={surahs.map((surah) => ({
            value: String(surah.id),
            label: `${surah.id}. ${surah.name}`,
            description: surah.arabic,
          }))}
          selectedValue={String(selectedSurah)}
          onSelect={(value) =>
            updateParam("surah", value)
          }
        />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Custom Dropdown */
/* -------------------------------- */

type DropdownOption = {
  value: string;
  label: string;
  description?: string;
};

type CustomDropdownProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: DropdownOption[];
  selectedValue: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

function CustomDropdown({
  label,
  icon,
  value,
  options,
  selectedValue,
  open,
  onToggle,
  onSelect,
}: CustomDropdownProps) {
  return (
    <div className="relative">

      {/* Label */}
      <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
        <span className="text-[#b8944f]">
          {icon}
        </span>

        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left transition-all duration-200 ${
          open
            ? "border-[#d6b56d] bg-white ring-4 ring-[#d6b56d]/10"
            : "border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white"
        }`}
      >
        <span className="truncate pr-3 text-sm font-medium text-stone-800">
          {value}
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-stone-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#b8944f]" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-stone-700 bg-stone-900 p-1.5 shadow-xl shadow-stone-950/20">

          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const selected =
                option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onSelect(option.value)
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-left transition-colors duration-150 ${
                    selected
                      ? "bg-stone-800 text-white"
                      : "text-stone-300 hover:bg-stone-700 hover:text-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {option.label}
                    </p>

                    {option.description && (
                      <p
                        className={`mt-0.5 truncate text-xs ${
                          selected
                            ? "text-stone-400"
                            : "text-stone-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    )}
                  </div>

                  {selected && (
                    <Check
                      size={16}
                      className="ml-3 shrink-0 text-[#d6b56d]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}