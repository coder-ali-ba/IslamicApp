
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function NewTeacherClassPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Quran",
    level: "Beginner",
    scheduledAt: "",
    durationMinutes: "60",
    maxStudents: "30",
    meetingUrl: "",
    learningOutcomes: [""],
    topics: [""],
    requirements: [""],
  });

  const updateField = (
    field: keyof typeof form,
    value: string | string[]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateArrayItem = (
    field: "learningOutcomes" | "topics" | "requirements",
    index: number,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addArrayItem = (
    field: "learningOutcomes" | "topics" | "requirements"
  ) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "learningOutcomes" | "topics" | "requirements",
    index: number
  ) => {
    setForm((current) => {
      const updated = current[field].filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...current,
        [field]: updated.length ? updated : [""],
      };
    });
  };

  const cleanArray = (items: string[]) =>
    items.map((item) => item.trim()).filter(Boolean);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/classes/teacher/my`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            category: form.category,
            level: form.level,
            scheduledAt: form.scheduledAt,
            durationMinutes: Number(form.durationMinutes),
            maxStudents: Number(form.maxStudents),
            meetingUrl: form.meetingUrl,
            learningOutcomes: cleanArray(form.learningOutcomes),
            topics: cleanArray(form.topics),
            requirements: cleanArray(form.requirements),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to create class"
        );
      }

      router.push("/teacher/classes");
      router.refresh();
    } catch (error) {
      console.error("Create class error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create class"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/teacher/classes"
        className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-stone-900"
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
            Create New Class
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Schedule a new Islamic learning class.
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
              updateField("title", value)
            }
            placeholder="e.g. Quran Reading Live Class"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe what students will learn..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Category"
              value={form.category}
              onChange={(value) =>
                updateField("category", value)
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
                updateField("level", value)
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
                updateField(
                  "scheduledAt",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
            />

            <p className="mt-1 text-xs text-stone-400">
              Use your local Pakistan time.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Duration (minutes)"
              type="number"
              min="15"
              max="240"
              value={form.durationMinutes}
              onChange={(value) =>
                updateField("durationMinutes", value)
              }
              required
            />

            <Input
              label="Maximum Students"
              type="number"
              min="1"
              max="500"
              value={form.maxStudents}
              onChange={(value) =>
                updateField("maxStudents", value)
              }
              required
            />
          </div>

          {/* Learning Outcomes */}
          <ArrayField
            label="Learning Outcomes"
            description="What should students be able to understand or do after completing this class?"
            items={form.learningOutcomes}
            placeholder="e.g. Understand the basic principles of Tajweed"
            onChange={(index, value) =>
              updateArrayItem(
                "learningOutcomes",
                index,
                value
              )
            }
            onAdd={() =>
              addArrayItem("learningOutcomes")
            }
            onRemove={(index) =>
              removeArrayItem(
                "learningOutcomes",
                index
              )
            }
          />

          {/* Topics */}
          <ArrayField
            label="Topics Covered"
            description="Add the main topics that will be taught in this class."
            items={form.topics}
            placeholder="e.g. Introduction to Quranic pronunciation"
            onChange={(index, value) =>
              updateArrayItem(
                "topics",
                index,
                value
              )
            }
            onAdd={() => addArrayItem("topics")}
            onRemove={(index) =>
              removeArrayItem("topics", index)
            }
          />

          {/* Requirements */}
          <ArrayField
            label="Requirements"
            description="Mention anything students should have or know before joining."
            items={form.requirements}
            placeholder="e.g. Basic knowledge of Arabic letters"
            onChange={(index, value) =>
              updateArrayItem(
                "requirements",
                index,
                value
              )
            }
            onAdd={() =>
              addArrayItem("requirements")
            }
            onRemove={(index) =>
              removeArrayItem(
                "requirements",
                index
              )
            }
          />

          <Input
            label="Meeting URL"
            type="url"
            value={form.meetingUrl}
            onChange={(value) =>
              updateField("meetingUrl", value)
            }
            placeholder="https://..."
          />

          <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
            <Link
              href="/teacher/classes"
              className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Creating..."
                : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArrayField({
  label,
  description,
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  description: string;
  items: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
      <div className="mb-3">
        <label className="block text-sm font-semibold text-stone-800">
          {label}
        </label>

        <p className="mt-1 text-xs leading-5 text-stone-400">
          {description}
        </p>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-xs font-semibold text-[#967438]">
              {index + 1}
            </div>

            <input
              type="text"
              value={item}
              onChange={(event) =>
                onChange(
                  index,
                  event.target.value
                )
              }
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              aria-label={`Remove ${label} ${index + 1}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:border-[#d6b56d] hover:text-[#967438]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add {label.replace(" Covered", "")}
      </button>
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
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
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
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
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

