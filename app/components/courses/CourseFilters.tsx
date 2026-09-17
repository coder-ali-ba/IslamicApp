"use client";

import type {
  CourseCategory,
  CourseLevel,
} from "@/app/src/lib/course";

type CourseFiltersProps = {
  category: CourseCategory | "All";
  level: CourseLevel | "All";
  onCategoryChange: (
    category: CourseCategory | "All"
  ) => void;
  onLevelChange: (
    level: CourseLevel | "All"
  ) => void;
};

const categories: (CourseCategory | "All")[] = [
  "All",
  "Quran",
  "Hadith",
  "Arabic",
  "Fiqh",
  "Seerah",
  "Islamic Studies",
];

const levels: (CourseLevel | "All")[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function CourseFilters({
  category,
  level,
  onCategoryChange,
  onLevelChange,
}: CourseFiltersProps) {
  return (
    <div className="mb-10 flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === item
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-[#faf9f6] text-stone-600 hover:border-[#d6b56d]/50 hover:text-stone-900"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Level */}
      <select
        value={level}
        onChange={(e) =>
          onLevelChange(
            e.target.value as CourseLevel | "All"
          )
        }
        className="rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-[#d6b56d]"
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

