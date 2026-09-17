export type ClassCategory =
  | "Quran"
  | "Tajweed"
  | "Arabic"
  | "Hadith"
  | "Fiqh";

export type ClassLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type ClassStatus =
  | "Upcoming"
  | "Live";

export type IslamicClass = {
  id: string;
  title: string;
  description: string;
  category: ClassCategory;
  level: ClassLevel;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  students: number;
  maxStudents: number;
  price: number;
  image: string;
  status: ClassStatus;
  featured: boolean;
};

export const classes: IslamicClass[] = [
  {
    id: "quran-reading-live",
    title: "Quran Reading Live Class",
    description:
      "Learn Quran reading with guided live sessions and personal correction from an experienced instructor.",
    category: "Quran",
    level: "Beginner",
    instructor: "Ustadh Muhammad Ahmed",
    date: "Saturday, 20 September 2026",
    time: "07:00 PM",
    duration: "60 min",
    students: 18,
    maxStudents: 25,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
  },

  {
    id: "tajweed-live-session",
    title: "Tajweed Correction Session",
    description:
      "Improve your Quran recitation through live Tajweed practice and direct instructor feedback.",
    category: "Tajweed",
    level: "Intermediate",
    instructor: "Ustadh Abdul Rahman",
    date: "Sunday, 21 September 2026",
    time: "08:00 PM",
    duration: "60 min",
    students: 21,
    maxStudents: 25,
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
  },

  {
    id: "arabic-speaking-class",
    title: "Arabic Speaking Practice",
    description:
      "Practice conversational Arabic in a small live group and build confidence step by step.",
    category: "Arabic",
    level: "Beginner",
    instructor: "Ustadh Omar Farooq",
    date: "Monday, 22 September 2026",
    time: "06:30 PM",
    duration: "75 min",
    students: 14,
    maxStudents: 20,
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1543109740-4bdb38fda756?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
  },

  {
    id: "hadith-study-circle",
    title: "Hadith Study Circle",
    description:
      "Study selected authentic Hadith and discuss their meanings, lessons and practical applications.",
    category: "Hadith",
    level: "Intermediate",
    instructor: "Dr. Ibrahim Khan",
    date: "Tuesday, 23 September 2026",
    time: "07:30 PM",
    duration: "60 min",
    students: 16,
    maxStudents: 25,
    price: 1700,
    image:
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: true,
  },

  {
    id: "fiqh-for-everyday-life",
    title: "Fiqh for Everyday Life",
    description:
      "Learn essential everyday Fiqh topics in a simple and structured live learning environment.",
    category: "Fiqh",
    level: "Beginner",
    instructor: "Mufti Abdullah",
    date: "Wednesday, 24 September 2026",
    time: "08:00 PM",
    duration: "60 min",
    students: 19,
    maxStudents: 25,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
  },

  {
    id: "advanced-tajweed-workshop",
    title: "Advanced Tajweed Workshop",
    description:
      "An intensive live workshop focused on advanced recitation rules and practical correction.",
    category: "Tajweed",
    level: "Advanced",
    instructor: "Ustadh Abdul Rahman",
    date: "Thursday, 25 September 2026",
    time: "08:30 PM",
    duration: "90 min",
    students: 12,
    maxStudents: 15,
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?auto=format&fit=crop&w=1200&q=80",
    status: "Upcoming",
    featured: false,
  },
];