"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

export default function TeacherProfilePage() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Ustadh Muhammad Ahmed",
    email: "muhammad.ahmed@example.com",
    phone: "+92 300 1234567",
    location: "Islamabad, Pakistan",
    specialization: "Quran & Tajweed",
    experience: "8 Years",
    qualification: "Alimiyyah & Quranic Studies",
    bio: "Experienced Islamic educator focused on Quran reading, Tajweed, and helping students develop a strong connection with the Quran.",
  });

  const handleChange = (
    field: keyof typeof profile,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            Account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Manage your teacher and scholar profile information displayed to
            students on IlmHub.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Sidebar */}
          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-stone-900 text-[#d6b56d] shadow-lg">
                <User className="h-10 w-10" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {profile.fullName}
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Teacher & Scholar
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#d6b56d]/15 px-3 py-1.5 text-xs font-medium text-[#967438]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Teacher
              </div>
            </div>

            <div className="mt-7 space-y-4 border-t border-stone-200 pt-6">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#967438]" />

                <div>
                  <p className="text-xs text-stone-400">
                    Specialization
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {profile.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#967438]" />

                <div>
                  <p className="text-xs text-stone-400">
                    Experience
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-700">
                    {profile.experience}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#967438]" />

                <div>
                  <p className="text-xs text-stone-400">
                    Account Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-stone-700">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-stone-200 p-6">
              <h2 className="text-lg font-semibold">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Keep your information accurate so students can identify and
                connect with you.
              </p>
            </div>

            <div className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      handleChange("fullName", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleChange("email", e.target.value)
                      }
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleChange("phone", e.target.value)
                      }
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="location"
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        handleChange("location", e.target.value)
                      }
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label
                    htmlFor="specialization"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Specialization
                  </label>

                  <select
                    id="specialization"
                    value={profile.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option>Quran & Tajweed</option>
                    <option>Tajweed</option>
                    <option>Hadith & Islamic Studies</option>
                    <option>Arabic Language</option>
                    <option>Fiqh</option>
                    <option>Seerah & Islamic Studies</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Teaching Experience
                  </label>

                  <select
                    id="experience"
                    value={profile.experience}
                    onChange={(e) =>
                      handleChange("experience", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  >
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                    <option>5 Years</option>
                    <option>8 Years</option>
                    <option>10+ Years</option>
                  </select>
                </div>

                {/* Qualification */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="qualification"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Qualification
                  </label>

                  <input
                    id="qualification"
                    type="text"
                    value={profile.qualification}
                    onChange={(e) =>
                      handleChange("qualification", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  />
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Profile Bio
                  </label>

                  <textarea
                    id="bio"
                    rows={6}
                    value={profile.bio}
                    onChange={(e) =>
                      handleChange("bio", e.target.value)
                    }
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  />

                  <p className="mt-2 text-xs text-stone-400">
                    This bio can later be displayed on your public teacher
                    profile.
                  </p>
                </div>
              </div>

              {/* Save */}
              <div className="mt-7 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {saved && (
                    <div className="flex items-center gap-2 text-sm font-medium text-[#967438]">
                      <CheckCircle2 className="h-4 w-4" />
                      Profile saved successfully.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}