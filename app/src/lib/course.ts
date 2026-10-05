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
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  instructor?: CourseInstructor | string;
  duration?: string | number;
  lessons?: number;
  price?: number;
  image?: string;
  featured?: boolean;
  status?: string;
};
