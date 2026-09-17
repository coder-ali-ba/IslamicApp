import HadithHero from "@/app/components/hadith/HadithHero";
import HadithSearch from "../components/hadith/HadithSearch";
import HadithCollectionCard from "../components/hadith/HadithCollectionCard";
import HadithReader from "../components/hadith/HadithReader";
const collections = [
  {
    name: "Sahih al-Bukhari",
    arabicName: "صحيح البخاري",
    description:
      "One of the most widely studied collections of authentic Hadith.",
    hadithCount: "7,500+",
    slug: "bukhari",
  },
  {
    name: "Sahih Muslim",
    arabicName: "صحيح مسلم",
    description:
      "A major collection of authentic sayings and traditions of the Prophet ﷺ.",
    hadithCount: "7,500+",
    slug: "muslim",
  },
  {
    name: "Sunan Abu Dawud",
    arabicName: "سنن أبي داود",
    description:
      "A renowned collection with a strong focus on Hadith related to Islamic rulings.",
    hadithCount: "5,200+",
    slug: "abu-dawud",
  },
  {
    name: "Jami` at-Tirmidhi",
    arabicName: "جامع الترمذي",
    description:
      "A comprehensive collection covering Hadith, rulings, and scholarly commentary.",
    hadithCount: "3,900+",
    slug: "tirmidhi",
  },
  {
    name: "Sunan an-Nasa'i",
    arabicName: "سنن النسائي",
    description:
      "A respected Hadith collection known for its detailed treatment of narrations.",
    hadithCount: "5,700+",
    slug: "nasai",
  },
  {
    name: "Sunan Ibn Majah",
    arabicName: "سنن ابن ماجه",
    description:
      "One of the major Sunni Hadith collections containing narrations across many subjects.",
    hadithCount: "4,300+",
    slug: "ibn-majah",
  },
];

export default function HadithPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <HadithHero />
      <HadithSearch />
      <section className="mx-auto max-w-6xl px-6 pb-16">
  <div className="mb-8">
    <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#967438]">
      Collections
    </p>

    <h2 className="mt-2 text-2xl font-semibold text-stone-900 md:text-3xl">
      Hadith Collections
    </h2>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
      Explore well-known collections of Hadith and discover
      narrations organized by their original sources.
    </p>
  </div>

  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {collections.map((collection) => (
      <HadithCollectionCard
        key={collection.slug}
        {...collection}
      />
    ))}
  </div>
</section>
<section className="mx-auto max-w-4xl px-6 pb-20">
  <div className="mb-8">
    <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#967438]">
      Hadith Reader
    </p>

    <h2 className="mt-2 text-2xl font-semibold text-stone-900 md:text-3xl">
      Read Hadith
    </h2>
  </div>

  <HadithReader
    hadithNumber="1"
    arabic="إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ"
    translation="Actions are judged by intentions, and every person will have what they intended."
    collectionName="Sahih al-Bukhari"
    bookName="Revelation"
    chapterName="How the Divine Revelation started"
    language="english"
  />
</section>
    </main>
  );
}