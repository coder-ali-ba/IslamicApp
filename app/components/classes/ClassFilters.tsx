"use client";

import type {
  ClassCategory,
  ClassLevel,
} from "@/app/src/lib/classes";

type ClassFiltersProps = {
  category: ClassCategory | "All";
  level: ClassLevel | "All";
  onCategoryChange: (
    value: ClassCategory | "All"
  ) => void;
  onLevelChange: (
    value: ClassLevel | "All"
  ) => void;
};

const categories: Array<ClassCategory | "All"> = [
  "All",
  "Quran",
  "Tajweed",
  "Arabic",
  "Hadith",
  "Fiqh",
];

const levels: Array<ClassLevel | "All"> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function ClassFilters({
  category,
  level,
  onCategoryChange,
  onLevelChange,
}: ClassFiltersProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-stone-200 pb-7 lg:flex-row lg:items-center lg:justify-between">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => {
          const active = category === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Level */}
      <select
        value={level}
        onChange={(e) =>
          onLevelChange(
            e.target.value as ClassLevel | "All"
          )
        }
        className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-[#967438]"
      >
        {levels.map((item) => (
          <option key={item} value={item}>
            {item === "All"
              ? "All Levels"
              : item}
          </option>
        ))}
      </select>
    </div>
  );
}