"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
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

type ClassData = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  category: ClassCategory;
  level: ClassLevel;
  teacher: Teacher | null;
  scheduledAt: string;
  durationMinutes: number;
  maxStudents: number;
  meetingUrl?: string;
  status: ClassStatus;
  students?: number;
  createdAt?: string;
  updatedAt?: string;
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

export default function ManageClassPage() {
  const params = useParams();
  const router = useRouter();

  const classId = Array.isArray(params.classId)
    ? params.classId[0]
    : params.classId;

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classData, setClassData] = useState<ClassData | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

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
  });

  /* ==============================================================
     FETCH CLASS
  ============================================================== */

  useEffect(() => {
    if (!classId) return;

    const fetchClass = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/classes/admin/${classId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch class"
          );
        }

        const item: ClassData =
          data.class || data.data || data;

        if (!item) {
          throw new Error("Class not found");
        }

        setClassData(item);

        const scheduledDate = new Date(item.scheduledAt);

        if (Number.isNaN(scheduledDate.getTime())) {
          throw new Error(
            "The class has an invalid scheduled date."
          );
        }

        setForm({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "Quran",
          level: item.level || "Beginner",
          teacher: item.teacher?._id || "",
          scheduledDate: formatInputDate(scheduledDate),
          scheduledTime: formatInputTime(scheduledDate),
          durationMinutes: String(
            item.durationMinutes ?? 60
          ),
          maxStudents: String(
            item.maxStudents ?? 20
          ),
          meetingUrl: item.meetingUrl || "",
          status: item.status || "Scheduled",
        });
      } catch (error) {
        console.error("Fetch admin class error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch class"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId]);

  /* ==============================================================
     FETCH TEACHERS
  ============================================================== */

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);

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
        console.error("Fetch class teachers error:", error);

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
     FORM CHANGE
  ============================================================== */

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  /* ==============================================================
     SAVE CLASS
  ============================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!classId) {
      setError("Class ID is missing.");
      return;
    }

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

    const duration = Number(form.durationMinutes);
    const maxStudents = Number(form.maxStudents);

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

    const scheduledAt = new Date(
      `${form.scheduledDate}T${form.scheduledTime}`
    );

    if (Number.isNaN(scheduledAt.getTime())) {
      setError("Please enter a valid date and time.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/classes/admin/${classId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            level: form.level,
            teacher: form.teacher,
            scheduledAt: scheduledAt.toISOString(),
            durationMinutes: duration,
            maxStudents,
            meetingUrl: form.meetingUrl.trim(),
            status: form.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update class"
        );
      }

      const updatedClass: ClassData =
        data.class || data.data || data;

      setClassData(
        updatedClass?.title
          ? updatedClass
          : {
              ...classData,
              title: form.title.trim(),
              description: form.description.trim(),
              category: form.category,
              level: form.level,
              scheduledAt:
                scheduledAt.toISOString(),
              durationMinutes: duration,
              maxStudents,
              meetingUrl: form.meetingUrl.trim(),
              status: form.status,
              teacher:
                teachers.find(
                  (teacher) =>
                    teacher._id === form.teacher
                ) || classData?.teacher || null,
            }
      );

      setSuccess("Class updated successfully.");
    } catch (error) {
      console.error("Update admin class error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update class"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==============================================================
     DELETE CLASS
  ============================================================== */

  const handleDelete = async () => {
    if (!classId) {
      setError("Class ID is missing.");
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/classes/admin/${classId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete class"
        );
      }

      router.push("/admin/classes");
      router.refresh();
    } catch (error) {
      console.error("Delete admin class error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete class"
      );

      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  /* ==============================================================
     LOADING
  ============================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#967438]" />

              <p className="mt-4 text-sm text-stone-500">
                Loading class...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==============================================================
     ERROR WITHOUT CLASS
  ============================================================== */

  if (!classData) {
    return (
      <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/classes"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-semibold text-red-800">
              Unable to load class
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error || "The requested class could not be found."}
            </p>

            <Link
              href="/admin/classes"
              className="mt-5 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
            >
              Back to Classes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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
              Manage Class
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Update the class information, schedule,
              instructor, and enrollment settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600">
              {classData.students ?? 0} /{" "}
              {classData.maxStudents} students
            </span>
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
                    Update the main details of the class.
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
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    handleChange("title", e.target.value)
                  }
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1.5 text-xs text-stone-400">
                  {form.title.length}/150 characters
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
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1.5 text-xs text-stone-400">
                  {form.description.length}/2000 characters
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
                    <span className="ml-1 text-red-500">*</span>
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
                    <option value="Quran">Quran</option>
                    <option value="Tajweed">Tajweed</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Hadith">Hadith</option>
                    <option value="Fiqh">Fiqh</option>
                    <option value="Seerah">Seerah</option>
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
                    <span className="ml-1 text-red-500">*</span>
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
                    Manage the instructor and class schedule.
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
                  <span className="ml-1 text-red-500">*</span>
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

                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.name} —{" "}
                        {teacher.role === "scholar"
                          ? "Scholar"
                          : "Teacher"}
                      </option>
                    ))}
                  </select>
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
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="scheduledDate"
                      type="date"
                      value={form.scheduledDate}
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
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="scheduledTime"
                      type="time"
                      value={form.scheduledTime}
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
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="durationMinutes"
                      type="number"
                      min={15}
                      max={240}
                      step={15}
                      value={form.durationMinutes}
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
                </div>

                <div>
                  <label
                    htmlFor="maxStudents"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Maximum Students
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="maxStudents"
                      type="number"
                      min={1}
                      max={500}
                      value={form.maxStudents}
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

                  {typeof classData.students === "number" && (
                    <p className="mt-1.5 text-xs text-stone-400">
                      Currently enrolled:{" "}
                      {classData.students}
                    </p>
                  )}
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
                    Manage the class meeting information.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-6">

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
              </div>

              {/* Status */}

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Status
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

          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting || saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Class
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/classes"
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ==========================================================
          DELETE CONFIRMATION
      ========================================================== */}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-stone-900">
              Delete this class?
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              This will permanently delete{" "}
              <span className="font-medium text-stone-800">
                {classData.title}
              </span>{" "}
              and its associated enrollments. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                disabled={deleting}
                className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Class
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ================================================================
   DATE HELPERS
================================================================ */

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatInputTime(date: Date) {
  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
}