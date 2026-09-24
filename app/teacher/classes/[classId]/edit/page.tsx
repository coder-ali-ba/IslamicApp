"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClassData = {
  title: string;
  description: string;
  category: string;
  level: string;
  scheduledAt: string;
  durationMinutes: number;
  maxStudents: number;
  meetingUrl: string;
  status: "Scheduled" | "Cancelled" | "Completed";
};

export default function EditTeacherClassPage() {
  const params = useParams();
  const router = useRouter();

  const classId = params.classId as string;

  const [form, setForm] =
    useState<ClassData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/classes/teacher/my/${classId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch class"
          );
        }

        const item = data.class;

        const date = new Date(item.scheduledAt);

        const localDate = new Date(
          date.getTime() -
            date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        setForm({
          title: item.title,
          description: item.description || "",
          category: item.category,
          level: item.level,
          scheduledAt: localDate,
          durationMinutes:
            item.durationMinutes,
          maxStudents: item.maxStudents,
          meetingUrl: item.meetingUrl || "",
          status:
            item.status === "Cancelled"
              ? "Cancelled"
              : item.status === "Completed"
                ? "Completed"
                : "Scheduled",
        });
      } catch (error) {
        console.error(
          "Fetch class error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch class"
        );
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClass();
    }
  }, [classId]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/classes/teacher/my/${classId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            durationMinutes:
              Number(form.durationMinutes),
            maxStudents:
              Number(form.maxStudents),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update class"
        );
      }

      router.push("/teacher/classes");
      router.refresh();
    } catch (error) {
      console.error(
        "Update class error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update class"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#967438]" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Class not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/teacher/classes"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Classes
      </Link>

      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
            Teaching
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-stone-900">
            Edit Class
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Update your class schedule and details.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="Class Title"
            value={form.title}
            onChange={(value) =>
              setForm({
                ...form,
                title: value,
              })
            }
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description:
                    event.target.value,
                })
              }
              rows={4}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Category"
              value={form.category}
              onChange={(value) =>
                setForm({
                  ...form,
                  category: value,
                })
              }
              options={[
                "Quran",
                "Tajweed",
                "Hadith",
                "Arabic",
                "Fiqh",
                "Seerah",
                "Islamic Studies",
              ]}
            />

            <Select
              label="Level"
              value={form.level}
              onChange={(value) =>
                setForm({
                  ...form,
                  level: value,
                })
              }
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
              ]}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Date & Time
            </label>

            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(event) =>
                setForm({
                  ...form,
                  scheduledAt:
                    event.target.value,
                })
              }
              required
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Duration (minutes)"
              type="number"
              min="15"
              max="240"
              value={String(
                form.durationMinutes
              )}
              onChange={(value) =>
                setForm({
                  ...form,
                  durationMinutes:
                    Number(value),
                })
              }
              required
            />

            <Input
              label="Maximum Students"
              type="number"
              min="1"
              max="500"
              value={String(
                form.maxStudents
              )}
              onChange={(value) =>
                setForm({
                  ...form,
                  maxStudents:
                    Number(value),
                })
              }
              required
            />
          </div>

          <Input
            label="Meeting URL"
            type="url"
            value={form.meetingUrl}
            onChange={(value) =>
              setForm({
                ...form,
                meetingUrl: value,
              })
            }
            placeholder="https://..."
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target
                    .value as ClassData["status"],
                })
              }
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
            <Link
              href="/teacher/classes"
              className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}