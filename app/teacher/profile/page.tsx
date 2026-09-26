"use client";

import {
  CheckCircle2,
  Edit3,
  Mail,
  ShieldCheck,
  User,
  X,
  Save,
  Loader2,
  RefreshCw,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ================================================================
   TYPES
================================================================ */

type ProfileUser = {
  _id: string;
  name: string;
  email: string;
  role: "teacher" | "scholar";
  isActive: boolean;
  isVerified: boolean;
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

export default function TeacherProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ==============================================================
     FETCH PROFILE
  ============================================================== */

  const fetchProfile = async (showRefreshLoader = false) => {
    try {
      setError("");

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/teacher/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load profile"
        );
      }

      setUser(data.user);
      setName(data.user?.name || "");
    } catch (error) {
      console.error("Fetch teacher profile error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ==============================================================
     INITIAL LOAD
  ============================================================== */

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ==============================================================
     UPDATE PROFILE
  ============================================================== */

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      const trimmedName = name.trim();

      if (trimmedName.length < 2) {
        setError("Name must be at least 2 characters");
        return;
      }

      setSaving(true);

      const response = await fetch(
        `${API_URL}/teacher/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update profile"
        );
      }

      setUser(data.user);
      setName(data.user?.name || "");

      setEditing(false);
      setSuccess("Profile updated successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Update teacher profile error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==============================================================
     CANCEL EDIT
  ============================================================== */

  const handleCancel = () => {
    setName(user?.name || "");
    setEditing(false);
    setError("");
  };

  /* ==============================================================
     LOADING
  ============================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#967438]" />

              <p className="mt-3 text-sm text-stone-500">
                Loading profile...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==============================================================
     NO USER
  ============================================================== */

  if (!user) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
            <User className="mx-auto h-10 w-10 text-stone-300" />

            <h2 className="mt-4 text-lg font-semibold text-stone-900">
              Profile unavailable
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {error || "Unable to load your profile."}
            </p>

            <button
              onClick={() => fetchProfile()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const roleLabel =
    user.role === "scholar"
      ? "Scholar"
      : "Teacher";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "—";

  /* ==============================================================
     UI
  ============================================================== */

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#967438]">
              Teacher Portal
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage your personal account information.
            </p>
          </div>

          <button
            onClick={() => fetchProfile(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* ======================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X className="mt-0.5 h-4 w-4 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

            <p>{success}</p>
          </div>
        )}

        {/* ======================================================
            PROFILE HERO
        ====================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-stone-900 px-5 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#d6b56d] text-2xl font-semibold text-stone-900 shadow-sm">
                  {initials || "U"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    {user.name}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#d6b56d]">
                      {roleLabel}
                    </span>

                    {user.isVerified && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-stone-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#d6b56d]" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {user.isActive ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 ring-1 ring-inset ring-red-400/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    Inactive Account
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* ====================================================
              ACCOUNT INFO
          ==================================================== */}

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">

            <InfoCard
              icon={<Mail className="h-4 w-4" />}
              label="Email Address"
              value={user.email}
            />

            <InfoCard
              icon={<GraduationCap className="h-4 w-4" />}
              label="Account Role"
              value={roleLabel}
            />

            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Member Since"
              value={joinedDate}
            />

          </div>
        </section>

        {/* ======================================================
            PROFILE INFORMATION
        ====================================================== */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-stone-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Update the information displayed on your account.
                </p>
              </div>
            </div>

            {!editing && (
              <button
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditing(true);
                }}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

            {/* Name */}

            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                disabled={!editing || saving}
                maxLength={100}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 py-3 pl-11 pr-4 text-sm text-stone-500 outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-stone-400">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Role */}

            <div>
              <label
                htmlFor="profile-role"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Role
              </label>

              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  id="profile-role"
                  type="text"
                  value={roleLabel}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100 py-3 pl-11 pr-4 text-sm text-stone-500 outline-none"
                />
              </div>
            </div>

            {/* Verification */}

            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Verification Status
              </label>

              <div className="flex min-h-[46px] items-center rounded-xl border border-stone-200 bg-stone-50 px-4">
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Account
                  </span>
                ) : (
                  <span className="text-sm font-medium text-stone-500">
                    Not Verified
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* ====================================================
              ACTIONS
          ==================================================== */}

          {editing && (
            <div className="flex flex-col-reverse gap-3 border-t border-stone-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>

            </div>
          )}
        </section>

        {/* ======================================================
            ACCOUNT SECURITY
        ====================================================== */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b border-stone-100 p-5 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-stone-900">
                Account Security
              </h2>

              <p className="mt-1 text-xs text-stone-400">
                Security information for your IlmHub account.
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-100">

            <SecurityRow
              title="Account Status"
              description="Your account is currently active."
              value={
                user.isActive
                  ? "Active"
                  : "Inactive"
              }
              active={user.isActive}
            />

            <SecurityRow
              title="Email Verification"
              description={
                user.isVerified
                  ? "Your email address has been verified."
                  : "Your email address has not been verified."
              }
              value={
                user.isVerified
                  ? "Verified"
                  : "Not Verified"
              }
              active={user.isVerified}
            />

          </div>
        </section>

      </div>
    </main>
  );
}


/* ================================================================
   INFO CARD
================================================================ */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <div className="flex items-center gap-2 text-stone-400">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-stone-800">
        {value}
      </p>
    </div>
  );
}


/* ================================================================
   SECURITY ROW
================================================================ */

function SecurityRow({
  title,
  description,
  value,
  active,
}: {
  title: string;
  description: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h3 className="text-sm font-medium text-stone-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-stone-400">
          {description}
        </p>
      </div>

      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-stone-100 text-stone-500"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active
              ? "bg-emerald-500"
              : "bg-stone-400"
          }`}
        />

        {value}
      </span>
    </div>
  );
}