"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Video,
  Volume2,
} from "lucide-react";

type UserInfo = {
  id?: string;
  name?: string;
  role?: string;
};

type JoinData = {
  classId?: string;
  roomId?: string;
  peerId?: string;
  user?: UserInfo;
  routerRtpCapabilities?: mediasoupClient.types.RtpCapabilities;
};

type JoinResponse = {
  success?: boolean;
  message?: string;
  data?: JoinData | { data?: JoinData };
};

type TransportData = {
  id: string;
  iceParameters: mediasoupClient.types.IceParameters;
  iceCandidates: mediasoupClient.types.IceCandidate[];
  dtlsParameters: mediasoupClient.types.DtlsParameters;
};

type TransportResponse = {
  success?: boolean;
  message?: string;
  data?: TransportData;
};

type ProducerResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
  };
};

type ConsumerData = {
  id: string;
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: mediasoupClient.types.RtpParameters;
};

type ConsumerResponse = {
  success?: boolean;
  message?: string;
  data?: ConsumerData;
};

type ExistingProducer = {
  producerId: string;
  peerId: string;
  kind: "audio" | "video";
  user?: UserInfo;
};

type RemoteParticipant = {
  peerId: string;
  userId?: string;
  name: string;
  role?: string;
  stream: MediaStream;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || API_URL.replace(/\/api\/?$/, "");

function RemoteParticipantTile({
  participant,
}: {
  participant: RemoteParticipant;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;

    if (!element) {
      return;
    }

    element.srcObject = participant.stream;

    const playVideo = async () => {
      try {
        await element.play();
      } catch {
        // Browser may wait for user interaction before autoplay.
      }
    };

    void playVideo();

    return () => {
      if (element.srcObject === participant.stream) {
        element.srcObject = null;
      }
    };
  }, [participant.stream]);

  return (
    <div className="relative min-h-[250px] overflow-hidden rounded-xl bg-[#111827]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {participant.name}
            </p>

            <p className="text-xs text-slate-300">
              {participant.role || "Student"}
            </p>
          </div>

          <Volume2 className="h-4 w-4 shrink-0 text-emerald-300" />
        </div>
      </div>
    </div>
  );
}

