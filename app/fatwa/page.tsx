"use client";

import { useEffect, useMemo, useState } from "react";

import FatwaHero from "@/app/components/fatwa/FatwaHero";
import FatwaCategories from "@/app/components/fatwa/FatwaCategories";
import FatwaSearch from "@/app/components/fatwa/FatwaSearch";
import AskFatwaForm from "@/app/components/fatwa/AskFatwaForm";
import FatwaCard from "../components/fatwa/FatwaCard";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { fatwaCategories, type FatwaCategory } from "@/app/src/lib/fatwa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";



type ApiFatwa = {
  _id: string;
  question: string;
  shortAnswer?: string;
  answer?: string;
  category: FatwaCategory;
  scholar?: FatwaScholar | null;
  primaryReference?: string;
  additionalReferences?: string;
  slug: string;
  createdAt: string;
};

type UiFatwa = {
  id: string;
  question: string;
  shortAnswer: string;
  answer: string;
  category: FatwaCategory;
  scholar?: string | null;
  primaryReference: string;
  additionalReferences: string;
  slug: string;
  createdAt: string;
  featured: boolean;
};

export default function FatwaPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    FatwaCategory | "All"
  >("All");

  const [fatwas, setFatwas] = useState<UiFatwa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFatwas = async (
    category: FatwaCategory | "All" = selectedCategory,
    search = "",
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (category !== "All") {
        params.set("category", category);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/fatwas${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to load fatwas.");
      }

      const mappedFatwas: UiFatwa[] = (
        Array.isArray(data.fatwas) ? data.fatwas : []
      ).map((fatwa: ApiFatwa, index: number) => ({
        id: fatwa._id,
        question: fatwa.question,
        shortAnswer: fatwa.shortAnswer || fatwa.answer || "",
        answer: fatwa.answer || "",
        category: fatwa.category,

        // IMPORTANT:
        // Existing FatwaCard expects scholar as text,
        // while backend returns { _id, name, role }.
        scholar:
          typeof fatwa.scholar === "object" && fatwa.scholar !== null
            ? fatwa.scholar.name || "Scholar"
            : null,

        primaryReference: fatwa.primaryReference || "",

        additionalReferences: fatwa.additionalReferences || "",

        slug: fatwa.slug,
        createdAt: fatwa.createdAt,

        featured: index < 3,
      }));

      setFatwas(mappedFatwas);
    } catch (err) {
      console.error("Fatwa fetch error:", err);

      setError(err instanceof Error ? err.message : "Unable to load fatwas.");

      setFatwas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFatwas("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featuredFatwas = useMemo(() => {
    return fatwas.filter((fatwa) => fatwa.featured);
  }, [fatwas]);

  const handleCategorySelect = (category: FatwaCategory | "All") => {
    setSelectedCategory(category);

    fetchFatwas(category);

    document.getElementById("fatwas")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCategoryChange = (category: FatwaCategory | "All") => {
    setSelectedCategory(category);
    fetchFatwas(category);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-900">
      <Navbar />

      {/* Hero */}
      <FatwaHero />

      {/* Categories */}
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

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-stone-200/70"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700">
            {error}
          </div>
        ) : featuredFatwas.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredFatwas.map((fatwa) => (
              <FatwaCard key={fatwa.id} fatwa={fatwa} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center">
            <p className="text-sm text-stone-500">
              No published fatwas are available yet.
            </p>
          </div>
        )}
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
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Ask */}
      <section id="ask" className="border-t border-stone-200 bg-stone-100/60">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#967438]">
              Ask a Fatwa
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Have a question?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-500">
              Share your question with enough context for it to be understood
              clearly.
            </p>
          </div>

          <AskFatwaForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
