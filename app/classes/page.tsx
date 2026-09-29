"use client";

import { useEffect, useMemo, useState } from "react";

import ClassesHero from "@/app/components/classes/ClassesHero";
import ClassFilters from "@/app/components/classes/ClassFilters";
import ClassCard from "@/app/components/classes/ClassCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type ClassCategory =
  | "Quran"
  | "Tajweed"
  | "Hadith"
  | "Arabic"
  | "Fiqh"
  | "Seerah"
  | "Islamic Studies";

type ClassLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

type ClassStatus =
  | "Live"
  | "Upcoming"
  | "Completed"
  | "Cancelled";

type Teacher = {
  _id: string;
  name: string;
  email?: string;
  role?: "teacher" | "scholar";
};

type ApiClass = {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  category: ClassCategory;
  level: ClassLevel;
  teacher?: Teacher;
  scheduledAt: string;
  durationMinutes: number;
  duration?: string;
  students: number;
  maxStudents: number;
  seatsRemaining?: number;
  status: ClassStatus;
  meetingUrl?: string;
  enrollmentStatus?: "Registered" | "Attended" | "Cancelled" | null;
  isEnrolled?: boolean;
  registeredAt?: string | null;
};

type ClassCardItem = {
  id: string;
  title: string;
  description: string;
  category: ClassCategory;
  level: ClassLevel;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  status: ClassStatus;
  students: number;
  maxStudents: number;
  seatsRemaining: number;
  meetingUrl: string;
  featured: boolean;
  isEnrolled: boolean;
  enrollmentStatus:
    | "Registered"
    | "Attended"
    | "Cancelled"
    | null;
};

const getFeaturedClasses = (
  items: ClassCardItem[]
) => {
  return items
    .filter(
      (item) =>
        item.status === "Upcoming" ||
        item.status === "Live"
    )
    .slice(0, 3);
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<
    ClassCardItem[]
  >([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState<
    ClassCategory | "All"
  >("All");

  const [level, setLevel] = useState<
    ClassLevel | "All"
  >("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/classes`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch classes"
        );
      }

      const apiClasses: ApiClass[] =
        data.classes || [];

      const mappedClasses: ClassCardItem[] =
        apiClasses.map((item) => {
          const scheduledDate = new Date(
            item.scheduledAt
          );

          return {
            id: item._id || item.id || "",
            title: item.title,
            description: item.description || "",
            category: item.category,
            level: item.level,
            instructor:
              item.teacher?.name || "Teacher",
            date: scheduledDate.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
            time: scheduledDate.toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            duration:
              item.duration ||
              `${item.durationMinutes} min`,
            status: item.status,
            students: item.students || 0,
            maxStudents: item.maxStudents || 0,
            seatsRemaining:
              item.seatsRemaining ??
              Math.max(
                (item.maxStudents || 0) -
                  (item.students || 0),
                0
              ),
            meetingUrl:
              item.meetingUrl || "",
            featured:
              item.status === "Upcoming" ||
              item.status === "Live",
            isEnrolled:
              Boolean(item.isEnrolled) &&
              item.enrollmentStatus !==
                "Cancelled",
            enrollmentStatus:
              item.enrollmentStatus || null,
          };
        });

      setClasses(mappedClasses);
    } catch (error) {
      console.error(
        "Fetch student classes error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch classes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    const query = search
      .trim()
      .toLocaleLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        !query ||
        item.title
          .toLocaleLowerCase()
          .includes(query) ||
        item.description
          .toLocaleLowerCase()
          .includes(query) ||
        item.category
          .toLocaleLowerCase()
          .includes(query) ||
        item.instructor
          .toLocaleLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesLevel =
        level === "All" ||
        item.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [
    classes,
    search,
    category,
    level,
  ]);

  const hasFilters =
    search.trim() !== "" ||
    category !== "All" ||
    level !== "All";

  const featuredClasses = useMemo(
    () => getFeaturedClasses(classes),
    [classes]
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Navbar />

        <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-[#967438]" />

            <p className="mt-4 text-sm text-stone-500">
              Loading classes...
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">
        <Navbar />

        <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <h2 className="text-xl font-semibold text-red-800">
              Unable to load classes
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchClasses}
              className="mt-6 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Try Again
            </button>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navbar />

      <ClassesHero
        search={search}
        onSearchChange={setSearch}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {/* Featured */}
        {!hasFilters && (
          <section>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
                  Upcoming
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                  Featured Classes
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                  Join upcoming live sessions and
                  learn directly with experienced
                  instructors.
                </p>
              </div>
            </div>

            {featuredClasses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredClasses.map((item) => (
                  <ClassCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                <p className="text-sm text-stone-500">
                  No upcoming classes are currently
                  available.
                </p>
              </div>
            )}
          </section>
        )}

        {/* All Classes */}
        <section
          className={!hasFilters ? "mt-20" : ""}
        >
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#967438]">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              {hasFilters
                ? "Search Results"
                : "All Classes"}
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1
                ? "class"
                : "classes"}{" "}
              available
            </p>
          </div>

          <ClassFilters
            category={category}
            level={level}
            onCategoryChange={setCategory}
            onLevelChange={setLevel}
          />

          {filteredClasses.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((item) => (
                <ClassCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-stone-900">
                No classes found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Try a different search term or change
                your selected filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}