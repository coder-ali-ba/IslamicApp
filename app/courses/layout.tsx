import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic Courses",
  description:
    "Explore Islamic courses covering Quran, Hadith, Arabic, Fiqh, Seerah, and Islamic studies.",
};

export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}