"use client";

import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  Mail,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ================================================================
   TYPES
================================================================ */

type SettingsState = {
  emailNotifications: boolean;
  messageNotifications: boolean;
  classReminders: boolean;
  studentActivity: boolean;
  compactDashboard: boolean;
  confirmBeforeDelete: boolean;
};

/* ================================================================
   DEFAULT SETTINGS
================================================================ */

const DEFAULT_SETTINGS: SettingsState = {
  emailNotifications: true,
  messageNotifications: true,
  classReminders: true,
  studentActivity: true,
  compactDashboard: false,
  confirmBeforeDelete: true,
};

const STORAGE_KEY = "ilmhub_teacher_settings";

/* ================================================================
   PAGE
================================================================ */

export default function TeacherSettingsPage() {
  const [settings, setSettings] =
    useState<SettingsState>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  /* ==============================================================
     LOAD SETTINGS
  ============================================================== */

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "Load teacher settings error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==============================================================
     UPDATE SETTING
  ============================================================== */

  const updateSetting = (
    key: keyof SettingsState,
    value: boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  /* ==============================================================
     SAVE SETTINGS
  ============================================================== */

  const saveSettings = () => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Save teacher settings error:",
        error
      );
    }
  };

  /* ==============================================================
     RESET SETTINGS
  ============================================================== */

  const resetSettings = () => {
    setResetting(true);

    setSettings(DEFAULT_SETTINGS);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Reset teacher settings error:",
        error
      );
    } finally {
      window.setTimeout(() => {
        setResetting(false);
      }, 300);
    }
  };

  /* ==============================================================
     LOADING
  ============================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="mx-auto flex min-h-[500px] max-w-6xl items-center justify-center px-4">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#967438]" />

            <p className="mt-3 text-sm text-stone-500">
              Loading settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

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
              Settings
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage your portal preferences and notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={resetSettings}
              disabled={resetting}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw
                className={`h-4 w-4 ${
                  resetting ? "animate-spin" : ""
                }`}
              />

              Reset
            </button>

            <button
              onClick={saveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800"
            >
              {saved ? (
                <Check className="h-4 w-4 text-[#d6b56d]" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saved ? "Saved" : "Save Changes"}
            </button>

          </div>
        </div>

        {/* ======================================================
            SAVE NOTICE
        ====================================================== */}

        {saved && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check className="h-4 w-4 shrink-0" />

            <span>
              Your settings have been saved successfully.
            </span>
          </div>
        )}

        {/* ======================================================
            NOTIFICATIONS
        ====================================================== */}

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
                  Choose which activities you want to be notified about.
                </p>
              </div>

            </div>
          </div>

          <div className="divide-y divide-stone-100">

            <SettingRow
              icon={<Mail className="h-4 w-4" />}
              title="Email Notifications"
              description="Receive important account and platform notifications by email."
              enabled={settings.emailNotifications}
              onChange={(value) =>
                updateSetting(
                  "emailNotifications",
                  value
                )
              }
            />

            <SettingRow
              icon={<MessageSquare className="h-4 w-4" />}
              title="Message Notifications"
              description="Get notified when students or administrators send you a message."
              enabled={settings.messageNotifications}
              onChange={(value) =>
                updateSetting(
                  "messageNotifications",
                  value
                )
              }
            />

            <SettingRow
              icon={<Video className="h-4 w-4" />}
              title="Class Reminders"
              description="Receive reminders about your upcoming classes."
              enabled={settings.classReminders}
              onChange={(value) =>
                updateSetting(
                  "classReminders",
                  value
                )
              }
            />

            <SettingRow
              icon={<Users className="h-4 w-4" />}
              title="Student Activity"
              description="Receive updates related to student enrollment and activity."
              enabled={settings.studentActivity}
              onChange={(value) =>
                updateSetting(
                  "studentActivity",
                  value
                )
              }
            />

          </div>
        </section>

        {/* ======================================================
            DASHBOARD
        ====================================================== */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Eye className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Dashboard Preferences
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Customize how your teacher dashboard behaves.
                </p>
              </div>

            </div>
          </div>

          <div className="divide-y divide-stone-100">

            <SettingRow
              icon={<Settings className="h-4 w-4" />}
              title="Compact Dashboard"
              description="Use a more compact layout to display more information at once."
              enabled={settings.compactDashboard}
              onChange={(value) =>
                updateSetting(
                  "compactDashboard",
                  value
                )
              }
            />

            <SettingRow
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Confirm Before Delete"
              description="Ask for confirmation before deleting messages or other removable items."
              enabled={settings.confirmBeforeDelete}
              onChange={(value) =>
                updateSetting(
                  "confirmBeforeDelete",
                  value
                )
              }
            />

          </div>
        </section>

        {/* ======================================================
            ACCOUNT
        ====================================================== */}

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

          <div className="border-b border-stone-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-stone-900">
                  Account & Security
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  Manage account-related information.
                </p>
              </div>

            </div>
          </div>

          <div className="divide-y divide-stone-100">

            <SettingsLink
              title="Profile Information"
              description="Update your name and view your account information."
              href="/teacher/profile"
            />

            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h3 className="text-sm font-medium text-stone-800">
                  Password
                </h3>

                <p className="mt-1 text-xs text-stone-400">
                  Password management can be added when the authentication
                  password-update endpoint is enabled.
                </p>
              </div>

              <span className="w-fit rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500">
                Managed by Authentication
              </span>
            </div>

          </div>
        </section>

        {/* ======================================================
            INFORMATION
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-[#d6b56d]/30 bg-[#d6b56d]/5 p-5 sm:p-6">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <Settings className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                About these settings
              </h3>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Notification and dashboard preferences are stored locally
                on this device. Your account information remains managed
                separately through your profile and authentication system.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}


/* ================================================================
   SETTING ROW
================================================================ */

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

      <div className="flex items-start gap-3">

        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-medium text-stone-800">
            {title}
          </h3>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-stone-400">
            {description}
          </p>
        </div>

      </div>

      <Toggle
        enabled={enabled}
        onChange={onChange}
      />

    </div>
  );
}


/* ================================================================
   TOGGLE
================================================================ */

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
        enabled
          ? "bg-stone-900"
          : "bg-stone-200"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}


/* ================================================================
   SETTINGS LINK
================================================================ */

function SettingsLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 p-5 transition hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div>
        <h3 className="text-sm font-medium text-stone-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-stone-400">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-[#967438]" />
    </a>
  );
}