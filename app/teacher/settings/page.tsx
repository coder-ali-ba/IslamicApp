"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export default function TeacherSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    classReminders: true,
    studentMessages: true,
    courseUpdates: false,
    language: "English",
    timezone: "Asia/Karachi",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleSettingChange = (
    key: keyof typeof settings,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handlePasswordChange = (
    key: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handlePasswordUpdate = () => {
    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirm
    ) {
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      return;
    }

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            Account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Manage your notification preferences, language, security, and
            account settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 border-b border-stone-200 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Notifications
                </h2>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Choose which notifications you would like to receive.
                </p>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {/* Email Notifications */}
              <div className="flex items-center justify-between gap-5 p-6">
                <div className="flex items-start gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                  <div>
                    <h3 className="text-sm font-medium">
                      Email Notifications
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Receive important account and platform updates by
                      email.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange(
                      "emailNotifications",
                      !settings.emailNotifications
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.emailNotifications
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  }`}
                  aria-label="Toggle email notifications"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      settings.emailNotifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Class Reminders */}
              <div className="flex items-center justify-between gap-5 p-6">
                <div className="flex items-start gap-4">
                  <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                  <div>
                    <h3 className="text-sm font-medium">
                      Class Reminders
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Get reminders before your upcoming live classes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange(
                      "classReminders",
                      !settings.classReminders
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.classReminders
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  }`}
                  aria-label="Toggle class reminders"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      settings.classReminders
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Student Messages */}
              <div className="flex items-center justify-between gap-5 p-6">
                <div className="flex items-start gap-4">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                  <div>
                    <h3 className="text-sm font-medium">
                      Student Messages
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Receive notifications when students send you a
                      message.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange(
                      "studentMessages",
                      !settings.studentMessages
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.studentMessages
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  }`}
                  aria-label="Toggle student messages"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      settings.studentMessages
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Course Updates */}
              <div className="flex items-center justify-between gap-5 p-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                  <div>
                    <h3 className="text-sm font-medium">
                      Course Updates
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Receive updates related to courses and learning
                      resources.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange(
                      "courseUpdates",
                      !settings.courseUpdates
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.courseUpdates
                      ? "bg-stone-900"
                      : "bg-stone-300"
                  }`}
                  aria-label="Toggle course updates"
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      settings.courseUpdates
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 border-b border-stone-200 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Globe className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Preferences
                </h2>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Customize your language and regional preferences.
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Language
                </label>

                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Timezone
                </label>

                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSettingChange("timezone", e.target.value)
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                >
                  <option value="Asia/Karachi">
                    Asia/Karachi (PKT)
                  </option>
                  <option value="Asia/Dubai">
                    Asia/Dubai (GST)
                  </option>
                  <option value="Asia/Riyadh">
                    Asia/Riyadh (AST)
                  </option>
                  <option value="Europe/London">
                    Europe/London
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 border-b border-stone-200 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Security
                </h2>

                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Keep your account secure by regularly updating your
                  password.
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Current Password */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="currentPassword"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) =>
                        handlePasswordChange(
                          "current",
                          e.target.value
                        )
                      }
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    New Password
                  </label>

                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      handlePasswordChange(
                        "newPassword",
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) =>
                      handlePasswordChange(
                        "confirm",
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#d6b56d]/30 bg-[#d6b56d]/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#967438]" />

                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      Keep your account secure
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Use a strong password that you do not reuse on other
                      websites.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  <LockKeyhole className="h-4 w-4" />
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* Save Settings */}
          <div className="flex flex-col gap-3 border-t border-stone-200 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {saved && (
                <div className="flex items-center gap-2 text-sm font-medium text-[#967438]">
                  <CheckCircle2 className="h-4 w-4" />
                  Settings updated successfully.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}