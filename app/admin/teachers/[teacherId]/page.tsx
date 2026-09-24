"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  GraduationCap,
  CalendarDays,
  Pencil,
  Save,
  X,
} from "lucide-react";

type Teacher = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
};

type Props = {
  params: Promise<{
    teacherId: string;
  }>;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export default function TeacherProfilePage({
  params,
}: Props) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"teacher" | "scholar">(
    "teacher"
  );

  const [successMessage, setSuccessMessage] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const resolvedParams = await params;

        const response = await fetch(
          `${API_URL}/auth/admin/teachers/${resolvedParams.teacherId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load teacher profile"
          );
        }

        setTeacher(data.teacher);

        setName(data.teacher.name);
        setEmail(data.teacher.email);
        setRole(data.teacher.role);
      } catch (error) {
        console.error(
          "Teacher Profile Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load teacher profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [params]);

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const handleEdit = () => {
    if (!teacher) return;

    setName(teacher.name);
    setEmail(teacher.email);
    setRole(teacher.role);

    setEditError("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!teacher) return;

    setName(teacher.name);
    setEmail(teacher.email);
    setRole(teacher.role);

    setEditError("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!teacher) return;

    setEditError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setEditError("Name is required");
      return;
    }

    if (!email.trim()) {
      setEditError("Email is required");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/auth/admin/teachers/${teacher._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update teacher profile"
        );
      }

      const updatedTeacher: Teacher = {
        _id: data.teacher.id,
        name: data.teacher.name,
        email: data.teacher.email,
        role: data.teacher.role,
        isActive: data.teacher.isActive,
        isVerified: data.teacher.isVerified,
        createdAt: teacher.createdAt,
      };

      setTeacher(updatedTeacher);

      setName(updatedTeacher.name);
      setEmail(updatedTeacher.email);
      setRole(updatedTeacher.role);

      setIsEditing(false);
      setSuccessMessage(
        "Teacher profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update Teacher Error:",
        error
      );

      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update teacher profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-stone-200" />

          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <div className="flex gap-5">
              <div className="h-24 w-24 rounded-full bg-stone-200" />

              <div className="flex-1 space-y-3">
                <div className="h-6 w-52 rounded bg-stone-200" />
                <div className="h-4 w-72 rounded bg-stone-100" />
                <div className="h-6 w-24 rounded-full bg-stone-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/teachers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-700">
            {error || "Teacher not found"}
          </p>
        </div>
      </div>
    );
  }

  const initials =
    teacher.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("") || "T";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back */}
      <Link
        href="/admin/teachers"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Teachers
      </Link>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {/* Profile Header */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="h-28 mb-2 bg-stone-900" />

        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#d6b56d] text-3xl font-semibold text-stone-900 shadow-md">
                {initials}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold text-stone-900">
                    {teacher.name}
                  </h1>

                  {teacher.isVerified && (
                    <ShieldCheck className="h-5 w-5 text-[#967438]" />
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                  <Mail className="h-4 w-4" />
                  {teacher.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  teacher.role === "scholar"
                    ? "bg-[#f5ecd9] text-[#806126]"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                <GraduationCap className="h-4 w-4" />

                {teacher.role === "scholar"
                  ? "Scholar"
                  : "Teacher"}
              </span>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Form */}
      {isEditing && (
        <section className="rounded-2xl border border-[#d6b56d]/50 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Edit Teacher Profile
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Update the teacher account information below.
            </p>
          </div>

          {editError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {editError}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                placeholder="Enter teacher name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                placeholder="Enter email address"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as
                      | "teacher"
                      | "scholar"
                  )
                }
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
              >
                <option value="teacher">
                  Teacher
                </option>

                <option value="scholar">
                  Scholar
                </option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </section>
      )}

      {/* Account Status */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">
            Account Status
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                {teacher.isActive ? (
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                ) : (
                  <UserX className="h-5 w-5 text-red-500" />
                )}

                <span className="text-sm text-stone-600">
                  Account
                </span>
              </div>

              <span
                className={`text-sm font-semibold ${
                  teacher.isActive
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {teacher.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {teacher.isVerified ? (
                  <ShieldCheck className="h-5 w-5 text-[#967438]" />
                ) : (
                  <ShieldX className="h-5 w-5 text-stone-400" />
                )}

                <span className="text-sm text-stone-600">
                  Verification
                </span>
              </div>

              <span className="text-sm font-semibold text-stone-800">
                {teacher.isVerified
                  ? "Verified"
                  : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">
            Account Information
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="text-sm text-stone-500">
                Role
              </span>

              <span className="text-sm font-medium capitalize text-stone-900">
                {teacher.role}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="text-sm text-stone-500">
                User ID
              </span>

              <span className="max-w-[220px] truncate font-mono text-xs text-stone-600">
                {teacher._id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-stone-400" />

                <span className="text-sm text-stone-500">
                  Joined
                </span>
              </div>

              <span className="text-sm font-medium text-stone-900">
                {formatDate(teacher.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Overview */}
      <section className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-stone-900">
              Teaching Overview
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-500">
              Courses, classes, students, and other
              teaching information can be added here
              once those relationships are connected
              with the teacher account.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}