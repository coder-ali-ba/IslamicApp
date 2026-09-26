"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MailOpen,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  User,
  X,
} from "lucide-react";

type MessageStatus = "read" | "unread";

type UserRole = "student" | "teacher" | "scholar" | "admin";

type Recipient = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified?: boolean;
};

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;

  status: MessageStatus;

  recipientStatus?: MessageStatus;

  createdAt: string;
  updatedAt?: string;

  sender?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;
  } | null;

  recipient?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;
  } | null;
};

type ApiResponse = {
  success: boolean;
  count: number;
  messages: Message[];
  message?: string;
};

type RecipientsResponse = {
  success: boolean;
  count: number;
  users: Recipient[];
  message?: string;
};

type CreateMessageResponse = {
  success: boolean;
  message: string;
  data?: Message;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    "all" | MessageStatus
  >("all");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);

  const [loadingMessage, setLoadingMessage] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  /* =========================================================
     NEW MESSAGE STATE
  ========================================================= */

  const [showNewMessage, setShowNewMessage] =
    useState(false);

  const [recipients, setRecipients] =
    useState<Recipient[]>([]);

  const [loadingRecipients, setLoadingRecipients] =
    useState(false);

  const [recipientSearch, setRecipientSearch] =
    useState("");

  const [selectedRecipient, setSelectedRecipient] =
    useState<Recipient | null>(null);

  const [newSubject, setNewSubject] = useState("");

  const [newMessage, setNewMessage] = useState("");

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [newMessageError, setNewMessageError] =
    useState("");

  const [newMessageSuccess, setNewMessageSuccess] =
    useState("");

  /* =========================================================
     FETCH ALL MESSAGES
  ========================================================= */

  const fetchMessages = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (status !== "all") {
          params.set("status", status);
        }

        const query = params.toString();

        const response = await fetch(
          `${API_URL}/messages/admin${
            query ? `?${query}` : ""
          }`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data: ApiResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load messages"
          );
        }

        setMessages(data.messages || []);
      } catch (error) {
        console.error(
          "Fetch Messages Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load messages"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, status]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchMessages]);

  /* =========================================================
     FETCH MESSAGE RECIPIENTS
  ========================================================= */

  const fetchRecipients = async () => {
    try {
      setLoadingRecipients(true);
      setNewMessageError("");

      const response = await fetch(
        `${API_URL}/messages/admin/recipients`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: RecipientsResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load recipients"
        );
      }

      setRecipients(data.users || []);
    } catch (error) {
      console.error(
        "Fetch Recipients Error:",
        error
      );

      setNewMessageError(
        error instanceof Error
          ? error.message
          : "Failed to load recipients"
      );
    } finally {
      setLoadingRecipients(false);
    }
  };

  /* =========================================================
     OPEN NEW MESSAGE MODAL
  ========================================================= */

  const openNewMessage = () => {
    setShowNewMessage(true);

    setSelectedRecipient(null);
    setRecipientSearch("");
    setNewSubject("");
    setNewMessage("");
    setNewMessageError("");
    setNewMessageSuccess("");

    fetchRecipients();
  };

  /* =========================================================
     CLOSE NEW MESSAGE MODAL
  ========================================================= */

  const closeNewMessage = () => {
    if (sendingMessage) return;

    setShowNewMessage(false);

    setSelectedRecipient(null);
    setRecipientSearch("");
    setNewSubject("");
    setNewMessage("");
    setNewMessageError("");
    setNewMessageSuccess("");
  };

  /* =========================================================
     FILTER RECIPIENTS
  ========================================================= */

  const filteredRecipients = useMemo(() => {
    const searchText =
      recipientSearch.trim().toLowerCase();

    if (!searchText) {
      return recipients;
    }

    return recipients.filter((user) => {
      return (
        user.name
          .toLowerCase()
          .includes(searchText) ||
        user.email
          .toLowerCase()
          .includes(searchText) ||
        user.role
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [recipients, recipientSearch]);

  /* =========================================================
     SEND NEW ADMIN MESSAGE
  ========================================================= */

  const sendNewMessage = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setNewMessageError("");
    setNewMessageSuccess("");

    if (!selectedRecipient) {
      setNewMessageError(
        "Please select a recipient."
      );
      return;
    }

    if (!newSubject.trim()) {
      setNewMessageError(
        "Please enter a subject."
      );
      return;
    }

    if (!newMessage.trim()) {
      setNewMessageError(
        "Please enter your message."
      );
      return;
    }

    if (newMessage.trim().length < 5) {
      setNewMessageError(
        "Message must be at least 5 characters."
      );
      return;
    }

    try {
      setSendingMessage(true);

      const response = await fetch(
        `${API_URL}/messages/admin`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: selectedRecipient._id,
            subject: newSubject.trim(),
            message: newMessage.trim(),
          }),
        }
      );

      const data: CreateMessageResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to send message"
        );
      }

      setNewMessageSuccess(
        "Message sent successfully."
      );

      setNewSubject("");
      setNewMessage("");
      setSelectedRecipient(null);
      setRecipientSearch("");

      /*
       * Refresh admin message list so the newly
       * created message appears immediately.
       */
      await fetchMessages(true);

      /*
       * Give the success message a moment to be
       * visible before closing the modal.
       */
      setTimeout(() => {
        setShowNewMessage(false);
        setNewMessageSuccess("");
      }, 900);
    } catch (error) {
      console.error(
        "Send New Message Error:",
        error
      );

      setNewMessageError(
        error instanceof Error
          ? error.message
          : "Failed to send message"
      );
    } finally {
      setSendingMessage(false);
    }
  };

  /* =========================================================
     MESSAGE COUNTS
  ========================================================= */

  const unread = useMemo(
    () =>
      messages.filter(
        (item) => item.status === "unread"
      ).length,
    [messages]
  );

  const read = useMemo(
    () =>
      messages.filter(
        (item) => item.status === "read"
      ).length,
    [messages]
  );

  const total = messages.length;

  /* =========================================================
     MARK READ
  ========================================================= */

  const markAsRead = async (
    messageId: string
  ) => {
    try {
      setActionLoading(messageId);

      const response = await fetch(
        `${API_URL}/messages/admin/${messageId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to mark message as read"
        );
      }

      setMessages((prev) =>
        prev.map((item) =>
          item._id === messageId
            ? {
                ...item,
                status: "read",
              }
            : item
        )
      );

      setSelectedMessage((prev) =>
        prev && prev._id === messageId
          ? {
              ...prev,
              status: "read",
            }
          : prev
      );
    } catch (error) {
      console.error(
        "Mark Read Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to mark message as read"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     MARK UNREAD
  ========================================================= */

  const markAsUnread = async (
    messageId: string
  ) => {
    try {
      setActionLoading(messageId);

      const response = await fetch(
        `${API_URL}/messages/admin/${messageId}/unread`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to mark message as unread"
        );
      }

      setMessages((prev) =>
        prev.map((item) =>
          item._id === messageId
            ? {
                ...item,
                status: "unread",
              }
            : item
        )
      );

      setSelectedMessage((prev) =>
        prev && prev._id === messageId
          ? {
              ...prev,
              status: "unread",
            }
          : prev
      );
    } catch (error) {
      console.error(
        "Mark Unread Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to mark message as unread"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     DELETE MESSAGE
  ========================================================= */

  const deleteMessage = async (
    messageId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(messageId);

      const response = await fetch(
        `${API_URL}/messages/admin/${messageId}`,
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

      setMessages((prev) =>
        prev.filter(
          (item) => item._id !== messageId
        )
      );

      if (
        selectedMessage?._id === messageId
      ) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error(
        "Delete Message Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete message"
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     OPEN MESSAGE
  ========================================================= */

  const openMessage = async (
    messageId: string
  ) => {
    try {
      setLoadingMessage(true);

      const response = await fetch(
        `${API_URL}/messages/admin/${messageId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load message"
        );
      }

      setSelectedMessage(data.message);

      /*
       * Automatically mark incoming unread messages
       * as read when admin opens them.
       */
      if (data.message.status === "unread") {
        await markAsRead(messageId);
      }
    } catch (error) {
      console.error(
        "Open Message Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load message"
      );
    } finally {
      setLoadingMessage(false);
    }
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  /* =========================================================
     ROLE LABEL
  ========================================================= */

  const formatRole = (role?: string) => {
    if (!role) return "";

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1)
    );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#967438]">
              Communication
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Messages
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage questions, support requests,
              and messages from users.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* NEW MESSAGE */}

            <button
              onClick={openNewMessage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              <Plus className="h-4 w-4" />
              New Message
            </button>

            {/* REFRESH */}

            <button
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={
              <MessageSquare className="h-5 w-5" />
            }
            label="Total Messages"
            value={total}
          />

          <StatCard
            icon={<Mail className="h-5 w-5" />}
            label="Unread"
            value={unread}
          />

          <StatCard
            icon={
              <MailOpen className="h-5 w-5" />
            }
            label="Read"
            value={read}
          />
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                placeholder="Search messages, users or subjects..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
              />
            </div>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "all"
                    | MessageStatus
                )
              }
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
            >
              <option value="all">
                All Status
              </option>

              <option value="unread">
                Unread
              </option>

              <option value="read">
                Read
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              onClick={() => fetchMessages()}
              className="mt-2 text-sm font-medium text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-stone-200 bg-white py-20">
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading messages...
            </div>
          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading && (
          <div className="mt-5">
            <p className="text-sm text-stone-500">
              Showing{" "}
              <span className="font-medium text-stone-800">
                {messages.length}
              </span>{" "}
              messages
            </p>
          </div>
        )}

        {/* =================================================
            MESSAGE LIST
        ================================================= */}

        {!loading && messages.length > 0 && (
          <div className="mt-4 space-y-3">
            {messages.map((item) => {
              const isOutgoing =
                Boolean(item.recipient);

              return (
                <div
                  key={item._id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    item.status === "unread"
                      ? "border-[#d6b56d]/50"
                      : "border-stone-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                    {/* USER */}

                    <div className="flex min-w-0 flex-1 gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                          item.status ===
                          "unread"
                            ? "bg-stone-900 text-[#d6b56d]"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {(
                          item.recipient?.name ||
                          item.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className={`text-sm ${
                              item.status ===
                              "unread"
                                ? "font-semibold text-stone-900"
                                : "font-medium text-stone-800"
                            }`}
                          >
                            {isOutgoing
                              ? `To: ${
                                  item.recipient
                                    ?.name ||
                                  item.name
                                }`
                              : item.name}
                          </h2>

                          {isOutgoing && (
                            <span className="rounded-full bg-[#d6b56d]/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#967438]">
                              Sent
                            </span>
                          )}

                          {!isOutgoing &&
                            item.status ===
                              "unread" && (
                              <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#d6b56d]">
                                New
                              </span>
                            )}
                        </div>

                        <p className="mt-1 text-xs text-stone-400">
                          {isOutgoing
                            ? item.recipient
                                ?.email ||
                              item.email
                            : item.email}
                        </p>

                        {isOutgoing &&
                          item.recipient
                            ?.role && (
                            <p className="mt-1 text-xs text-stone-400">
                              Recipient:{" "}
                              {formatRole(
                                item.recipient
                                  .role
                              )}
                            </p>
                          )}

                        <h3 className="mt-4 text-sm font-semibold text-stone-900">
                          {item.subject}
                        </h3>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {/* META */}

                    <div className="flex shrink-0 items-center gap-2 lg:w-48 lg:flex-col lg:items-end">
                      <StatusBadge
                        status={item.status}
                      />

                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Clock3 className="h-3.5 w-3.5" />

                        {formatDate(
                          item.createdAt
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                    <span className="text-xs text-stone-400">
                      ID: {item._id}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {!isOutgoing &&
                        (item.status ===
                        "read" ? (
                          <button
                            onClick={() =>
                              markAsUnread(
                                item._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              item._id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-[#d6b56d] hover:text-stone-900 disabled:opacity-50"
                          >
                            {actionLoading ===
                            item._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Mail className="h-3.5 w-3.5" />
                            )}

                            Mark Unread
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              markAsRead(
                                item._id
                              )
                            }
                            disabled={
                              actionLoading ===
                              item._id
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:border-[#d6b56d] hover:text-stone-900 disabled:opacity-50"
                          >
                            {actionLoading ===
                            item._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}

                            Mark Read
                          </button>
                        ))}

                      <button
                        onClick={() =>
                          openMessage(
                            item._id
                          )
                        }
                        disabled={
                          loadingMessage
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
                      >
                        {loadingMessage ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <MailOpen className="h-3.5 w-3.5" />
                        )}

                        Open Message
                      </button>

                      <button
                        onClick={() =>
                          deleteMessage(
                            item._id
                          )
                        }
                        disabled={
                          actionLoading ===
                          item._id
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          messages.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-stone-300" />

              <h3 className="mt-4 font-medium text-stone-900">
                No messages found
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Try changing your search or
                status filter.
              </p>
            </div>
          )}
      </div>

      {/* =====================================================
          MESSAGE DETAIL MODAL
      ===================================================== */}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-200 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#967438]">
                  Message Details
                </p>

                <h2 className="mt-1 text-xl font-semibold text-stone-900">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-5">

              {/* BASIC INFO */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs text-stone-400">
                    Sender
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {selectedMessage.sender
                      ?.name ||
                      selectedMessage.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {selectedMessage.sender
                      ?.email ||
                      selectedMessage.email}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs text-stone-400">
                    Recipient
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {selectedMessage
                      .recipient?.name ||
                      "IlmHub Admin"}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {selectedMessage
                      .recipient?.email ||
                      "Admin inbox"}
                  </p>
                </div>

                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs text-stone-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={
                        selectedMessage.status
                      }
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs text-stone-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </p>
                </div>
              </div>

              {/* RECIPIENT ROLE */}

              {selectedMessage.recipient
                ?.role && (
                <div className="rounded-xl border border-[#d6b56d]/30 bg-[#d6b56d]/5 p-4">
                  <p className="text-xs text-[#967438]">
                    Recipient Role
                  </p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {formatRole(
                      selectedMessage
                        .recipient.role
                    )}
                  </p>
                </div>
              )}

              {/* MESSAGE */}

              <div>
                <p className="mb-2 text-sm font-medium text-stone-800">
                  Message
                </p>

                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
                    {
                      selectedMessage.message
                    }
                  </p>
                </div>
              </div>

              {/* SENDER ACCOUNT */}

              {selectedMessage.sender && (
                <div>
                  <p className="mb-2 text-sm font-medium text-stone-800">
                    Sender Account
                  </p>

                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[#d6b56d]">
                        <User className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-stone-900">
                          {selectedMessage
                            .sender
                            .name ||
                            selectedMessage.name}
                        </p>

                        <p className="text-xs text-stone-500">
                          {selectedMessage
                            .sender
                            .email ||
                            selectedMessage.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {selectedMessage
                        .sender.role && (
                        <span className="rounded-full bg-white px-3 py-1.5 text-stone-600">
                          Role:{" "}
                          {formatRole(
                            selectedMessage
                              .sender.role
                          )}
                        </span>
                      )}

                      <span className="rounded-full bg-white px-3 py-1.5 text-stone-600">
                        {selectedMessage
                          .sender.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                      <span className="rounded-full bg-white px-3 py-1.5 text-stone-600">
                        {selectedMessage
                          .sender.isVerified
                          ? "Verified"
                          : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-wrap justify-end gap-2 border-t border-stone-100 pt-4">
                {!selectedMessage
                  .recipient &&
                  (selectedMessage.status ===
                  "read" ? (
                    <button
                      onClick={() =>
                        markAsUnread(
                          selectedMessage._id
                        )
                      }
                      className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Mark Unread
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        markAsRead(
                          selectedMessage._id
                        )
                      }
                      className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Mark Read
                    </button>
                  ))}

                <button
                  onClick={() =>
                    deleteMessage(
                      selectedMessage._id
                    )
                  }
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NEW MESSAGE MODAL
      ===================================================== */}

      {showNewMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-stone-200 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#967438]">
                  Communication
                </p>

                <h2 className="mt-1 text-xl font-semibold text-stone-900">
                  New Message
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Send a message to a student,
                  teacher or scholar.
                </p>
              </div>

              <button
                onClick={closeNewMessage}
                disabled={sendingMessage}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={sendNewMessage}
              className="space-y-5 p-5"
            >

              {/* ERROR */}

              {newMessageError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">
                    {newMessageError}
                  </p>
                </div>
              )}

              {/* SUCCESS */}

              {newMessageSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />

                    <p className="text-sm font-medium text-green-700">
                      {newMessageSuccess}
                    </p>
                  </div>
                </div>
              )}

              {/* RECIPIENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-800">
                  Recipient
                </label>

                {selectedRecipient ? (
                  <div className="rounded-xl border border-[#d6b56d] bg-[#d6b56d]/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-sm font-semibold text-[#d6b56d]">
                          {selectedRecipient.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-900">
                            {
                              selectedRecipient.name
                            }
                          </p>

                          <p className="truncate text-xs text-stone-500">
                            {
                              selectedRecipient.email
                            }
                          </p>

                          <span className="mt-1 inline-block rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-stone-600">
                            {formatRole(
                              selectedRecipient.role
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRecipient(
                            null
                          )
                        }
                        className="shrink-0 rounded-lg p-2 text-stone-400 hover:bg-white hover:text-stone-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                      <input
                        type="text"
                        value={recipientSearch}
                        onChange={(e) =>
                          setRecipientSearch(
                            e.target.value
                          )
                        }
                        placeholder="Search student, teacher or scholar..."
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                      />
                    </div>

                    <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-stone-200 bg-white">
                      {loadingRecipients ? (
                        <div className="flex items-center justify-center gap-2 p-6 text-sm text-stone-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading recipients...
                        </div>
                      ) : filteredRecipients.length >
                        0 ? (
                        filteredRecipients.map(
                          (user) => (
                            <button
                              key={user._id}
                              type="button"
                              onClick={() =>
                                setSelectedRecipient(
                                  user
                                )
                              }
                              className="flex w-full items-center gap-3 border-b border-stone-100 p-3 text-left transition last:border-b-0 hover:bg-stone-50"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-semibold text-stone-600">
                                {user.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-stone-900">
                                  {user.name}
                                </p>

                                <p className="truncate text-xs text-stone-400">
                                  {user.email}
                                </p>
                              </div>

                              <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-stone-600">
                                {formatRole(
                                  user.role
                                )}
                              </span>
                            </button>
                          )
                        )
                      ) : (
                        <div className="p-6 text-center text-sm text-stone-400">
                          No recipients found.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* SUBJECT */}

              <div>
                <label
                  htmlFor="new-message-subject"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Subject
                </label>

                <input
                  id="new-message-subject"
                  type="text"
                  value={newSubject}
                  onChange={(e) =>
                    setNewSubject(
                      e.target.value
                    )
                  }
                  maxLength={200}
                  placeholder="Enter message subject..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1 text-right text-xs text-stone-400">
                  {newSubject.length}/200
                </p>
              </div>

              {/* MESSAGE */}

              <div>
                <label
                  htmlFor="new-message-content"
                  className="mb-2 block text-sm font-medium text-stone-800"
                >
                  Message
                </label>

                <textarea
                  id="new-message-content"
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(
                      e.target.value
                    )
                  }
                  maxLength={5000}
                  rows={7}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d6b56d] focus:ring-2 focus:ring-[#d6b56d]/20"
                />

                <p className="mt-1 text-right text-xs text-stone-400">
                  {newMessage.length}/5000
                </p>
              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap justify-end gap-2 border-t border-stone-100 pt-5">
                <button
                  type="button"
                  onClick={closeNewMessage}
                  disabled={sendingMessage}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sendingMessage}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingMessage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: MessageStatus;
}) {
  if (status === "read") {
    return (
      <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600">
        Read
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-[#d6b56d]">
      Unread
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

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

      <p className="mt-5 text-sm text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-stone-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}