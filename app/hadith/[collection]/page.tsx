import BooksSearch from "@/app/components/hadith/BookSearch";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type CollectionPageProps = {
  params: Promise<{
    collection: string;
  }>;
};
type Props = {
  params: Promise<{
    collection: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { collection } = await params;

  const collectionName = collection
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${collectionName} Hadith`,
    description: `Explore and study Hadith from the ${collectionName} collection on IlmHub.`,
  };
}

type Book = {
  number: number;
  arabic: string;
  urdu: string;
  english: string;
};

const collectionNames: Record<string, string> = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  abudawud: "Sunan Abu Dawud",
  tirmidhi: "Jami At-Tirmidhi",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
};

/**
 * Parse CSV-style .toon rows.
 * Handles quoted values and commas inside quotes.
 */
function parseToonRow(line: string): string[] {
  const result: string[] = [];

  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  return result;
}

async function getBooks(collection: string): Promise<Book[]> {
  try {
    const url = `https://cdn.jsdelivr.net/gh/HsnSaboor/hadith-api-toon@main/editions/${collection}/info.toon`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch Hadith book information:",
        response.status,
      );

      return [];
    }

    const text = await response.text();

    /**
     * Example:
     *
     * sections[97]{id,name,name_ar,...,name_en,...,name_ur,...}:
     *
     * 1,"Revelation","بدء الوحي",...,"Revelation",...,"وحی کی ابتدا",...
     */

    const sectionsMatch = text.match(
      /sections\[\d+\]\{([^}]+)\}:\s*\n?([\s\S]*?)(?=\n(?:translations|$)|$)/,
    );

    if (!sectionsMatch) {
      console.error("Sections data not found in info.toon");

      return [];
    }

    const columns = sectionsMatch[1].split(",").map((column) => column.trim());

    const sectionData = sectionsMatch[2]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const idIndex = columns.indexOf("id");
    const nameArIndex = columns.indexOf("name_ar");
    const nameEnIndex = columns.indexOf("name_en");
    const nameUrIndex = columns.indexOf("name_ur");

    if (
      idIndex === -1 ||
      nameArIndex === -1 ||
      nameEnIndex === -1 ||
      nameUrIndex === -1
    ) {
      console.error("Required multilingual title fields are missing.");

      return [];
    }

    return sectionData
      .map((line) => {
        const values = parseToonRow(line);

        const number = Number(values[idIndex]);

        if (!number) {
          return null;
        }

        return {
          number,

          // Arabic
          arabic: values[nameArIndex] || "",

          // Urdu script
          urdu: values[nameUrIndex] || "",

          // English
          english: values[nameEnIndex] || "",
        };
      })
      .filter((book): book is Book => book !== null);
  } catch (error) {
    console.error("Failed to load Hadith book information:", error);

    return [];
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;

  const collectionName = collectionNames[collection] || collection;

  const books = await getBooks(collection);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-stone-800 bg-stone-900 text-white">
        {/* Decorative Rings */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full border border-[#d6b56d]/10" />

        <div className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full border border-[#d6b56d]/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#d6b56d]/5 blur-3xl" />

        {/* Islamic Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
        linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
        linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
        linear-gradient(30deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d),
        linear-gradient(150deg, #d6b56d 12%, transparent 12.5%, transparent 87%, #d6b56d 87.5%, #d6b56d)
      `,
            backgroundSize: "80px 140px",
            backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Link
              href="/hadith"
              className="text-stone-400 transition-colors mb-12 hover:text-[#d6b56d]"
            >
              
             Back to Hadith
            </Link>
          <div className="max-w-3xl">
             
            {/* Label */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b56d]/25 bg-[#d6b56d]/10">
                <BookOpen
                  className="h-4 w-4 text-[#d6b56d]"
                  strokeWidth={1.8}
                />
              </div>

              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#d6b56d]">
                Hadith Collection
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {collectionName}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
              Browse the books and chapters of this Hadith collection and
              explore its narrations in a clear and organized way.
            </p>

            {/* Bottom Accent */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-12 bg-[#d6b56d]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
              <div className="h-px w-20 bg-stone-700" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOKS
      ===================================================== */}

      <section className=" py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-900">Books</h2>

            <p className="mt-2 text-sm text-stone-500">
              Select a book to explore its Hadiths.
            </p>
          </div>

          {books.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
              <BookOpen size={38} className="mx-auto text-stone-300" />

              <p className="mt-4 text-stone-500">Books could not be loaded.</p>
            </div>
          ) : (
            <BooksSearch books={books} collection={collection} />
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
