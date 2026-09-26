"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Globe,
  Lock,
  Loader2,
  Save,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

/* ================================================================
   TYPES
================================================================ */

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  imageUrl: string;
};

type PlatformSettings = {
  platformName: string;
  language: "English" | "Urdu" | "Arabic";
  maintenanceMode: boolean;
};

type NotificationSettings = {
  notifications: boolean;
  emailAlerts: boolean;
};

type SettingsResponse = {
  profile: Profile;
  platform: PlatformSettings;
  notifications: NotificationSettings;
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

export default function AdminSettingsPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [platform, setPlatform] =
    useState<PlatformSettings>({
      platformName: "IlmHub",
      language: "English",
      maintenanceMode: false,
    });

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      notifications: true,
      emailAlerts: true,
    });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);
  const [savingPlatform, setSavingPlatform] =
    useState(false);
  const [savingNotifications, setSavingNotifications] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  /* ==============================================================
     LOAD SETTINGS
  ============================================================== */

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/settings/admin`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load settings"
        );
      }

      const settings =
        data?.data as SettingsResponse;

      setProfile(settings.profile);
      setPlatform(settings.platform);
      setNotifications(
        settings.notifications
      );
    } catch (error) {
      console.error(
        "Fetch admin settings error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ==============================================================
     SAVE PROFILE
  ============================================================== */

  const handleSaveProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile) return;

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      if (!profile.name.trim()) {
        setError("Full name is required.");
        return;
      }

      if (!profile.email.trim()) {
        setError("Email address is required.");
        return;
      }

      const response = await fetch(
        `${API_URL}/settings/admin/profile`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update profile"
        );
      }

      setProfile(data.profile);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* ==============================================================
     SAVE PLATFORM
  ============================================================== */

  const handleSavePlatform = async () => {
    try {
      setSavingPlatform(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/settings/admin/platform`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platformName:
              platform.platformName,
            language: platform.language,
            maintenanceMode:
              platform.maintenanceMode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update platform settings"
        );
      }

      setPlatform(data.platform);

      setSuccess(
        "Platform settings updated successfully."
      );
    } catch (error) {
      console.error(
        "Update platform settings error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update platform settings"
      );
    } finally {
      setSavingPlatform(false);
    }
  };

  /* ==============================================================
     SAVE NOTIFICATIONS
  ============================================================== */

  const handleSaveNotifications = async () => {
    try {
      setSavingNotifications(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/settings/admin/notifications`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notifications:
              notifications.notifications,
            emailAlerts:
              notifications.emailAlerts,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update notifications"
        );
      }

      setNotifications(
        data.notifications
      );

      setSuccess(
        "Notification settings updated successfully."
      );
    } catch (error) {
      console.error(
        "Update notification settings error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update notifications"
      );
    } finally {
      setSavingNotifications(false);
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
                Loading settings...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <>
      <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              System
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Manage your admin profile, platform
              preferences, and notifications.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="flex-1">
                {error}
              </span>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />

              <span className="flex-1">
                {success}
              </span>

              <button
                type="button"
                onClick={() => setSuccess("")}
                className="text-green-500 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ======================================================
              PROFILE
          ====================================================== */}

          <section className="mt-8 rounded-2xl border border-stone-200 bg-white shadow-sm">

            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title="Admin Profile"
              description="Update your administrator information."
            />

            <form onSubmit={handleSaveProfile}>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                <InputField
                  label="Full Name"
                  value={profile?.name || ""}
                  onChange={(value) =>
                    setProfile(
                      (previous) =>
                        previous
                          ? {
                              ...previous,
                              name: value,
                            }
                          : previous
                    )
                  }
                />

                <InputField
                  label="Email Address"
                  type="email"
                  value={profile?.email || ""}
                  onChange={(value) =>
                    setProfile(
                      (previous) =>
                        previous
                          ? {
                              ...previous,
                              email: value,
                            }
                          : previous
                    )
                  }
                />

                <InputField
                  label="Phone Number"
                  value={profile?.phone || ""}
                  onChange={(value) =>
                    setProfile(
                      (previous) =>
                        previous
                          ? {
                              ...previous,
                              phone: value,
                            }
                          : previous
                    )
                  }
                />

                <InputField
                  label="Role"
                  value={
                    profile?.role === "admin"
                      ? "Administrator"
                      : profile?.role || "Administrator"
                  }
                  disabled
                  onChange={() => {}}
                />
              </div>

              <div className="flex justify-end border-t border-stone-100 px-5 py-4 sm:px-6">

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ======================================================
              PLATFORM SETTINGS
          ====================================================== */}

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Globe className="h-5 w-5" />}
              title="Platform Settings"
              description="General settings for the IlmHub platform."
            />

            <div className="divide-y divide-stone-100">

              <SettingRow
                icon={<Globe className="h-4 w-4" />}
                title="Platform Name"
                description="The name displayed throughout the platform."
              >
                <input
                  type="text"
                  value={platform.platformName}
                  onChange={(event) =>
                    setPlatform(
                      (previous) => ({
                        ...previous,
                        platformName:
                          event.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-64"
                />
              </SettingRow>

              <SettingRow
                icon={<Settings className="h-4 w-4" />}
                title="Default Language"
                description="Default language for the platform."
              >
                <select
                  value={platform.language}
                  onChange={(event) =>
                    setPlatform(
                      (previous) => ({
                        ...previous,
                        language:
                          event.target
                            .value as PlatformSettings["language"],
                      })
                    )
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20 sm:w-64"
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Urdu">
                    Urdu
                  </option>

                  <option value="Arabic">
                    Arabic
                  </option>
                </select>
              </SettingRow>

              <SettingRow
                icon={
                  <ShieldCheck className="h-4 w-4" />
                }
                title="Maintenance Mode"
                description="Temporarily disable public access to the platform."
              >
                <Toggle
                  enabled={
                    platform.maintenanceMode
                  }
                  onChange={() =>
                    setPlatform(
                      (previous) => ({
                        ...previous,
                        maintenanceMode:
                          !previous.maintenanceMode,
                      })
                    )
                  }
                />
              </SettingRow>
            </div>

            <div className="flex justify-end border-t border-stone-100 px-5 py-4 sm:px-6">

              <button
                type="button"
                onClick={handleSavePlatform}
                disabled={savingPlatform}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPlatform ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Platform
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ======================================================
              NOTIFICATIONS
          ====================================================== */}

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              description="Control how you receive admin notifications."
            />

            <div className="divide-y divide-stone-100">

              <SettingRow
                icon={<Bell className="h-4 w-4" />}
                title="Admin Notifications"
                description="Receive notifications about important platform activity."
              >
                <Toggle
                  enabled={
                    notifications.notifications
                  }
                  onChange={() =>
                    setNotifications(
                      (previous) => ({
                        ...previous,
                        notifications:
                          !previous.notifications,
                      })
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                icon={<Bell className="h-4 w-4" />}
                title="Email Alerts"
                description="Receive important alerts and system updates by email."
              >
                <Toggle
                  enabled={
                    notifications.emailAlerts
                  }
                  onChange={() =>
                    setNotifications(
                      (previous) => ({
                        ...previous,
                        emailAlerts:
                          !previous.emailAlerts,
                      })
                    )
                  }
                />
              </SettingRow>
            </div>

            <div className="flex justify-end border-t border-stone-100 px-5 py-4 sm:px-6">

              <button
                type="button"
                onClick={
                  handleSaveNotifications
                }
                disabled={
                  savingNotifications
                }
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingNotifications ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Notifications
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ======================================================
              SECURITY
          ====================================================== */}

          <section className="mt-6 rounded-2xl border border-stone-200 bg-white shadow-sm">

            <SectionHeader
              icon={<Lock className="h-5 w-5" />}
              title="Security"
              description="Manage your administrator account security."
            />

            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="text-sm font-medium text-stone-800">
                    Change Password
                  </h3>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-stone-400">
                    Update your administrator password
                    regularly to keep your account secure.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordModal(true)
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-[#d6b56d] hover:bg-stone-50"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ==========================================================
          PASSWORD MODAL
      ========================================================== */}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() =>
            setShowPasswordModal(false)
          }
          onSuccess={(message) => {
            setShowPasswordModal(false);
            setSuccess(message);
          }}
          onError={(message) => {
            setError(message);
          }}
        />
      )}
    </>
  );
}

/* ================================================================
   SECTION HEADER
================================================================ */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-stone-100 p-5 sm:p-6">
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold text-stone-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-stone-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   INPUT
================================================================ */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-stone-100 text-stone-400"
            : "bg-stone-50 text-stone-800 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
        }`}
      />
    </div>
  );
}

/* ================================================================
   SETTING ROW
================================================================ */

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

        <div className="mt-0.5 text-stone-400">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-medium text-stone-800">
            {title}
          </h3>

          <p className="mt-1 max-w-xl text-xs leading-5 text-stone-400">
            {description}
          </p>
        </div>
      </div>

      <div className="sm:shrink-0">
        {children}
      </div>
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
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={enabled}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled
          ? "bg-stone-900"
          : "bg-stone-300"
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
   CHANGE PASSWORD MODAL
================================================================ */

function ChangePasswordModal({
  onClose,
  onSuccess,
  onError,
}: {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Please enter your new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/settings/admin/password`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to change password"
        );
      }

      onSuccess(
        data?.message ||
          "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to change password";

      setError(message);
      onError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4">

      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-stone-100 p-5 sm:p-6">

          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
              <Lock className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-stone-900">
              Change Password
            </h2>

            <p className="mt-1 text-sm leading-5 text-stone-500">
              Enter your current password and choose
              a new secure password.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <p className="text-xs leading-5 text-stone-400">
            Your new password must contain at least
            8 characters.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================================================
   PASSWORD INPUT
================================================================ */

function PasswordInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
      />
    </div>
  );
}

