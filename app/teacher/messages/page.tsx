"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
};

type Message = {
  _id: string;
  sender: User | null;
  recipient: User | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  recipientStatus: "read" | "unread";
  createdAt: string;
};

export default function TeacherMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(
    []
  );

  const [admins, setAdmins] = useState<User[]>(
    []
  );

  const [students, setStudents] = useState<User[]>(
    []
  );

  const [activeTab, setActiveTab] = useState<
    "inbox" | "sent"
  >("inbox");

  const [search, setSearch] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);

  const [showCompose, setShowCompose] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/messages/teacher?type=${activeTab}&search=${encodeURIComponent(
          search
        )}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load messages"
        );
      }

      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch(
        `${API_URL}/messages/teacher/recipients`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load recipients"
        );
      }

      setAdmins(data.admins || []);
      setStudents(data.students || []);
    } catch (err) {
      console.error(
        "Recipients error:",
        err
      );
    }
  };

  const openMessage = async (
    message: Message
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/messages/teacher/${message._id}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to open message"
        );
      }

      setSelectedMessage(data.message);

      setMessages((previous) =>
        previous.map((item) =>
          item._id === message._id
            ? {
                ...item,
                recipientStatus:
                  "read",
              }
            : item
        )
      );

      setUnreadCount((count) =>
        message.recipientStatus ===
        "unread"
          ? Math.max(0, count - 1)
          : count
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to open message"
      );
    }
  };

  const deleteMessage = async (
    messageId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/messages/teacher/${messageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete message"
        );
      }

      setMessages((previous) =>
        previous.filter(
          (item) => item._id !== messageId
        )
      );

      if (
        selectedMessage?._id ===
        messageId
      ) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete message"
      );
    }
  };

  const filteredMessages = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) return messages;

    return messages.filter((item) => {
      return (
        item.subject
          ?.toLowerCase()
          .includes(searchText) ||
        item.message
          ?.toLowerCase()
          .includes(searchText) ||
        item.sender?.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.recipient?.name
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [messages, search]);

  const formatDate = (
    date: string
  ) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-stone-500">
              Teacher Panel / Messages
            </p>

            <h1 className="text-2xl font-semibold text-[#132A4C] sm:text-3xl">
              Messages
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Communicate with administrators and your students.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCompose(true)
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#132A4C] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1b385f]"
          >
            <span className="text-lg">
              +
            </span>
            New Message
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Main */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="border-b border-stone-200 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* Tabs */}
              <div className="flex rounded-xl bg-[#faf9f6] p-1">
                <button
                  onClick={() =>
                    setActiveTab("inbox")
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === "inbox"
                      ? "bg-white text-[#132A4C] shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Inbox

                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-[#967438] px-2 py-0.5 text-[10px] text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() =>
                    setActiveTab("sent")
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === "sent"
                      ? "bg-white text-[#132A4C] shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Sent
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full lg:max-w-sm">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path
                    strokeLinecap="round"
                    d="m20 20-4-4"
                  />
                </svg>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchMessages();
                    }
                  }}
                  placeholder="Search messages..."
                  className="h-10 w-full rounded-xl border border-stone-200 bg-[#faf9f6] pl-10 pr-4 text-sm outline-none transition focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-[#967438]" />

                <p className="mt-3 text-sm text-stone-500">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : filteredMessages.length ===
            0 ? (
            <div className="flex min-h-[400px] items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf9f6] text-[#967438]">
                  <svg
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 font-semibold text-[#132A4C]">
                  No messages
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  {activeTab === "inbox"
                    ? "Your received messages will appear here."
                    : "Your sent messages will appear here."}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredMessages.map(
                (message) => {
                  const isUnread =
                    activeTab === "inbox" &&
                    message.recipientStatus ===
                      "unread";

                  const person =
                    activeTab === "inbox"
                      ? message.sender
                      : message.recipient;

                  return (
                    <button
                      key={message._id}
                      onClick={() =>
                        openMessage(message)
                      }
                      className={`flex w-full items-start gap-4 p-4 text-left transition hover:bg-[#faf9f6] sm:p-5 ${
                        isUnread
                          ? "bg-[#fffcf4]"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#132A4C] text-sm font-semibold text-white">
                        {person?.name
                          ?.split(" ")
                          .slice(0, 2)
                          .map(
                            (word) =>
                              word[0]
                          )
                          .join("")
                          .toUpperCase() ||
                          "U"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p
                            className={`truncate text-sm ${
                              isUnread
                                ? "font-semibold text-[#132A4C]"
                                : "font-medium text-stone-700"
                            }`}
                          >
                            {person?.name ||
                              message.name}
                          </p>

                          <span className="shrink-0 text-xs text-stone-400">
                            {formatDate(
                              message.createdAt
                            )}
                          </span>
                        </div>

                        <p
                          className={`mt-1 truncate text-sm ${
                            isUnread
                              ? "font-semibold text-stone-700"
                              : "text-stone-600"
                          }`}
                        >
                          {message.subject}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-stone-400">
                          {message.message}
                        </p>
                      </div>

                      {isUnread && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#967438]" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          activeTab={activeTab}
          onClose={() =>
            setSelectedMessage(null)
          }
          onDelete={deleteMessage}
          onReply={() => {
            setShowCompose(true);
          }}
        />
      )}

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal
          admins={admins}
          students={students}
          selectedMessage={
            selectedMessage
          }
          onClose={() => {
            setShowCompose(false);
          }}
          onSent={() => {
            setShowCompose(false);
            setSelectedMessage(null);
            fetchMessages();
          }}
        />
      )}
    </main>
  );
}


/* -------------------------------------------------------------------------- */
/* Message Modal                                                              */
/* -------------------------------------------------------------------------- */

function MessageModal({
  message,
  activeTab,
  onClose,
  onDelete,
  onReply,
}: {
  message: Message;
  activeTab: "inbox" | "sent";
  onClose: () => void;
  onDelete: (id: string) => void;
  onReply: () => void;
}) {
  const person =
    activeTab === "inbox"
      ? message.sender
      : message.recipient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#132A4C]/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-stone-200 p-5">
          <div>
            <p className="text-xs text-stone-400">
              {activeTab === "inbox"
                ? "Received Message"
                : "Sent Message"}
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#132A4C]">
              {message.subject}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#132A4C] text-sm font-semibold text-white">
              {person?.name
                ?.split(" ")
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase() ||
                "U"}
            </div>

            <div>
              <p className="font-medium text-[#132A4C]">
                {person?.name ||
                  message.name}
              </p>

              <p className="text-xs text-stone-500">
                {person?.email ||
                  message.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#faf9f6] p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">
              {message.message}
            </p>
          </div>

          <p className="mt-4 text-xs text-stone-400">
            {new Date(
              message.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-200 p-4 sm:flex-row sm:justify-between">
          <button
            onClick={() =>
              onDelete(message._id)
            }
            className="h-10 rounded-xl px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>

          {activeTab === "inbox" && (
            <button
              onClick={onReply}
              className="h-10 rounded-xl bg-[#132A4C] px-5 text-sm font-medium text-white transition hover:bg-[#1b385f]"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Compose Modal                                                              */
/* -------------------------------------------------------------------------- */

function ComposeModal({
  admins,
  students,
  selectedMessage,
  onClose,
  onSent,
}: {
  admins: User[];
  students: User[];
  selectedMessage: Message | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const [recipient, setRecipient] =
    useState("");

  const [subject, setSubject] =
    useState(
      selectedMessage
        ? `Re: ${selectedMessage.subject}`
        : ""
    );

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const sendMessage = async () => {
    try {
      if (
        !recipient ||
        !subject.trim() ||
        !message.trim()
      ) {
        setError(
          "Please complete all fields."
        );
        return;
      }

      setSending(true);
      setError("");

      const response = await fetch(
        `${API_URL}/messages/teacher`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            recipient,
            subject,
            message,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to send message"
        );
      }

      onSent();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#132A4C]/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-stone-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#132A4C]">
              New Message
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              Send a message to an admin or one of your students.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-stone-400 hover:bg-stone-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 p-5">

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Recipient
            </label>

            <select
              value={recipient}
              onChange={(e) =>
                setRecipient(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-sm outline-none focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="">
                Select recipient
              </option>

              {admins.length > 0 && (
                <optgroup label="Administrators">
                  {admins.map(
                    (user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name} — Admin
                      </option>
                    )
                  )}
                </optgroup>
              )}

              {students.length > 0 && (
                <optgroup label="My Students">
                  {students.map(
                    (user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name}
                      </option>
                    )
                  )}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              placeholder="Enter subject"
              className="h-11 w-full rounded-xl border border-stone-200 bg-[#faf9f6] px-3 text-sm outline-none focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              rows={7}
              placeholder="Write your message..."
              className="w-full resize-none rounded-xl border border-stone-200 bg-[#faf9f6] p-3 text-sm leading-6 outline-none focus:border-[#b99a5a] focus:ring-2 focus:ring-[#d6b56d]/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-200 p-4">
          <button
            onClick={onClose}
            disabled={sending}
            className="h-10 rounded-xl border border-stone-200 px-4 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            onClick={sendMessage}
            disabled={sending}
            className="h-10 rounded-xl bg-[#132A4C] px-5 text-sm font-medium text-white transition hover:bg-[#1b385f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending
              ? "Sending..."
              : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}