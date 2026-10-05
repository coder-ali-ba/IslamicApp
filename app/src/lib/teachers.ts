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

