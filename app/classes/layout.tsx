import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Islamic Classes",
  description:
    "Join live Islamic classes and learn Quran, Tajweed, Arabic, Hadith, and Fiqh with teachers.",
};
export default function ClassesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}