export default function TeacherLiveClassroomPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const [classId, setClassId] = useState("");

  const [status, setStatus] = useState<
    "loading" | "connecting" | "connected" | "error"
  >("loading");

  const [error, setError] = useState("");

  const [userName, setUserName] = useState("Teacher");
  const [userRole, setUserRole] = useState("Teacher");

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);

  const socketRef = useRef<Socket | null>(null);

  const deviceRef = useRef<mediasoupClient.types.Device | null>(null);

  const sendTransportRef = useRef<mediasoupClient.types.Transport | null>(null);

  const recvTransportRef = useRef<mediasoupClient.types.Transport | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);

  const audioProducerRef = useRef<mediasoupClient.types.Producer | null>(null);

  const videoProducerRef = useRef<mediasoupClient.types.Producer | null>(null);

  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const mountedRef = useRef(true);

  const updateRemoteParticipant = useCallback(
    (
      peerId: string,
      data: {
        userId?: string;
        name?: string;
        role?: string;
        track?: MediaStreamTrack;
      },
    ) => {
      const existingStream =
        remoteStreamsRef.current.get(peerId) || new MediaStream();

      if (data.track) {
        const alreadyAdded = existingStream
          .getTracks()
          .some((track) => track.id === data.track?.id);

        if (!alreadyAdded) {
          existingStream.addTrack(data.track);
        }
      }

      remoteStreamsRef.current.set(peerId, existingStream);

      setRemoteParticipants((current) => {
        const existing = current.find(
          (participant) => participant.peerId === peerId,
        );

        if (!existing) {
          return [
            ...current,
            {
              peerId,
              userId: data.userId,
              name: data.name || "Student",
              role: data.role || "Student",
              stream: existingStream,
            },
          ];
        }

        return current.map((participant) =>
          participant.peerId === peerId
            ? {
                ...participant,
                userId: data.userId || participant.userId,
                name: data.name || participant.name,
                role: data.role || participant.role,
                stream: existingStream,
              }
            : participant,
        );
      });
    },
    [],
  );

  const removeRemoteParticipant = useCallback((peerId: string) => {
    const stream = remoteStreamsRef.current.get(peerId);

    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    remoteStreamsRef.current.delete(peerId);

    setRemoteParticipants((current) =>
      current.filter((participant) => participant.peerId !== peerId),
    );
  }, []);

  const consumeProducer = useCallback(
    async (producer: ExistingProducer) => {
      const socket = socketRef.current;
      const recvTransport = recvTransportRef.current;
      const device = deviceRef.current;

      if (!socket || !recvTransport || !device) {
        return;
      }

      try {
        const response = await new Promise<ConsumerResponse>((resolve) => {
          socket.emit(
            "consume",
            {
              classId,
              producerId: producer.producerId,
              transportId: recvTransport.id,
              rtpCapabilities: device.rtpCapabilities,
            },
            resolve,
          );
        });

        if (!response.success || !response.data) {
          console.error("Consume failed:", response.message);
          return;
        }

        const consumerData = response.data;

        const consumer = await recvTransport.consume({
          id: consumerData.id,
          producerId: consumerData.producerId,
          kind: consumerData.kind,
          rtpParameters: consumerData.rtpParameters,
        });

        updateRemoteParticipant(producer.peerId, {
          userId: producer.user?.id,
          name: producer.user?.name || "Student",
          role: producer.user?.role || "Student",
          track: consumer.track,
        });

        socket.emit(
          "resume-consumer",
          {
            consumerId: consumer.id,
          },
          (resumeResponse: { success?: boolean; message?: string }) => {
            if (!resumeResponse?.success) {
              console.error("Resume consumer failed:", resumeResponse?.message);
            }
          },
        );

        consumer.on("transportclose", () => {
          console.log("Consumer transport closed:", consumer.id);
        });

        consumer.on("producerclose", () => {
          removeRemoteParticipant(producer.peerId);
        });
      } catch (consumeError) {
        console.error("Consumer error:", consumeError);
      }
    },
    [classId, removeRemoteParticipant, updateRemoteParticipant],
  );

  const createSendTransport = useCallback(async () => {
    const socket = socketRef.current;
    const device = deviceRef.current;

    if (!socket || !device) {
      throw new Error("Socket or mediasoup device is not ready.");
    }

    const response = await new Promise<unknown>((resolve) => {
      socket.emit(
        "create-transport",
        {
          classId,
          direction: "send",
        },
        (result: unknown) => {
          console.log("CREATE SEND TRANSPORT RESPONSE:", result);
          resolve(result);
        },
      );
    });

    console.log(
      "CREATE SEND TRANSPORT RESPONSE JSON:",
      JSON.stringify(response, null, 2),
    );

    const transportResponse =
      response && typeof response === "object"
        ? (response as Record<string, unknown>)
        : {};

    const transportData =
      transportResponse.data && typeof transportResponse.data === "object"
        ? (transportResponse.data as Record<string, unknown>)
        : null;

    if (!transportData) {
      throw new Error(
        typeof transportResponse.message === "string"
          ? transportResponse.message
          : "Send transport could not be created.",
      );
    }

    if (
      !transportData.id ||
      !transportData.iceParameters ||
      !transportData.iceCandidates ||
      !transportData.dtlsParameters
    ) {
      console.error("Invalid send transport response:", transportResponse);

      throw new Error("Server returned an invalid send transport.");
    }

    const transport = device.createSendTransport({
      id: String(transportData.id),
      iceParameters:
        transportData.iceParameters as mediasoupClient.types.IceParameters,
      iceCandidates:
        transportData.iceCandidates as mediasoupClient.types.IceCandidate[],
      dtlsParameters:
        transportData.dtlsParameters as mediasoupClient.types.DtlsParameters,
    });

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      socket.emit(
        "connect-transport",
        {
          classId,
          transportId: transport.id,
          dtlsParameters,
        },
        (result: { success?: boolean; message?: string }) => {
          if (result?.success) {
            callback();
          } else {
            errback(
              new Error(result?.message || "Send transport connection failed."),
            );
          }
        },
      );
    });

    transport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
      socket.emit(
        "produce",
        {
          classId,
          transportId: transport.id,
          kind,
          rtpParameters,
        },
        (result: ProducerResponse) => {
          if (result?.success && result.data?.id) {
            callback({
              id: result.data.id,
            });
          } else {
            errback(new Error(result?.message || "Producer creation failed."));
          }
        },
      );
    });

    transport.on("connectionstatechange", (connectionState) => {
      if (connectionState === "failed" || connectionState === "closed") {
        console.error("Send transport:", connectionState);
      }
    });

    sendTransportRef.current = transport;
  }, [classId]);

  const createRecvTransport = useCallback(async () => {
    const socket = socketRef.current;
    const device = deviceRef.current;

    if (!socket || !device) {
      throw new Error("Socket or mediasoup device is not ready.");
    }

    const response = await new Promise<TransportResponse>((resolve) => {
      socket.emit(
        "create-transport",
        {
          classId,
          direction: "recv",
        },
        resolve,
      );
    });

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Receive transport could not be created.",
      );
    }

    const transportData = response.data;

    const transport = device.createRecvTransport({
      id: transportData.id,
      iceParameters: transportData.iceParameters,
      iceCandidates: transportData.iceCandidates,
      dtlsParameters: transportData.dtlsParameters,
    });

    transport.on("connect", ({ dtlsParameters }, callback, errback) => {
      socket.emit(
        "connect-transport",
        {
          classId,
          transportId: transport.id,
          dtlsParameters,
        },
        (result: { success?: boolean; message?: string }) => {
          if (result?.success) {
            callback();
          } else {
            errback(
              new Error(
                result?.message || "Receive transport connection failed.",
              ),
            );
          }
        },
      );
    });

    transport.on("connectionstatechange", (connectionState) => {
      if (connectionState === "failed" || connectionState === "closed") {
        console.error("Receive transport:", connectionState);
      }
    });

    recvTransportRef.current = transport;
  }, [classId]);

  const startLocalMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const sendTransport = sendTransportRef.current;

    if (!sendTransport) {
      throw new Error("Send transport is not ready.");
    }

    const audioTrack = stream.getAudioTracks()[0];

    const videoTrack = stream.getVideoTracks()[0];

    if (audioTrack) {
      audioProducerRef.current = await sendTransport.produce({
        track: audioTrack,
      });
    }

    if (videoTrack) {
      videoProducerRef.current = await sendTransport.produce({
        track: videoTrack,
      });
    }
  }, []);

  const getExistingProducers = useCallback(async () => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    const response = await new Promise<{
      success?: boolean;
      message?: string;
      data?: ExistingProducer[];
    }>((resolve) => {
      socket.emit(
        "get-producers",
        {
          classId,
        },
        resolve,
      );
    });

    if (!response.success) {
      console.error("Could not get producers:", response.message);
      return;
    }

    for (const producer of response.data || []) {
      await consumeProducer(producer);
    }
  }, [classId, consumeProducer]);

  const cleanup = useCallback(() => {
    try {
      audioProducerRef.current?.close();
      videoProducerRef.current?.close();

      sendTransportRef.current?.close();
      recvTransportRef.current?.close();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());

      localStreamRef.current = null;

      remoteStreamsRef.current.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });

      remoteStreamsRef.current.clear();

      socketRef.current?.emit("leave-class", {
        classId,
      });

      socketRef.current?.disconnect();

      socketRef.current = null;

      sendTransportRef.current = null;
      recvTransportRef.current = null;

      audioProducerRef.current = null;
      videoProducerRef.current = null;

      deviceRef.current = null;
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
  }, [classId]);

  const initializeClassroom = useCallback(async () => {
    if (!classId) {
      return;
    }

    try {
      setStatus("connecting");
      setError("");

      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        autoConnect: true,
      });

      socketRef.current = socket;

      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          reject(new Error("Live classroom server connection timed out."));
        }, 15000);

        socket.once("connect", () => {
          window.clearTimeout(timeout);
          resolve();
        });

        socket.once("connect_error", (socketError) => {
          window.clearTimeout(timeout);
          reject(socketError);
        });
      });

      const joinResponse = await new Promise<unknown>((resolve) => {
        socket.emit(
          "join-class",
          {
            classId,
          },
          (response: unknown) => {
            console.log("RAW join-class response:", response);
            resolve(response);
          },
        );
      });

      console.log(
        "RAW join-class response JSON:",
        JSON.stringify(joinResponse, null, 2),
      );

      const responseObject =
        joinResponse && typeof joinResponse === "object"
          ? (joinResponse as Record<string, unknown>)
          : {};

      const directData =
        responseObject.data && typeof responseObject.data === "object"
          ? (responseObject.data as Record<string, unknown>)
          : null;

      const nestedData =
        directData?.data && typeof directData.data === "object"
          ? (directData.data as Record<string, unknown>)
          : null;

      const joinData = directData?.routerRtpCapabilities
        ? directData
        : nestedData?.routerRtpCapabilities
          ? nestedData
          : responseObject.routerRtpCapabilities
            ? responseObject
            : null;

      console.log("NORMALIZED joinData:", joinData);

      if (!joinData) {
        throw new Error(
          typeof responseObject.message === "string"
            ? responseObject.message
            : "Live classroom information was not returned.",
        );
      }

      if (!joinData.routerRtpCapabilities) {
        console.error("Invalid join-class data:", joinData);

        throw new Error(
          "SFU joined successfully, but router RTP capabilities were not returned by the server.",
        );
      }

      const routerRtpCapabilities =
        joinData.routerRtpCapabilities as mediasoupClient.types.RtpCapabilities;

      const joinedUser =
        joinData.user && typeof joinData.user === "object"
          ? (joinData.user as {
              name?: string;
              role?: string;
            })
          : null;

      setUserName(joinedUser?.name || "Teacher");
      setUserRole(joinedUser?.role || "Teacher");

      const device = new mediasoupClient.Device();

      await device.load({
        routerRtpCapabilities,
      });

      deviceRef.current = device;

      await createSendTransport();
      await createRecvTransport();
      await startLocalMedia();

      socket.on("new-producer", async (producer: ExistingProducer) => {
        await consumeProducer(producer);
      });

      socket.on("peer-left", ({ peerId }: { peerId: string }) => {
        removeRemoteParticipant(peerId);
      });

      socket.on("consumer-closed", ({ consumerId }: { consumerId: string }) => {
        console.log("Consumer closed:", consumerId);
      });

      await getExistingProducers();

      if (mountedRef.current) {
        setStatus("connected");
      }
    } catch (initializeError) {
      console.error(
        "Teacher live classroom initialization failed:",
        initializeError,
      );

      if (!mountedRef.current) {
        return;
      }

      setError(
        initializeError instanceof Error
          ? initializeError.message
          : "Unable to start live classroom.",
      );

      setStatus("error");

      cleanup();
    }
  }, [
    classId,
    cleanup,
    consumeProducer,
    createRecvTransport,
    createSendTransport,
    getExistingProducers,
    removeRemoteParticipant,
    startLocalMedia,
  ]);

  const toggleMic = useCallback(() => {
    const producer = audioProducerRef.current;

    if (!producer) {
      return;
    }

    if (producer.paused) {
      producer.resume();
      setIsMicOn(true);
    } else {
      producer.pause();
      setIsMicOn(false);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    const producer = videoProducerRef.current;

    if (!producer) {
      return;
    }

    if (producer.paused) {
      producer.resume();
      setIsCameraOn(true);
    } else {
      producer.pause();
      setIsCameraOn(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    let cancelled = false;

    params.then((resolvedParams) => {
      if (!cancelled) {
        setClassId(resolvedParams.classId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!classId) {
      return;
    }

    void initializeClassroom();

    return () => {
      cleanup();
    };
  }, [classId, initializeClassroom, cleanup]);

  const participantCount = remoteParticipants.length + 1;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/10 bg-[#0b1930]">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/teacher/classes"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-300">
                    Teacher Live
                  </p>
                </div>

                <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                  IlmHub Live Classroom
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Users className="h-4 w-4 text-[#d6b56d]" />
                {participantCount} participant
                {participantCount !== 1 ? "s" : ""}
              </div>

              <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300">
                {status === "connected"
                  ? "LIVE"
                  : status === "connecting"
                    ? "CONNECTING"
                    : "READY"}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            {status === "error" ? (
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0d1a2b] p-6 text-center shadow-2xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                    <Video className="h-6 w-6" />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white">
                    Live class start nahi ho saki
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {error}
                  </p>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void initializeClassroom()}
                      className="flex-1 rounded-xl bg-[#d6b56d] px-4 py-3 text-sm font-semibold text-[#0b1930] transition hover:bg-[#e1c481]"
                    >
                      Try Again
                    </button>

                    <Link
                      href="/teacher/classes"
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Back
                    </Link>
                  </div>
                </div>
              </div>
            ) : status !== "connected" ? (
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Loader2 className="h-7 w-7 animate-spin text-[#d6b56d]" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {status === "loading"
                      ? "Classroom prepare ho raha hai..."
                      : "Live classroom se connect ho raha hai..."}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Camera aur microphone access allow karein.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                    {remoteParticipants.length > 0 ? (
                      <div className="grid h-full min-h-[520px] auto-rows-fr grid-cols-1 gap-2 p-2 sm:grid-cols-2">
                        {remoteParticipants.map((participant) => (
                          <RemoteParticipantTile
                            key={participant.peerId}
                            participant={participant}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[520px] items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <Users className="h-7 w-7 text-[#d6b56d]" />
                          </div>

                          <h2 className="mt-5 text-lg font-semibold text-white">
                            Students ka wait ho raha hai
                          </h2>

                          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                            Live class successfully start ho chuki hai. Students
                            join kar sakte hain.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-xl border border-[#d6b56d]/40 bg-[#111827] shadow-2xl sm:h-40 sm:w-56">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />

                      {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#111827]">
                          <CameraOff className="h-7 w-7 text-slate-500" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-semibold text-white">
                            {userName}
                          </p>

                          <span className="shrink-0 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            Teacher
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="rounded-2xl border border-white/10 bg-[#0d1a2b] p-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Participants
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {participantCount} connected
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                        <Users className="h-4 w-4 text-[#d6b56d]" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-[#d6b56d]/20 bg-[#d6b56d]/5 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d6b56d] text-sm font-bold text-[#0b1930]">
                          {userName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {userName}
                          </p>

                          <p className="text-xs text-[#d6b56d]">{userRole}</p>
                        </div>
                      </div>

                      {remoteParticipants.map((participant) => (
                        <div
                          key={participant.peerId}
                          className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {participant.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {participant.role || "Student"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>

                <div className="sticky bottom-4 z-20 flex justify-center">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1930]/95 p-2 shadow-2xl backdrop-blur">
                    <button
                      type="button"
                      onClick={toggleMic}
                      title={isMicOn ? "Mute microphone" : "Unmute microphone"}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        isMicOn
                          ? "bg-white/10 text-white hover:bg-white/15"
                          : "bg-red-500/15 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {isMicOn ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleCamera}
                      title={isCameraOn ? "Turn camera off" : "Turn camera on"}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        isCameraOn
                          ? "bg-white/10 text-white hover:bg-white/15"
                          : "bg-red-500/15 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {isCameraOn ? (
                        <Camera className="h-5 w-5" />
                      ) : (
                        <CameraOff className="h-5 w-5" />
                      )}
                    </button>

                    <div className="mx-1 h-7 w-px bg-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        cleanup();
                        window.location.href = "/teacher/classes";
                      }}
                      title="End live class"
                      className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      <PhoneOff className="h-4 w-4" />

                      <span className="hidden sm:inline">End Class</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
