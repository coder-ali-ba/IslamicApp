"use client";

import { TeacherSubject } from "@/app/src/lib/teachers";

type TeacherFiltersProps = {
  subject: "All" | TeacherSubject;
  onSubjectChange: (value: "All" | TeacherSubject) => void;
};

const subjects: Array<"All" | TeacherSubject> = [
  "All",
  "Quran",
  "Tajweed",
  "Hadith",
  "Arabic",
  "Fiqh",
  "Seerah",
  "Islamic Studies",
];

export default function TeacherFilters({
  subject,
  onSubjectChange,
}: TeacherFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {subjects.map((item) => {
          const active = subject === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSubjectChange(item)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-stone-900 text-white"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-stone-400">
        Find an instructor for your learning journey.
      </p>
    </div>
  );
}