import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quran",
  description:
    "Read the Quran with translations and explore its verses through IlmHub.",
};

export default function QuranLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}