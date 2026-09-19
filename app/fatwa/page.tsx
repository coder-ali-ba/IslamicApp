"use client";

import { useState } from "react";

import FatwaHero from "@/app/components/fatwa/FatwaHero";
import FatwaCategories from "@/app/components/fatwa/FatwaCategories";
import FatwaSearch from "@/app/components/fatwa/FatwaSearch";
import AskFatwaForm from "@/app/components/fatwa/AskFatwaForm";
import FatwaCard from "@/app/components/fatwa/FatwaCard";

import {
  fatwas,
  fatwaCategories,
  type FatwaCategory,
} from "@/app/src/lib/fatwa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FatwaPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<FatwaCategory | "All">("All");

  const featuredFatwas = fatwas.filter(
    (fatwa) => fatwa.featured
  );

  const handleCategorySelect = (
    category: FatwaCategory | "All"
  ) => {
    setSelectedCategory(category);

    document
      .getElementById("fatwas")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-900">
      <Navbar />
      <FatwaHero />

      <FatwaCategories
        categories={fatwaCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 md:pb-18 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
              Featured Guidance
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Explore selected questions
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
              Browse selected Islamic questions and their brief answers.
            </p>
          </div>

          <div className="hidden h-px w-24 bg-[#d6b56d] sm:block" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredFatwas.map((fatwa) => (
            <FatwaCard key={fatwa.id} fatwa={fatwa} />
          ))}
        </div>
      </section>

      {/* All Fatwas */}
      <section
        id="fatwas"
        className="scroll-mt-20 border-t border-stone-200 bg-stone-100/60"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-18 lg:px-8">
          <FatwaSearch
            fatwas={fatwas}
            categories={fatwaCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Ask */}
      <section
        id="ask"
        className="border-t border-stone-200 bg-stone-100/60"
      >
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
              Ask a Fatwa
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Have a question?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-500">
              Share your question with enough context for it to be
              understood clearly.
            </p>
          </div>

          <AskFatwaForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}