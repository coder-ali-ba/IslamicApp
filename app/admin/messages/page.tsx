"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock3,
  Mail,
  MailOpen,
  MessageSquare,
  Search,
  User,
} from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "General" | "Course" | "Technical" | "Fatwa";
  date: string;
  status: "Unread" | "Read" | "Archived";
};

const messages: Message[] = [
  {
    id: "MSG-1001",
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    subject: "Question about Quran course",
    message:
      "I would like to know more about the Quran with Tajweed course and its class schedule.",
    category: "Course",
    date: "Sep 17, 2026",
    status: "Unread",
  },
  {
    id: "MSG-1002",
    name: "Fatima Ali",
    email: "fatima@example.com",
    subject: "Unable to access my course",
    message:
      "I enrolled in a course but I am currently unable to access the lessons from my dashboard.",
    category: "Technical",
    date: "Sep 16, 2026",
    status: "Unread",
  },
  {
    id: "MSG-1003",
    name: "Usman Malik",
    email: "usman@example.com",
    subject: "General question",
    message:
      "Can you please tell me when the next live Hadith class will be available?",
    category: "General",
    date: "Sep 15, 2026",
    status: "Read",
  },
  {
    id: "MSG-1004",
    name: "Ayesha Noor",
    email: "ayesha@example.com",
    subject: "Question regarding a Fatwa",
    message:
      "I have a question regarding a personal matter and would like to ask a qualified scholar.",
    category: "Fatwa",
    date: "Sep 14, 2026",
    status: "Read",
  },
  {
    id: "MSG-1005",
    name: "Bilal Ahmed",
    email: "bilal@example.com",
    subject: "Arabic classes",
    message:
      "Are there any upcoming Arabic speaking practice sessions for beginners?",
    category: "Course",
    date: "Sep 12, 2026",
    status: "Archived",
  },
  {
    id: "MSG-1006",
    name: "Maryam Hassan",
    email: "maryam@example.com",
    subject: "Account issue",
    message:
      "I need help updating some information in my account profile.",
    category: "Technical",
    date: "Sep 10, 2026",
    status: "Read",
  },
];

export default function AdminMessagesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredMessages = useMemo(() => {
    return messages.filter((item) => {
      const value = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.subject.toLowerCase().includes(value) ||
        item.message.toLowerCase().includes(value);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const unread = messages.filter(
    (item) => item.status === "Unread"
  ).length;

  const read = messages.filter(
    (item) => item.status === "Read"
  ).length;

  const archived = messages.filter(
    (item) => item.status === "Archived"
  ).length;

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
            Communication
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Messages
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Manage questions, support requests, and messages from users.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Total Messages"
            value={messages.length}
          />

          <StatCard
            icon={<Mail className="h-5 w-5" />}
            label="Unread"
            value={unread}
          />

          <StatCard
            icon={<MailOpen className="h-5 w-5" />}
            label="Read"
            value={read}
          />

          <StatCard
            icon={<Archive className="h-5 w-5" />}
            label="Archived"
            value={archived}
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search messages, users or subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Course">Course</option>
              <option value="Technical">Technical</option>
              <option value="Fatwa">Fatwa</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="All">All Status</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mt-5">
          <p className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-medium text-stone-800">
              {filteredMessages.length}
            </span>{" "}
            messages
          </p>
        </div>

        {/* Messages */}
        <div className="mt-4 space-y-3">
          {filteredMessages.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                item.status === "Unread"
                  ? "border-[#d6b56d]/50"
                  : "border-stone-200"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                {/* User */}
                <div className="flex min-w-0 flex-1 gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                      item.status === "Unread"
                        ? "bg-stone-900 text-[#d6b56d]"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        className={`text-sm ${
                          item.status === "Unread"
                            ? "font-semibold text-stone-900"
                            : "font-medium text-stone-800"
                        }`}
                      >
                        {item.name}
                      </h2>

                      {item.status === "Unread" && (
                        <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#d6b56d]">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-stone-400">
                      {item.email}
                    </p>

                    <h3 className="mt-4 text-sm font-semibold text-stone-900">
                      {item.subject}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:w-52 lg:flex-col lg:items-end">
                  <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {item.date}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                <span className="text-xs text-stone-400">
                  {item.id}
                </span>

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-[#d6b56d] hover:text-stone-900">
                    <User className="h-3.5 w-3.5" />
                    View User
                  </button>

                  <button className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-stone-800">
                    <MailOpen className="h-3.5 w-3.5" />
                    Open Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-stone-300" />

            <h3 className="mt-4 font-medium text-stone-900">
              No messages found
            </h3>

            <p className="mt-1 text-sm text-stone-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
          {icon}
        </div>

        <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
          IlmHub
        </span>
      </div>

      <p className="mt-5 text-sm text-stone-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value}
      </p>
    </div>
  );
}