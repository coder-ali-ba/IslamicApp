"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import api from "@/app/src/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(
        response.data?.message ||
          "Account created successfully. You can now sign in."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to create your account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_20px_70px_rgba(28,25,23,0.08)] lg:grid-cols-2">
          {/* Left */}
          <div className="hidden min-h-[700px] bg-stone-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d6b56d] font-serif text-lg font-bold text-stone-950">
                  I
                </div>

                <span className="text-xl font-semibold tracking-tight">
                  IlmHub
                </span>
              </Link>

              <div className="mt-24 max-w-md">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#d6b56d]">
                  Join IlmHub
                </p>

                <h1 className="font-serif text-5xl leading-tight">
                  Learn. Grow. Share knowledge.
                </h1>

                <p className="mt-6 text-sm leading-7 text-stone-400">
                  Create your IlmHub account and explore Quran learning,
                  Islamic courses, classes, teachers and educational
                  resources.
                </p>

                <div className="mt-10 space-y-4">
                  {[
                    "Access Islamic learning resources",
                    "Join courses and live classes",
                    "Learn from teachers and scholars",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-stone-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d6b56d]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Knowledge is a trust.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
                  Create Account
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                  Get started
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Create your account to start learning with IlmHub.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3.5 pl-11 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create account"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-200" />

                <span className="text-xs text-stone-400">
                  Already have an account?
                </span>

                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Sign in instead
              </Link>

              <p className="mt-8 text-center text-xs leading-5 text-stone-400">
                By creating an account, you agree to IlmHub&apos;s terms
                and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}