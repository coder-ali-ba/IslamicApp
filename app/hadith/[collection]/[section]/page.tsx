import Link from "next/link";
import HadithSearch from "@/app/components/hadith/OneHadithSearch";

type HadithGrade = {
  name?: string;
  grade?: string;
};

type Hadith = {
  hadithnumber: string | number;
  text: string;
  grades?: HadithGrade[];
};

type SectionResponse = {
  metadata?: {
    name?: string;
    section?: Record<string, string>;
  };
  hadiths?: Hadith[];
};

type CombinedHadith = {
  hadithnumber: string | number;
  arabic: string;
  english: string;
  urdu: string;
  grades: string[];
};

async function getBook(
  collection: string,
  section: string,
  language: "ara" | "eng" | "urd"
): Promise<SectionResponse | null> {
  const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${language}-${collection}/sections/${section}.json`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch ${language}-${collection} section ${section}:`,
      error
    );

    return null;
  }
}

/**
 * Converts API grade text into a clean display value.
 */
function formatGrade(grade: string): string {
  const value = grade.toLowerCase().trim();

  if (
    value.includes("sahih") ||
    value.includes("ṣaḥīḥ") ||
    value.includes("صحيح") ||
    value.includes("صحیح")
  ) {
    return "صحیح (Sahih)";
  }

  if (
    value.includes("hasan") ||
    value.includes("ḥasan") ||
    value.includes("حسن")
  ) {
    return "حسن (Hasan)";
  }

  if (
    value.includes("daif") ||
    value.includes("da'eef") ||
    value.includes("ḍaʿīf") ||
    value.includes("weak") ||
    value.includes("ضعيف") ||
    value.includes("ضعیف")
  ) {
    return "ضعیف (Da'eef)";
  }

  return grade;
}

/**
 * Collection slug -> readable name
 */
function getCollectionName(collection: string): string {
  const collections: Record<string, string> = {
    bukhari: "Sahih al-Bukhari",
    muslim: "Sahih Muslim",
    abudawud: "Sunan Abu Dawud",
    tirmidhi: "Jami At-Tirmidhi",
    nasai: "Sunan an-Nasa'i",
    ibnmajah: "Sunan Ibn Majah",
  };

  return collections[collection] || collection;
}

export default async function HadithSectionPage({
  params,
}: {
  params: Promise<{
    collection: string;
    section: string;
  }>;
}) {
  const { collection, section } = await params;

  /**
   * Fetch Arabic, English and Urdu together.
   */
  const [arabicData, englishData, urduData] = await Promise.all([
    getBook(collection, section, "ara"),
    getBook(collection, section, "eng"),
    getBook(collection, section, "urd"),
  ]);

  /**
   * English is used as the main Hadith list because
   * numbering matches the Arabic/Urdu editions.
   */
  const englishHadiths = englishData?.hadiths ?? [];
  const arabicHadiths = arabicData?.hadiths ?? [];
  const urduHadiths = urduData?.hadiths ?? [];

  /**
   * Arabic lookup by Hadith number.
   */
  const arabicMap = new Map(
    arabicHadiths.map((hadith) => [
      String(hadith.hadithnumber),
      hadith.text,
    ])
  );

  /**
   * Urdu lookup by Hadith number.
   */
  const urduMap = new Map(
    urduHadiths.map((hadith) => [
      String(hadith.hadithnumber),
      hadith.text,
    ])
  );

  /**
   * Combine all three languages + grades.
   */
  const hadiths: CombinedHadith[] = englishHadiths.map((hadith) => {
    const grades =
      hadith.grades
        ?.map((item) => item.grade?.trim())
        .filter(
          (grade): grade is string =>
            Boolean(grade)
        )
        .map(formatGrade) ?? [];

    /**
     * Remove duplicate grades.
     */
    const uniqueGrades = [...new Set(grades)];

    return {
      hadithnumber: hadith.hadithnumber,
      english: hadith.text,
      arabic:
        arabicMap.get(String(hadith.hadithnumber)) ?? "",
      urdu:
        urduMap.get(String(hadith.hadithnumber)) ?? "",
      grades: uniqueGrades,
    };
  });

  /**
   * Get section/book name.
   */
  const bookName =
    englishData?.metadata?.section?.[section] ||
    arabicData?.metadata?.section?.[section] ||
    urduData?.metadata?.section?.[section] ||
    englishData?.metadata?.name ||
    `Book ${section}`;

  const collectionName = getCollectionName(collection);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-stone-800 bg-stone-950 text-white">
  {/* Decorative Rings */}
  <div className="pointer-events-none absolute -right-44 -top-44 h-[500px] w-[500px] rounded-full border border-[#d6b56d]/10" />

  <div className="pointer-events-none absolute -right-24 -top-24 h-[340px] w-[340px] rounded-full border border-[#d6b56d]/10" />

  <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#d6b56d]/5 blur-3xl" />

  {/* Islamic Pattern */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
    <svg
      className="h-full w-full"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 0V200M0 100H200M29 29L171 171M171 29L29 171"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="currentColor"
        strokeWidth="1"
      />

      <circle
        cx="100"
        cy="100"
        r="40"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M50 50L150 150M150 50L50 150"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  </div>

  {/* Content */}
  <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">

    {/* Breadcrumb */}
    <div className="mb-7 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
      <Link
        href="/hadith"
        className="text-stone-400 transition-colors hover:text-[#d6b56d]"
      >
        Hadith
      </Link>

      <span className="text-stone-600">/</span>

      <span className="text-stone-400">
        {collectionName}
      </span>

      <span className="text-stone-600">/</span>

      <span className="font-medium text-stone-300">
        {bookName}
      </span>
    </div>

    {/* Collection Label */}
    <div className="mb-5 flex items-center gap-3">
      <div className="h-px w-8 bg-[#d6b56d]" />

      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#d6b56d]">
        {collectionName}
      </p>
    </div>

    {/* Book Title */}
    <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
      {bookName}
    </h1>

    {/* Description */}
    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
      Explore the narrations and teachings contained in this
      section of the Hadith collection.
    </p>

    {/* Hadith Count */}
    <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-sm">
      <span className="h-2 w-2 rounded-full bg-[#d6b56d]" />

      <span className="text-sm text-stone-300">
        {hadiths.length} Hadiths
      </span>
    </div>

    {/* Bottom Accent */}
    <div className="mt-9 flex items-center gap-3">
      <div className="h-px w-12 bg-[#d6b56d]" />
      <div className="h-1.5 w-1.5 rounded-full bg-[#d6b56d]" />
      <div className="h-px w-24 bg-stone-800" />
    </div>
  </div>
</section>

      {/* Hadith list */}
      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        {hadiths.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-stone-700">
              No Hadiths found
            </p>

            <p className="mt-2 text-sm text-stone-500">
              This section does not contain any Hadiths.
            </p>
          </div>
        ) : (
          <HadithSearch hadiths={hadiths} />
        )}
      </section>
    </main>
  );
}

