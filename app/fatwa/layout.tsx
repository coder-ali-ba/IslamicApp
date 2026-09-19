import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic Guidance & Fatwa",
  description:
    "Explore Islamic questions and answers and seek guidance on matters of worship, family, business, and daily life.",
};

export default function FatwaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}