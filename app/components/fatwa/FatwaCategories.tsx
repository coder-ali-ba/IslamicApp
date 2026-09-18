"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  Coins,
  HeartHandshake,
  Moon,
  Plane,
} from "lucide-react";

import type { FatwaCategory } from "@/app/src/lib/fatwa";

type FatwaCategoriesProps = {
  categories: FatwaCategory[];
  selectedCategory: FatwaCategory | "All";
  onCategorySelect: (category: FatwaCategory | "All") => void;
};

const categoryIcons = {
  Salah: BookOpen,
  Fasting: Moon,
  Zakat: Coins,
  "Hajj & Umrah": Plane,
  Family: HeartHandshake,
  Business: BriefcaseBusiness,
  General: CircleHelp,
};

const categoryDescriptions = {
  Salah: "Prayer and worship",
  Fasting: "Ramadan and fasting",
  Zakat: "Zakat and charity",
  "Hajj & Umrah": "Hajj and Umrah guidance",
  Family: "Marriage and family",
  Business: "Business and transactions",
  General: "General Islamic questions",
};

export default function FatwaCategories({
  categories,
  selectedCategory,
  onCategorySelect,
}: FatwaCategoriesProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-18 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
            Browse by Topic
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Find guidance by category
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
            Explore Islamic questions based on the area of life or worship
            you want to learn about.
          </p>
        </div>

        <div className="hidden h-px w-24 bg-[#d6b56d] sm:block" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategorySelect(category)}
              className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
                isSelected
                  ? "border-[#d6b56d] bg-stone-900 text-white shadow-lg shadow-stone-900/10"
                  : "border-stone-200 bg-white text-stone-900 hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-[#d6b56d]/15 text-[#d6b56d]"
                      : "bg-stone-100 text-[#967438] group-hover:bg-[#d6b56d]/10"
                  }`}
                >
                  <Icon size={19} />
                </div>

                <ChevronRight
                  size={17}
                  className={`mt-1 transition-transform duration-200 ${
                    isSelected
                      ? "translate-x-1 text-[#d6b56d]"
                      : "text-stone-300 group-hover:translate-x-1 group-hover:text-stone-500"
                  }`}
                />
              </div>

              <h3
                className={`mt-5 text-base font-semibold ${
                  isSelected ? "text-white" : "text-stone-900"
                }`}
              >
                {category}
              </h3>

              <p
                className={`mt-1.5 text-xs leading-5 ${
                  isSelected ? "text-stone-400" : "text-stone-500"
                }`}
              >
                {categoryDescriptions[category]}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}