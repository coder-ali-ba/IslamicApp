"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Mail,
  MessageSquareText,
  Send,
  UserRound,
} from "lucide-react";

import { fatwaCategories } from "@/app/src/lib/fatwa";

export default function AskFatwaForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Backend/API will be connected later.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d6b56d]/10 text-[#967438]">
          <CheckCircle2 size={30} />
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-stone-900">
          Question Submitted
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-500">
          Your question has been received. A qualified scholar can review it
          and provide guidance based on the details you have shared.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Ask Another Question
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      {/* Header */}
      <div className="border-b border-stone-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
            <MessageSquareText size={19} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#967438]">
              Ask a Question
            </p>

            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              Submit your question
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-500">
          Please provide enough context so the question can be understood
          properly.
        </p>
      </div>

      {/* Fields */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
          >
            <UserRound size={14} className="text-[#967438]" />
            Your Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
          >
            <Mail size={14} className="text-[#967438]" />
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
          />
        </div>

        {/* Category */}
        <div className="sm:col-span-2">
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition-all focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
          >
            <option value="" disabled>
              Select a category
            </option>

            {fatwaCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Question */}
        <div className="sm:col-span-2">
          <label
            htmlFor="question"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
          >
            <MessageSquareText
              size={14}
              className="text-[#967438]"
            />
            Your Question
          </label>

          <textarea
            id="question"
            name="question"
            required
            rows={7}
            placeholder="Write your question and provide any important details or circumstances..."
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm leading-6 text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-[#d6b56d] focus:bg-white focus:ring-4 focus:ring-[#d6b56d]/10"
          />
        </div>

        {/* Attachment */}
        <div className="sm:col-span-2">
          <label
            htmlFor="attachment"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700"
          >
            <FileText size={14} className="text-[#967438]" />
            Attachment
            <span className="font-normal text-stone-400">
              (Optional)
            </span>
          </label>

          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500 file:mr-4 file:border-0 file:border-r file:border-stone-200 file:bg-white file:px-4 file:py-3 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-50"
          />

          <p className="mt-2 text-xs text-stone-400">
            PDF, JPG, JPEG or PNG.
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="mt-7 rounded-2xl border border-[#d6b56d]/20 bg-[#d6b56d]/5 p-4">
        <p className="text-xs leading-6 text-stone-600">
          <span className="font-semibold text-stone-800">
            Please note:
          </span>{" "}
          Personal and complex matters may require direct consultation with a
          qualified scholar. Avoid sharing unnecessary private or sensitive
          information.
        </p>
      </div>

      {/* Submit */}
      <div className="mt-7 flex justify-end">
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800"
        >
          Submit Question

          <Send
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </form>
  );
}