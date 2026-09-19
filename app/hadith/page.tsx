import HadithHero from "@/app/components/hadith/HadithHero";
import HadithSearch from "@/app/components/hadith/HadithSearch";
import HadithCollectionCard from "@/app/components/hadith/HadithCollectionCard";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Hadith",
  description:
    "Explore authentic Hadith collections and study the teachings and traditions of the Prophet ﷺ.",
};

const collections = [
  {
    name: "Sahih al-Bukhari",
    arabicName: "صحيح البخاري",
    description:
      "A major collection of Hadith compiled by Imam al-Bukhari.",
    slug: "bukhari",
  },
  {
    name: "Sahih Muslim",
    arabicName: "صحيح مسلم",
    description:
      "One of the major collections of authentic Hadith compiled by Imam Muslim.",
    slug: "muslim",
  },
  {
    name: "Sunan Abu Dawud",
    arabicName: "سنن أبي داود",
    description:
      "A major Hadith collection with a strong focus on narrations related to Islamic rulings.",
    slug: "abudawud",
  },
  {
    name: "Jami` at-Tirmidhi",
    arabicName: "جامع الترمذي",
    description:
      "A well-known Hadith collection covering narrations, rulings, and scholarly commentary.",
    slug: "tirmidhi",
  },
  {
    name: "Sunan an-Nasa'i",
    arabicName: "سنن النسائي",
    description:
      "A respected collection of Hadith compiled by Imam an-Nasa'i.",
    slug: "nasai",
  },
  {
    name: "Sunan Ibn Majah",
    arabicName: "سنن ابن ماجه",
    description:
      "One of the major Sunni Hadith collections covering many subjects.",
    slug: "ibnmajah",
  },
];

export default function HadithPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <HadithHero />

      <HadithSearch />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#967438]">
            Collections
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-stone-900 md:text-3xl">
            Explore Hadith Collections
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Browse well-known Hadith collections and explore their books,
            chapters, and narrations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <HadithCollectionCard
              key={collection.slug}
              name={collection.name}
              arabicName={collection.arabicName}
              description={collection.description}
              hadithCount="Explore"
              slug={collection.slug}
            />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}