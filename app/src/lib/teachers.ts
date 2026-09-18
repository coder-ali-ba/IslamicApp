export type TeacherSubject =
  | "Quran"
  | "Tajweed"
  | "Hadith"
  | "Arabic"
  | "Fiqh"
  | "Seerah"
  |"Islamic Studies";

export type Teacher = {
  id: string;
  name: string;
  title: string;
  bio: string;
  subjects: TeacherSubject[];
  qualification: string;
  experience: string;
  students: number;
  courses: number;
  classes: number;
  image: string;
  featured: boolean;
};

export const teachers: Teacher[] = [
  {
    id: "muhammad-ahmed",
    name: "Ustadh Muhammad Ahmed",
    title: "Quran & Quran Reading Instructor",
    bio: "Experienced Quran instructor helping students improve their reading, pronunciation, and connection with the Quran.",
    subjects: ["Quran", "Tajweed"],
    qualification: "Quran & Islamic Studies",
    experience: "8+ Years",
    students: 1240,
    courses: 2,
    classes: 4,
    image:
      "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },

  {
    id: "abdul-rahman",
    name: "Ustadh Abdul Rahman",
    title: "Tajweed & Quran Recitation Instructor",
    bio: "Specialized in Tajweed and Quran recitation with a focus on practical correction and improving students' recitation.",
    subjects: ["Tajweed", "Quran"],
    qualification: "Tajweed & Quranic Studies",
    experience: "10+ Years",
    students: 980,
    courses: 1,
    classes: 5,
    image:
      "https://images.unsplash.com/photo-1542816417-098367d5e6d0?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },

  {
    id: "ibrahim-khan",
    name: "Dr. Ibrahim Khan",
    title: "Hadith & Islamic Studies Instructor",
    bio: "Teacher and researcher focused on helping students understand authentic Hadith and their practical lessons.",
    subjects: ["Hadith", "Seerah"],
    qualification: "PhD in Islamic Studies",
    experience: "12+ Years",
    students: 760,
    courses: 1,
    classes: 3,
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },

  {
    id: "omar-farooq",
    name: "Ustadh Omar Farooq",
    title: "Arabic Language Instructor",
    bio: "Arabic teacher helping students develop practical vocabulary, speaking skills, and a stronger understanding of Arabic.",
    subjects: ["Arabic"],
    qualification: "Arabic Language & Literature",
    experience: "7+ Years",
    students: 1450,
    courses: 1,
    classes: 3,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80",
    featured: false,
  },

  {
    id: "abdullah",
    name: "Mufti Abdullah",
    title: "Fiqh & Islamic Jurisprudence Instructor",
    bio: "Focused on teaching practical Fiqh and helping students understand Islamic rulings related to everyday life.",
    subjects: ["Fiqh", "Islamic Studies" ],
    qualification: "Islamic Jurisprudence",
    experience: "15+ Years",
    students: 1120,
    courses: 1,
    classes: 3,
    image:
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },

  {
    id: "hamza-malik",
    name: "Dr. Hamza Malik",
    title: "Seerah & Islamic History Instructor",
    bio: "Passionate educator teaching the life of the Prophet ﷺ and important lessons from Islamic history.",
    subjects: ["Seerah", "Islamic Studies"],
    qualification: "Islamic History & Studies",
    experience: "9+ Years",
    students: 1680,
    courses: 1,
    classes: 2,
    image:
      "https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
];