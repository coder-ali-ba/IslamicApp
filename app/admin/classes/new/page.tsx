"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

/* ================================================================
   TYPES
================================================================ */

type ClassCategory =
  | "Quran"
  | "Tajweed"
  | "Arabic"
  | "Hadith"
  | "Fiqh"
  | "Seerah"
  | "Islamic Studies";

type ClassLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

type ClassStatus =
  | "Scheduled"
  | "Cancelled"
  | "Completed";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
  isActive?: boolean;
  isVerified?: boolean;
};

/* ================================================================
   API
================================================================ */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* ================================================================
   PAGE
================================================================ */

export default function NewClassPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Quran" as ClassCategory,
    level: "Beginner" as ClassLevel,
    teacher: "",
    scheduledDate: "",
    scheduledTime: "",
    durationMinutes: "60",
    maxStudents: "20",
    meetingUrl: "",
    status: "Scheduled" as ClassStatus,

    learningOutcomes: [""],
    topics: [""],
    requirements: [""],
  });

  /* ==============================================================
     FETCH TEACHERS / SCHOLARS
  ============================================================== */

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        setError("");

        const response = await fetch(
          `${API_URL}/classes/admin/teachers`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load teachers"
          );
        }

        setTeachers(data.teachers || []);
      } catch (error) {
        console.error(
          "Fetch class teachers error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load teachers"
        );
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  /* ==============================================================
     HANDLE BASIC INPUT
  ============================================================== */

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /* ==============================================================
     HANDLE ARRAY INPUTS
  ============================================================== */

  const handleArrayChange = (
    field:
      | "learningOutcomes"
      | "topics"
      | "requirements",
    index: number,
    value: string
  ) => {
    setForm((previous) => {
      const updated = [...previous[field]];

      updated[index] = value;

      return {
        ...previous,
        [field]: updated,
      };
    });

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const addArrayItem = (
    field:
      | "learningOutcomes"
      | "topics"
      | "requirements"
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], ""],
    }));
  };

  const removeArrayItem = (
    field:
      | "learningOutcomes"
      | "topics"
      | "requirements",
    index: number
  ) => {
    setForm((previous) => {
      const updated = previous[field].filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...previous,
        [field]:
          updated.length > 0 ? updated : [""],
      };
    });
  };

  /* ==============================================================
     CLEAN ARRAY
  ============================================================== */

  const cleanArray = (items: string[]) => {
    return items
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /* ==============================================================
     SUBMIT
  ============================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* ------------------------------------------------------------
       CLIENT VALIDATION
    ------------------------------------------------------------ */

    if (!form.title.trim()) {
      setError("Please enter a class title.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError(
        "Class title must be at least 3 characters."
      );
      return;
    }

    if (!form.teacher) {
      setError(
        "Please select a teacher or scholar."
      );
      return;
    }

    if (!form.scheduledDate) {
      setError("Please select a class date.");
      return;
    }

    if (!form.scheduledTime) {
      setError("Please select a class time.");
      return;
    }

    const duration = Number(
      form.durationMinutes
    );

    const maxStudents = Number(
      form.maxStudents
    );

    if (
      !Number.isFinite(duration) ||
      duration < 15 ||
      duration > 240
    ) {
      setError(
        "Duration must be between 15 and 240 minutes."
      );
      return;
    }

    if (
      !Number.isFinite(maxStudents) ||
      maxStudents < 1 ||
      maxStudents > 500
    ) {
      setError(
        "Maximum students must be between 1 and 500."
      );
      return;
    }

    /* ------------------------------------------------------------
       DATE + TIME
    ------------------------------------------------------------ */

    const scheduledAt = new Date(
      `${form.scheduledDate}T${form.scheduledTime}`
    );

    if (
      Number.isNaN(
        scheduledAt.getTime()
      )
    ) {
      setError(
        "Please enter a valid date and time."
      );
      return;
    }

    /* ------------------------------------------------------------
       CLEAN DYNAMIC CONTENT
    ------------------------------------------------------------ */

    const learningOutcomes = cleanArray(
      form.learningOutcomes
    );

    const topics = cleanArray(
      form.topics
    );

    const requirements = cleanArray(
      form.requirements
    );

    /* ------------------------------------------------------------
       SUBMIT
    ------------------------------------------------------------ */

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/classes/admin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description:
              form.description.trim(),

            category: form.category,
            level: form.level,

            teacher: form.teacher,

            scheduledAt:
              scheduledAt.toISOString(),

            durationMinutes: duration,
            maxStudents,

            meetingUrl:
              form.meetingUrl.trim(),

            status: form.status,

            /* New dynamic class content */
            learningOutcomes,
            topics,
            requirements,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create class"
        );
      }

      setSuccess(
        "Class created successfully."
      );

      /* Reset form */

      setForm({
        title: "",
        description: "",
        category: "Quran",
        level: "Beginner",
        teacher: "",
        scheduledDate: "",
        scheduledTime: "",
        durationMinutes: "60",
        maxStudents: "20",
        meetingUrl: "",
        status: "Scheduled",

        learningOutcomes: [""],
        topics: [""],
        requirements: [""],
      });
    } catch (error) {
      console.error(
        "Create admin class error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create class"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/classes"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Classes
            </Link>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Class Management
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Add New Class
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Create a new Islamic class and
              assign it to a teacher or scholar.
            </p>
          </div>
        </div>

        {/* ========================================================
            ALERTS
        ======================================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* ========================================================
            FORM
        ======================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* ======================================================
              BASIC INFORMATION
          ====================================================== */}

          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-xs text-stone-500">
                    Enter the main details of the
                    class.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6">

              {/* Title */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Class Title
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Quran Recitation & Tajweed"
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1.5 text-xs text-stone-400">
                  {form.title.length}/150
                  characters
                </p>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe what students will learn in this class..."
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1.5 text-xs text-stone-400">
                  {form.description.length}
                  /2000 characters
                </p>
              </div>

              {/* Category + Level */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Category
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) =>
                      handleChange(
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="Quran">
                      Quran
                    </option>
                    <option value="Tajweed">
                      Tajweed
                    </option>
                    <option value="Arabic">
                      Arabic
                    </option>
                    <option value="Hadith">
                      Hadith
                    </option>
                    <option value="Fiqh">
                      Fiqh
                    </option>
                    <option value="Seerah">
                      Seerah
                    </option>
                    <option value="Islamic Studies">
                      Islamic Studies
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Level
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="level"
                    value={form.level}
                    onChange={(e) =>
                      handleChange(
                        "level",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="Beginner">
                      Beginner
                    </option>
                    <option value="Intermediate">
                      Intermediate
                    </option>
                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>

              </div>
            </div>
          </section>

          {/* ======================================================
              LEARNING CONTENT
          ====================================================== */}

          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    Learning Content
                  </h2>

                  <p className="mt-1 text-xs text-stone-500">
                    Define what students will learn,
                    study, and prepare for.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-6">

              {/* ==================================================
                  LEARNING OUTCOMES
              ================================================== */}

              <DynamicList
                title="Learning Outcomes"
                description="What should students be able to understand or achieve after completing this class?"
                items={form.learningOutcomes}
                placeholder="e.g. Understand the basic rules of Tajweed"
                onChange={(index, value) =>
                  handleArrayChange(
                    "learningOutcomes",
                    index,
                    value
                  )
                }
                onAdd={() =>
                  addArrayItem(
                    "learningOutcomes"
                  )
                }
                onRemove={(index) =>
                  removeArrayItem(
                    "learningOutcomes",
                    index
                  )
                }
              />

              {/* ==================================================
                  TOPICS
              ================================================== */}

              <DynamicList
                title="Topics Covered"
                description="List the main topics that will be covered during the class."
                items={form.topics}
                placeholder="e.g. Introduction to Tajweed rules"
                onChange={(index, value) =>
                  handleArrayChange(
                    "topics",
                    index,
                    value
                  )
                }
                onAdd={() =>
                  addArrayItem("topics")
                }
                onRemove={(index) =>
                  removeArrayItem(
                    "topics",
                    index
                  )
                }
              />

              {/* ==================================================
                  REQUIREMENTS
              ================================================== */}

              <DynamicList
                title="Requirements"
                description="Tell students what they need before joining or attending this class."
                items={form.requirements}
                placeholder="e.g. Bring a Quran and notebook"
                onChange={(index, value) =>
                  handleArrayChange(
                    "requirements",
                    index,
                    value
                  )
                }
                onAdd={() =>
                  addArrayItem(
                    "requirements"
                  )
                }
                onRemove={(index) =>
                  removeArrayItem(
                    "requirements",
                    index
                  )
                }
              />

            </div>
          </section>

          {/* ======================================================
              TEACHER & SCHEDULE
          ====================================================== */}

          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    Teacher & Schedule
                  </h2>

                  <p className="mt-1 text-xs text-stone-500">
                    Assign the instructor and set the
                    class schedule.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6">

              {/* Teacher */}

              <div>
                <label
                  htmlFor="teacher"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Teacher / Scholar
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                {loadingTeachers ? (
                  <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
                    <Loader2 className="h-4 w-4 animate-spin text-[#967438]" />
                    Loading teachers...
                  </div>
                ) : (
                  <select
                    id="teacher"
                    value={form.teacher}
                    onChange={(e) =>
                      handleChange(
                        "teacher",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option value="">
                      Select teacher or scholar
                    </option>

                    {teachers.map(
                      (teacher) => (
                        <option
                          key={teacher._id}
                          value={teacher._id}
                        >
                          {teacher.name} —{" "}
                          {teacher.role ===
                          "scholar"
                            ? "Scholar"
                            : "Teacher"}
                        </option>
                      )
                    )}
                  </select>
                )}

                {!loadingTeachers &&
                  teachers.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No active teachers or
                      scholars are available.
                    </p>
                  )}
              </div>

              {/* Date + Time */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="scheduledDate"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Class Date
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="scheduledDate"
                      type="date"
                      value={
                        form.scheduledDate
                      }
                      onChange={(e) =>
                        handleChange(
                          "scheduledDate",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="scheduledTime"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Start Time
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="scheduledTime"
                      type="time"
                      value={
                        form.scheduledTime
                      }
                      onChange={(e) =>
                        handleChange(
                          "scheduledTime",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

              </div>

              {/* Duration + Capacity */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="durationMinutes"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Duration
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="durationMinutes"
                      type="number"
                      min={15}
                      max={240}
                      step={15}
                      value={
                        form.durationMinutes
                      }
                      onChange={(e) =>
                        handleChange(
                          "durationMinutes",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-20 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                      minutes
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-stone-400">
                    15–240 minutes
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="maxStudents"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Maximum Students
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="maxStudents"
                      type="number"
                      min={1}
                      max={500}
                      value={
                        form.maxStudents
                      }
                      onChange={(e) =>
                        handleChange(
                          "maxStudents",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-stone-400">
                    Maximum 500 students
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* ======================================================
              ONLINE CLASS
          ====================================================== */}

          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                  <Video className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    Online Class
                  </h2>

                  <p className="mt-1 text-xs text-stone-500">
                    Add the meeting link students will
                    use to join.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6">

              {/* Meeting URL */}

              <div>
                <label
                  htmlFor="meetingUrl"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Meeting URL
                </label>

                <div className="relative">
                  <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                  <input
                    id="meetingUrl"
                    type="url"
                    value={form.meetingUrl}
                    onChange={(e) =>
                      handleChange(
                        "meetingUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://zoom.us/j/..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                  />
                </div>

                <p className="mt-1.5 text-xs text-stone-400">
                  Optional. Students can use this link
                  to join the live class.
                </p>
              </div>

              {/* Status */}

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Initial Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    handleChange(
                      "status",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* ======================================================
              ACTIONS
          ====================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin/classes"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                submitting ||
                loadingTeachers
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Class...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Class
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

/* ================================================================
   DYNAMIC LIST
================================================================ */

function DynamicList({
  title,
  description,
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  description: string;
  items: string[];
  placeholder: string;
  onChange: (
    index: number,
    value: string
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-stone-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-stone-500">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-sm font-semibold text-stone-500">
              {index + 1}
            </div>

            <input
              type="text"
              value={item}
              onChange={(e) =>
                onChange(
                  index,
                  e.target.value
                )
              }
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />

            <button
              type="button"
              onClick={() =>
                onRemove(index)
              }
              disabled={items.length === 1}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Remove ${title} item`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
      >
        <Plus className="h-4 w-4 text-[#967438]" />
        Add {title}
      </button>
    </div>
  );
}