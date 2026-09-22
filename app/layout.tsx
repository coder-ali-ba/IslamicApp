import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IlmHub — Islamic Learning Platform",
    template: "%s | IlmHub",
  },
  description:
    "IlmHub is an Islamic learning platform for Quran, Tafseer, Hadith, Islamic courses, live classes, teachers, and Islamic guidance.",
  keywords: [
    "IlmHub",
    "Quran",
    "Tafseer",
    "Hadith",
    "Islamic Learning",
    "Islamic Courses",
    "Islamic Education",
    "Fatwa",
  ],
  authors: [{ name: "IlmHub" }],
  creator: "IlmHub",
  publisher: "IlmHub",

  openGraph: {
    title: "IlmHub — Islamic Learning Platform",
    description:
      "Learn Quran, understand Tafseer, study Hadith, join Islamic courses and live classes.",
    siteName: "IlmHub",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <AuthProvider >
         {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
