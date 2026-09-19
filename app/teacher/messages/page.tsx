"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Mail,
  MessageCircle,
  Search,
  Send,
  User,
  X,
} from "lucide-react";

type MessageCategory = "General" | "Course" | "Technical" | "Fatwa";
type MessageStatus = "Unread" | "Read" | "Archived";

type Message = {
  id: number;
  sender: string;
  email: string;
  subject: string;
  message: string;
  category: MessageCategory;
  date: string;
  status: MessageStatus;
};

const messages: Message[] = [
  {
    id: 1,
    sender: "Ahmed Khan",
    email: "ahmed@example.com",
    subject: "Question about Quran course",
    message:
      "Assalamu Alaikum, I wanted to ask about the next lesson and the recommended practice for this week.",
    category: "Course",
    date: "Today, 10:32 AM",
    status: "Unread",
  },
  {
    id: 2,
    sender: "Fatima Ali",
    email: "fatima@example.com",
    subject: "Unable to access my course",
    message:
      "I am unable to open my Quran with Tajweed course lessons. Could you please guide me?",
    category: "Technical",
    date: "Today, 09:15 AM",
    status: "Unread",
  },
  {
    id: 3,
    sender: "Usman Malik",
    email: "usman@example.com",
    subject: "General question",
    message:
      "Could you please tell me what topics will be covered in the upcoming Hadith class?",
    category: "General",
    date: "Yesterday, 04:45 PM",
    status: "Read",
  },
  {
    id: 4,
    sender: "Ayesha Noor",
    email: "ayesha@example.com",
    subject: "Question regarding a Fatwa",
    message:
      "I have a question regarding a matter of worship and would like to know how I can submit it for scholarly review.",
    category: "Fatwa",
    date: "Yesterday, 01:20 PM",
    status: "Read",
  },
  {
    id: 5,
    sender: "Bilal Ahmed",
    email: "bilal@example.com",
    subject: "Arabic classes",
    message:
      "I would like to know whether there are any additional Arabic practice materials available.",
    category: "Course",
    date: "12 Sep 2026",
    status: "Archived",
  },
  {
    id: 6,
    sender: "Maryam Hassan",
    email: "maryam@example.com",
    subject: "Account issue",
    message:
      "I am having an issue with my account and cannot update some of my profile information.",
    category: "Technical",
    date: "11 Sep 2026",
    status: "Read",
  },
];

const categoryOptions = [
  "All Categories",
  "General",
  "Course",
  "Technical",
  "Fatwa",
];

const statusOptions = ["All Status", "Unread", "Read", "Archived"];

function StatusBadge({ status }: { status: MessageStatus }) {
  const styles = {
    Unread: "bg-[#d6b56d]/15 text-[#967438]",
    Read: "bg-stone-100 text-stone-600",
    Archived: "bg-stone-200 text-stone-500",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function CategoryBadge({ category }: { category: MessageCategory }) {
  return (
    <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">
      {category}
    </span>
  );
}

export default function TeacherMessagesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.sender.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText) ||
        item.subject.toLowerCase().includes(searchText) ||
        item.message.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All Categories" || item.category === category;

      const matchesStatus =
        status === "All Status" || item.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const unreadCount = messages.filter(
    (item) => item.status === "Unread"
  ).length;

  const readCount = messages.filter(
    (item) => item.status === "Read"
  ).length;

  const archivedCount = messages.filter(
    (item) => item.status === "Archived"
  ).length;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Communication
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Messages
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Manage questions, course discussions, and messages from your
              students.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
            <MessageCircle className="h-5 w-5 text-[#967438]" />
            <div>
              <p className="text-xs text-stone-500">Unread Messages</p>
              <p className="text-lg font-semibold text-stone-900">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Total Messages</p>
                <p className="mt-2 text-2xl font-semibold">
                  {messages.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Unread</p>
                <p className="mt-2 text-2xl font-semibold">{unreadCount}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d6b56d]/15 text-[#967438]">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Read</p>
                <p className="mt-2 text-2xl font-semibold">{readCount}</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Archived</p>
                <p className="mt-2 text-2xl font-semibold">
                  {archivedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                <Archive className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages, students, or subjects..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#d6b56d] focus:bg-white focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              {categoryOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              {statusOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="mt-6 space-y-3">
          {filteredMessages.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                item.status === "Unread"
                  ? "border-[#d6b56d]/50"
                  : "border-stone-200"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                {/* Sender */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[#d6b56d]">
                    <User className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-stone-900">
                        {item.sender}
                      </h2>

                      <StatusBadge status={item.status} />
                      <CategoryBadge category={item.category} />
                    </div>

                    <p className="mt-1 text-xs text-stone-400">
                      {item.email}
                    </p>

                    <h3 className="mt-3 font-medium text-stone-800">
                      {item.subject}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-500">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Date + Actions */}
                <div className="flex shrink-0 flex-col gap-3 lg:items-end">
                  <span className="text-xs text-stone-400">
                    {item.date}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMessage(item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:border-[#d6b56d] hover:bg-stone-50"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Open
                    </button>

                    {item.status !== "Archived" && (
                      <button
                        onClick={() => setSelectedMessage(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-stone-800"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredMessages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                <Mail className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                No messages found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Try changing your search or filters to find the message you
                are looking for.
              </p>
            </div>
          )}
        </div>

        {/* Result count */}
        {filteredMessages.length > 0 && (
          <p className="mt-5 text-sm text-stone-400">
            Showing {filteredMessages.length} of {messages.length} messages
          </p>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-[#d6b56d]">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-900">
                    {selectedMessage.sender}
                  </h2>

                  <p className="text-xs text-stone-400">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                aria-label="Close message"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={selectedMessage.category} />
                <StatusBadge status={selectedMessage.status} />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-stone-900">
                {selectedMessage.subject}
              </h3>

              <p className="mt-2 text-xs text-stone-400">
                {selectedMessage.date}
              </p>

              <div className="mt-6 rounded-xl bg-stone-50 p-5">
                <p className="text-sm leading-7 text-stone-600">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Close
                </button>

                {selectedMessage.status !== "Archived" && (
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    <Send className="h-4 w-4" />
                    Reply
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}