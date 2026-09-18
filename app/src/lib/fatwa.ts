export type FatwaCategory =
  | "Salah"
  | "Fasting"
  | "Zakat"
  | "Hajj & Umrah"
  | "Family"
  | "Business"
  | "General";

export type Fatwa = {
  id: string;
  slug: string;
  question: string;
  shortAnswer: string;
  category: FatwaCategory;
  scholar: string;
  date: string;
  reference: string;
  featured: boolean;
};

export const fatwas: Fatwa[] = [
  {
    id: "1",
    slug: "importance-of-prayer",
    question: "What is the importance of establishing Salah?",
    shortAnswer:
      "Salah is one of the fundamental acts of worship in Islam and is to be established regularly according to its prescribed times and conditions.",
    category: "Salah",
    scholar: "IlmHub Scholar",
    date: "September 12, 2026",
    reference: "Quran 4:103",
    featured: true,
  },
  {
    id: "2",
    slug: "fasting-and-travel",
    question: "Can a traveler postpone their fast during Ramadan?",
    shortAnswer:
      "Islam provides specific concessions for travelers regarding fasting. The details depend on the circumstances of the journey and should be considered according to Islamic guidance.",
    category: "Fasting",
    scholar: "IlmHub Scholar",
    date: "September 10, 2026",
    reference: "Quran 2:184–185",
    featured: true,
  },
  {
    id: "3",
    slug: "zakat-on-savings",
    question: "When is Zakat due on savings?",
    shortAnswer:
      "Zakat on qualifying wealth is subject to specific conditions, including reaching the applicable threshold and completion of the required period.",
    category: "Zakat",
    scholar: "IlmHub Scholar",
    date: "September 7, 2026",
    reference: "Quran 9:103",
    featured: false,
  },
  {
    id: "4",
    slug: "intention-for-salah",
    question: "Is intention necessary before Salah?",
    shortAnswer:
      "Intention is connected with acts of worship. The details concerning how intention is made should be understood according to established Islamic scholarship.",
    category: "Salah",
    scholar: "IlmHub Scholar",
    date: "September 5, 2026",
    reference: "Hadith & Fiqh Sources",
    featured: false,
  },
  {
    id: "5",
    slug: "business-transactions",
    question: "What principles should Muslims follow in business transactions?",
    shortAnswer:
      "Islamic business dealings are based on principles such as honesty, mutual consent, fulfilling agreements, and avoiding prohibited forms of transactions.",
    category: "Business",
    scholar: "IlmHub Scholar",
    date: "September 2, 2026",
    reference: "Quran 4:29",
    featured: true,
  },
  {
    id: "6",
    slug: "family-rights",
    question: "What are some important principles regarding family relationships?",
    shortAnswer:
      "Islam emphasizes kindness, justice, responsibility, and maintaining good relationships among family members.",
    category: "Family",
    scholar: "IlmHub Scholar",
    date: "August 29, 2026",
    reference: "Quran 4:19",
    featured: false,
  },
];

export const fatwaCategories: FatwaCategory[] = [
  "Salah",
  "Fasting",
  "Zakat",
  "Hajj & Umrah",
  "Family",
  "Business",
  "General",
];