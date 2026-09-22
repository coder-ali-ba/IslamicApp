"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import api from "@/app/src/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      if (!user) {
        throw new Error("User information was not returned.");
      }

      if (user.role === "admin") {
        window.location.href = "/admin";
      } else if (
        user.role === "teacher" ||
        user.role === "scholar"
      ) {
        window.location.href = "/teacher";
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

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
          <div className="hidden min-h-[650px] bg-stone-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
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
                  Welcome Back
                </p>

                <h1 className="font-serif text-5xl leading-tight">
                  Continue your journey of knowledge.
                </h1>

                <p className="mt-6 text-sm leading-7 text-stone-400">
                  Access Quran learning, courses, classes and Islamic
                  educational resources from your IlmHub account.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Learn • Teach • Share Knowledge
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
                  Account
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Sign in to continue to your IlmHub account.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-stone-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-[#967438] transition hover:text-stone-900"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs text-stone-400">
                  New to IlmHub?
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <Link
                href="/register"
                className="flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
              >
                Create an account
              </Link>

              <p className="mt-8 text-center text-xs leading-5 text-stone-400">
                By continuing, you agree to IlmHub&apos;s terms and
                privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}