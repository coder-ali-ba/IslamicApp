import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic Teachers",
  description:
    "Explore IlmHub teachers and find instructors for Quran and Islamic learning.",
};
export default function TeachersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}