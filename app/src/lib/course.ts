export type CourseCategory =
  | "Quran"
  | "Hadith"
  | "Arabic"
  | "Fiqh"
  | "Seerah"
  | "Islamic Studies";

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type CourseInstructor = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "scholar" | "admin";
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  instructor: CourseInstructor;
  duration: string;
  lessons: number;
  students: number;
  price: number;
  image: string;
  featured: boolean;
  status?: "Draft" | "Published";
};

export const courses: Course[] = [
  {
    id: "quran-reading",
    title: "Learn Quran Reading",
    description:
      "Learn how to read the Quran correctly from the basics with proper pronunciation and guidance.",
    category: "Quran",
    level: "Beginner",
    instructor: "Ustadh Muhammad Ahmed",
    duration: "8 Weeks",
    lessons: 32,
    students: 1240,
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "quran-tajweed",
    title: "Quran with Tajweed",
    description:
      "Improve your Quran recitation by learning the essential rules of Tajweed step by step.",
    category: "Quran",
    level: "Intermediate",
    instructor: "Ustadh Abdul Rahman",
    duration: "10 Weeks",
    lessons: 40,
    students: 980,
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1542816417-098367d8f6b0?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "understanding-hadith",
    title: "Understanding Hadith",
    description:
      "Explore selected authentic Hadith and learn how they guide everyday Muslim life.",
    category: "Hadith",
    level: "Intermediate",
    instructor: "Dr. Ibrahim Khan",
    duration: "6 Weeks",
    lessons: 24,
    students: 760,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "arabic-basics",
    title: "Arabic Language Basics",
    description:
      "Build a strong foundation in Arabic vocabulary, grammar and sentence formation.",
    category: "Arabic",
    level: "Beginner",
    instructor: "Ustadh Omar Farooq",
    duration: "12 Weeks",
    lessons: 48,
    students: 1450,
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1544931673-9f0b7a9f3a1f?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    id: "daily-fiqh",
    title: "Essential Fiqh for Muslims",
    description:
      "Learn the essential rulings related to worship and everyday Muslim life.",
    category: "Fiqh",
    level: "Beginner",
    instructor: "Mufti Abdullah",
    duration: "8 Weeks",
    lessons: 30,
    students: 1120,
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    id: "seerah-prophet",
    title: "Life of the Prophet ﷺ",
    description:
      "Study the life, character and major events from the Seerah of Prophet Muhammad ﷺ.",
    category: "Seerah",
    level: "Beginner",
    instructor: "Dr. Hamza Malik",
    duration: "8 Weeks",
    lessons: 28,
    students: 1680,
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=80",
    featured: true,
  },
  {
    id: "islamic-foundations",
    title: "Islamic Foundations",
    description:
      "A complete introduction to the core beliefs, worship and principles of Islam.",
    category: "Islamic Studies",
    level: "Beginner",
    instructor: "Ustadh Yusuf Ali",
    duration: "10 Weeks",
    lessons: 36,
    students: 890,
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
  {
    id: "advanced-tafsir",
    title: "Introduction to Tafsir",
    description:
      "Learn how scholars approach Quranic interpretation and explore selected passages.",
    category: "Quran",
    level: "Advanced",
    instructor: "Dr. Bilal Hassan",
    duration: "12 Weeks",
    lessons: 44,
    students: 520,
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
    featured: false,
  },
];

