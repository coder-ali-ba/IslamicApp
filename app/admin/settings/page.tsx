"use client";

import { useState } from "react";
import {
  Bell,
  Globe,
  Lock,
  Save,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            System
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Manage your admin profile, platform preferences, and notifications.
          </p>
        </div>

        {/* Profile */}
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Admin Profile
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Update your administrator information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <InputField
              label="Full Name"
              defaultValue="Admin User"
            />

            <InputField
              label="Email Address"
              type="email"
              defaultValue="admin@ilmhub.com"
            />

            <InputField
              label="Phone Number"
              defaultValue="+92 300 0000000"
            />

            <InputField
              label="Role"
              defaultValue="Administrator"
              disabled
            />
          </div>

          <div className="flex justify-end border-t border-stone-100 px-5 py-4 sm:px-6">
            <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800">
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </section>

        {/* Platform Settings */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Globe className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Platform Settings
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  General settings for the IlmHub platform.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            <SettingRow
              icon={<Globe className="h-4 w-4" />}
              title="Platform Name"
              description="The name displayed throughout the platform."
            >
              <input
                type="text"
                defaultValue="IlmHub"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-64"
              />
            </SettingRow>

            <SettingRow
              icon={<Settings className="h-4 w-4" />}
              title="Default Language"
              description="Default language for the platform."
            >
              <select
                defaultValue="English"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-64"
              >
                <option>English</option>
                <option>Urdu</option>
                <option>Arabic</option>
              </select>
            </SettingRow>

            <SettingRow
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Maintenance Mode"
              description="Temporarily disable public access to the platform."
            >
              <Toggle
                enabled={maintenanceMode}
                onChange={() =>
                  setMaintenanceMode(!maintenanceMode)
                }
              />
            </SettingRow>
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Notifications
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Control how you receive admin notifications.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Admin Notifications"
              description="Receive notifications about important platform activity."
            >
              <Toggle
                enabled={notifications}
                onChange={() =>
                  setNotifications(!notifications)
                }
              />
            </SettingRow>

            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Email Alerts"
              description="Receive important alerts and system updates by email."
            >
              <Toggle
                enabled={emailAlerts}
                onChange={() =>
                  setEmailAlerts(!emailAlerts)
                }
              />
            </SettingRow>
          </div>
        </section>

        {/* Security */}
        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Lock className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Security
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Manage your administrator account security.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-stone-800">
                  Change Password
                </h3>

                <p className="mt-1 text-xs leading-5 text-stone-400">
                  Update your administrator password regularly to keep your
                  account secure.
                </p>
              </div>

              <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-[#d6b56d] hover:bg-stone-50">
                <Lock className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Save */}
        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  defaultValue,
  type = "text",
  disabled = false,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-stone-100 text-stone-400"
            : "bg-stone-50 text-stone-800 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
        }`}
      />
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-stone-400">{icon}</div>

        <div>
          <h3 className="text-sm font-medium text-stone-800">
            {title}
          </h3>

          <p className="mt-1 max-w-xl text-xs leading-5 text-stone-400">
            {description}
          </p>
        </div>
      </div>

      <div className="sm:shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-stone-900" : "bg-stone-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}