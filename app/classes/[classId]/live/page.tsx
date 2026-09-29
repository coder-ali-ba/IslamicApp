"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
ArrowLeft,
Camera,
CameraOff,
CheckCircle2,
Loader2,
Mic,
MicOff,
Users,
Video,
Wifi,
WifiOff,
XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import type {
Consumer,
Device,
Producer,
RtpCapabilities,
RtpParameters,
Transport,
} from "mediasoup-client/types";

const API_URL =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:8080/api";

const SOCKET_URL =
process.env.NEXT_PUBLIC_SOCKET_URL 

type Participant = {
peerId: string;
userId: string;
name: string;
role: string;
stream: MediaStream;
};

type JoinClassResponse = {
success: boolean;
message?: string;
data?: {
classId: string;
roomId: string;
peerId: string;
user: {
id: string;
name: string;
role: string;
};
routerRtpCapabilities: RtpCapabilities;
};
};

type TransportResponse = {
success: boolean;
message?: string;
data?: {
id: string;
iceParameters: any;
iceCandidates: any[];
dtlsParameters: any;
};
};

type ProduceResponse = {
success: boolean;
message?: string;
data?: {
producerId: string;
};
};

type ExistingProducer = {
producerId: string;
peerId: string;
kind: "audio" | "video";
user: {
userId?: string;
id?: string;
name?: string;
role?: string;
};
};

type ExistingProducersResponse = {
success: boolean;
message?: string;
data?: ExistingProducer[];
};

type ConsumeResponse = {
success: boolean;
message?: string;
data?: {
id: string;
producerId: string;
kind: "audio" | "video";
rtpParameters: RtpParameters;
producerPaused: boolean;
};
};

type ResumeConsumerResponse = {
success: boolean;
message?: string;
data?: {
resumed: boolean;
};
};

type NewProducerPayload = {
producerId: string;
peerId: string;
user: {
id?: string;
name?: string;
role?: string;
};
kind: "audio" | "video";
};

type ConsumerClosedPayload = {
consumerId: string;
producerId: string;
};

type RemoteParticipant = Participant & {
audioConsumerIds: string[];
videoConsumerIds: string[];
};

export default function LiveClassroomPage() {
const params = useParams();
const router = useRouter();

const classId =
typeof params.classId === "string"
? params.classId
: "";

const socketRef =
useRef<Socket | null>(null);

const deviceRef =
useRef<Device | null>(null);

const sendTransportRef =
useRef<Transport | null>(null);

const recvTransportRef =
useRef<Transport | null>(null);

const localStreamRef =
useRef<MediaStream | null>(null);

const producersRef =
useRef<Map<string, Producer>>(
new Map()
);

const consumersRef =
useRef<
Map<
string,
{
consumer: Consumer;
peerId: string;
producerId: string;
}
>
>(new Map());

const remoteStreamsRef =
useRef<
Map<
string,
{
stream: MediaStream;
userId: string;
name: string;
role: string;
audioConsumerIds: string[];
videoConsumerIds: string[];
}
>
>(new Map());

const mountedRef =
useRef(true);

const [connecting, setConnecting] =
useState(true);

const [connected, setConnected] =
useState(false);

const [error, setError] =
useState("");

const [statusMessage, setStatusMessage] =
useState("Connecting to live classroom...");

const [className, setClassName] =
useState("Live Classroom");

const [localStream, setLocalStream] =
useState<MediaStream | null>(null);

const [participants, setParticipants] =
useState<RemoteParticipant[]>([]);

const [micEnabled, setMicEnabled] =
useState(true);

const [cameraEnabled, setCameraEnabled] =
useState(true);

const [leaving, setLeaving] =
useState(false);

const [roomPeerId, setRoomPeerId] =
useState("");

const socketRequest = useCallback(
<T,>(
event: string,
payload: any
): Promise<T> => {
return new Promise(
(resolve, reject) => {
const socket =
socketRef.current;

      if (!socket) {
        reject(
          new Error(
            "Socket connection is not available."
          )
        );
        return;
      }

      socket.emit(
        event,
        payload,
        (response: T) => {
          resolve(response);
        }
      );
    }
  );
},
[]


);

const syncParticipants = useCallback(() => {
const nextParticipants: RemoteParticipant[] =
[];


for (const [
  peerId,
  remote,
] of remoteStreamsRef.current.entries()) {
  nextParticipants.push({
    peerId,
    userId: remote.userId,
    name: remote.name,
    role: remote.role,
    stream: remote.stream,
    audioConsumerIds:
      remote.audioConsumerIds,
    videoConsumerIds:
      remote.videoConsumerIds,
  });
}

setParticipants(nextParticipants);


}, []);

const removeConsumer = useCallback(
(consumerId: string) => {
const entry =
consumersRef.current.get(
consumerId
);


  if (!entry) return;

  const {
    consumer,
    peerId,
  } = entry;

  try {
    consumer.close();
  } catch {}

  consumersRef.current.delete(
    consumerId
  );

  const remote =
    remoteStreamsRef.current.get(
      peerId
    );

  if (!remote) return;

  remote.stream
    .getTracks()
    .filter((track) =>
      remote.stream
        .getTracks()
        .includes(track)
    );

  remote.audioConsumerIds =
    remote.audioConsumerIds.filter(
      (id) => id !== consumerId
    );

  remote.videoConsumerIds =
    remote.videoConsumerIds.filter(
      (id) => id !== consumerId
    );

  if (
    remote.audioConsumerIds.length ===
      0 &&
    remote.videoConsumerIds.length ===
      0
  ) {
    remote.stream
      .getTracks()
      .forEach((track) =>
        remote.stream.removeTrack(track)
      );

    remoteStreamsRef.current.delete(
      peerId
    );
  }

  syncParticipants();
},
[syncParticipants]


);

const consumeProducer = useCallback(
  async (
    producerId: string,
    peerId: string,
    user: {
      id?: string;
      name?: string;
      role?: string;
    }
  ) => {
    const device = deviceRef.current;

    if (!device) {
      throw new Error(
        "Mediasoup device is not ready."
      );
    }

    const recvTransport =
      recvTransportRef.current;

    if (!recvTransport) {
      throw new Error(
        "Receive transport is not ready."
      );
    }

    if (!recvTransport.id) {
      throw new Error(
        "Receive transport ID is missing."
      );
    }

    const response =
      await socketRequest<ConsumeResponse>(
        "consume",
        {
          transportId: recvTransport.id,
          producerId,
          rtpCapabilities:
            device.rtpCapabilities,
        }
      );

    console.log(
      "CONSUME RESPONSE:",
      response
    );

    if (!response.success) {
      throw new Error(
        response.message ||
          "Unable to consume participant media."
      );
    }

    if (!response.data) {
      throw new Error(
        "Consumer information was not returned."
      );
    }

    const {
      id,
      kind,
      rtpParameters,
    } = response.data;

    const consumer =
      await recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });

    consumersRef.current.set(
      consumer.id,
      {
        consumer,
        peerId,
        producerId,
      }
    );

    let remote =
      remoteStreamsRef.current.get(
        peerId
      );

    if (!remote) {
      remote = {
        stream: new MediaStream(),
        userId: user.id || peerId,
        name: user.name || "Participant",
        role: user.role || "student",
        audioConsumerIds: [],
        videoConsumerIds: [],
      };

      remoteStreamsRef.current.set(
        peerId,
        remote
      );
    }

    remote.stream.addTrack(
      consumer.track
    );

    if (kind === "audio") {
      remote.audioConsumerIds.push(
        consumer.id
      );
    } else {
      remote.videoConsumerIds.push(
        consumer.id
      );
    }

    consumer.on(
      "transportclose",
      () => {
        removeConsumer(
          consumer.id
        );
      }
    );

    consumer.on(
      "producerclose",
      () => {
        removeConsumer(
          consumer.id
        );
      }
    );

    syncParticipants();

    await socketRequest<ResumeConsumerResponse>(
      "resume-consumer",
      {
        consumerId: consumer.id,
      }
    );
  },
  [
    removeConsumer,
    socketRequest,
    syncParticipants,
  ]
);

const handleNewProducer =
useCallback(
async (
payload: NewProducerPayload
) => {
try {
await consumeProducer(
payload.producerId,
payload.peerId,
payload.user
);
} catch (consumeError) {
console.error(
"Failed to consume new producer:",
consumeError
);
}
},
[consumeProducer]
);

const createSendTransport =
useCallback(async () => {
const response =
await socketRequest<TransportResponse>(
"create-transport",
{
direction: "send",
}
);


  if (!response.success) {
    throw new Error(
      response.message ||
        "Unable to create send transport."
    );
  }

  if (!response.data) {
    throw new Error(
      "Send transport data was not returned."
    );
  }

  const device =
    deviceRef.current;

  if (!device) {
    throw new Error(
      "Mediasoup device is not ready."
    );
  }

  const transport =
    device.createSendTransport(
      response.data
    );

  transport.on(
    "connect",
    async (
      {
        dtlsParameters,
      },
      callback,
      errback
    ) => {
      try {
        const result =
          await socketRequest<{
            success: boolean;
            message?: string;
          }>(
            "connect-transport",
            {
              transportId:
                transport.id,
              dtlsParameters,
            }
          );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to connect send transport."
          );
        }

        callback();
      } catch (transportError) {
        errback(
          transportError as Error
        );
      }
    }
  );

  transport.on(
    "produce",
    async (
      {
        kind,
        rtpParameters,
        appData,
      },
      callback,
      errback
    ) => {
      try {
        const result =
          await socketRequest<ProduceResponse>(
            "produce",
            {
              transportId:
                transport.id,
              kind,
              rtpParameters,
              appData,
            }
          );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to publish media."
          );
        }

        if (
          !result.data?.producerId
        ) {
          throw new Error(
            "Producer ID was not returned."
          );
        }

        callback({
          id: result.data
            .producerId,
        });
      } catch (produceError) {
        errback(
          produceError as Error
        );
      }
    }
  );

  transport.on(
    "connectionstatechange",
    (state) => {
      console.log(
        "Send transport state:",
        state
      );

      if (
        state === "failed" ||
        state === "closed"
      ) {
        setStatusMessage(
          "Media connection lost."
        );
      }
    }
  );

  sendTransportRef.current =
    transport;
}, [socketRequest]);


const createRecvTransport =
useCallback(async () => {
const response =
await socketRequest<TransportResponse>(
"create-transport",
{
direction: "recv",
}
);


  if (!response.success) {
    throw new Error(
      response.message ||
        "Unable to create receive transport."
    );
  }

  if (!response.data) {
    throw new Error(
      "Receive transport data was not returned."
    );
  }

  const device =
    deviceRef.current;

  if (!device) {
    throw new Error(
      "Mediasoup device is not ready."
    );
  }

  const transport =
    device.createRecvTransport(
      response.data
    );

  transport.on(
    "connect",
    async (
      {
        dtlsParameters,
      },
      callback,
      errback
    ) => {
      try {
        const result =
          await socketRequest<{
            success: boolean;
            message?: string;
          }>(
            "connect-transport",
            {
              transportId:
                transport.id,
              dtlsParameters,
            }
          );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to connect receive transport."
          );
        }

        callback();
      } catch (transportError) {
        errback(
          transportError as Error
        );
      }
    }
  );

  transport.on(
    "connectionstatechange",
    (state) => {
      console.log(
        "Receive transport state:",
        state
      );

      if (
        state === "failed" ||
        state === "closed"
      ) {
        setStatusMessage(
          "Media connection lost."
        );
      }
    }
  );

  recvTransportRef.current =
    transport;
}, [socketRequest]);


const produceLocalMedia =
useCallback(async () => {
const sendTransport =
sendTransportRef.current;

  if (!sendTransport) {
    throw new Error(
      "Send transport is not ready."
    );
  }

  const stream =
    await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: {
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
          facingMode: "user",
        },
      }
    );

  localStreamRef.current =
    stream;

  setLocalStream(stream);

  const audioTrack =
    stream.getAudioTracks()[0];

  const videoTrack =
    stream.getVideoTracks()[0];

  if (audioTrack) {
    const audioProducer =
      await sendTransport.produce(
        {
          track: audioTrack,
          appData: {
            mediaType: "audio",
          },
        }
      );

    producersRef.current.set(
      audioProducer.id,
      audioProducer
    );

    audioProducer.on(
      "transportclose",
      () => {
        producersRef.current.delete(
          audioProducer.id
        );
      }
    );
  }

  if (videoTrack) {
    const videoProducer =
      await sendTransport.produce(
        {
          track: videoTrack,
          appData: {
            mediaType: "video",
          },
        }
      );

    producersRef.current.set(
      videoProducer.id,
      videoProducer
    );

    videoProducer.on(
      "transportclose",
      () => {
        producersRef.current.delete(
          videoProducer.id
        );
      }
    );
  }
}, []);


const loadExistingProducers =
useCallback(async () => {
const response =
await socketRequest<ExistingProducersResponse>(
"get-producers",
{}
);


  if (!response.success) {
    throw new Error(
      response.message ||
        "Unable to load participants."
    );
  }

  const existing =
    response.data || [];

  for (const producer of existing) {
    try {
      await consumeProducer(
        producer.producerId,
        producer.peerId,
        producer.user
      );
    } catch (consumeError) {
      console.error(
        "Failed to consume existing producer:",
        consumeError
      );
    }
  }
}, [consumeProducer, socketRequest]);


const initializeClassroom =
useCallback(async () => {
if (!classId) {
setError("Class ID is missing.");
setConnecting(false);
return;
}


  try {
    setConnecting(true);
    setError("");
    setStatusMessage(
      "Connecting to live classroom..."
    );

    const socket = io(
      SOCKET_URL,
      {
        withCredentials: true,
        transports: [
          "websocket",
          "polling",
        ],
      }
    );

    socketRef.current = socket;

    socket.on(
      "connect",
      async () => {
        try {
          if (!mountedRef.current) {
            return;
          }

          setStatusMessage(
            "Joining live class..."
          );

          const joinResponse =
            await socketRequest<JoinClassResponse>(
              "join-class",
              {
                classId,
              }
            );

          if (
            !joinResponse.success
          ) {
            throw new Error(
              joinResponse.message ||
                "Unable to join this class."
            );
          }

          if (
            !joinResponse.data
          ) {
            throw new Error(
              "Live classroom information was not returned."
            );
          }

          setRoomPeerId(
            joinResponse.data.peerId
          );

          setClassName(
            `Live Class`
          );

          setStatusMessage(
            "Preparing video classroom..."
          );

          const device =
            new mediasoupClient.Device();

          await device.load({
            routerRtpCapabilities:
              joinResponse.data
                .routerRtpCapabilities,
          });

          deviceRef.current =
            device;

          setStatusMessage(
            "Preparing media connection..."
          );

          await createSendTransport();

          await createRecvTransport();

          setStatusMessage(
            "Starting camera and microphone..."
          );

          await produceLocalMedia();

          setStatusMessage(
            "Loading participants..."
          );

          await loadExistingProducers();

          if (!mountedRef.current) {
            return;
          }

          setConnected(true);
          setConnecting(false);
          setStatusMessage(
            "You are live"
          );
        } catch (joinError) {
          console.error(
            "Live classroom initialization error:",
            joinError
          );

          if (
            mountedRef.current
          ) {
            setError(
              joinError instanceof Error
                ? joinError.message
                : "Unable to join the live class."
            );

            setConnecting(false);
          }
        }
      }
    );

    socket.on(
      "connect_error",
      (socketError) => {
        console.error(
          "Socket connection error:",
          socketError
        );

        if (
          mountedRef.current
        ) {
          setError(
            socketError.message ||
              "Unable to connect to the live classroom."
          );

          setConnecting(false);
        }
      }
    );

    socket.on(
      "new-producer",
      handleNewProducer
    );

    socket.on(
      "consumer-closed",
      ({
        consumerId,
      }: ConsumerClosedPayload) => {
        removeConsumer(
          consumerId
        );
      }
    );
  } catch (initializationError) {
    console.error(
      initializationError
    );

    if (mountedRef.current) {
      setError(
        initializationError instanceof Error
          ? initializationError.message
          : "Unable to initialize live classroom."
      );

      setConnecting(false);
    }
  }
}, [
  classId,
  createRecvTransport,
  createSendTransport,
  handleNewProducer,
  loadExistingProducers,
  produceLocalMedia,
  removeConsumer,
  socketRequest,
]);


useEffect(() => {
mountedRef.current = true;


initializeClassroom();

return () => {
  mountedRef.current = false;

  const socket =
    socketRef.current;

  try {
    socket?.disconnect();
  } catch {}

  socketRef.current = null;

  producersRef.current.forEach(
    (producer) => {
      try {
        producer.close();
      } catch {}
    }
  );

  producersRef.current.clear();

  consumersRef.current.forEach(
    ({ consumer }) => {
      try {
        consumer.close();
      } catch {}
    }
  );

  consumersRef.current.clear();

  sendTransportRef.current
    ?.close();

  recvTransportRef.current
    ?.close();

  sendTransportRef.current =
    null;

  recvTransportRef.current =
    null;

  localStreamRef.current
    ?.getTracks()
    .forEach((track) => {
      track.stop();
    });

  localStreamRef.current = null;

  remoteStreamsRef.current.forEach(
    ({ stream }) => {
      stream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }
  );

  remoteStreamsRef.current.clear();
};


}, [initializeClassroom]);

const toggleMicrophone = () => {
const stream =
localStreamRef.current;


if (!stream) return;

const nextEnabled =
  !micEnabled;

stream
  .getAudioTracks()
  .forEach((track) => {
    track.enabled =
      nextEnabled;
  });

producersRef.current.forEach(
  (producer) => {
    if (
      producer.kind ===
      "audio"
    ) {
      if (nextEnabled) {
        producer.resume();
      } else {
        producer.pause();
      }
    }
  }
);

setMicEnabled(nextEnabled);


};

const toggleCamera = () => {
const stream =
localStreamRef.current;


if (!stream) return;

const nextEnabled =
  !cameraEnabled;

stream
  .getVideoTracks()
  .forEach((track) => {
    track.enabled =
      nextEnabled;
  });

producersRef.current.forEach(
  (producer) => {
    if (
      producer.kind ===
      "video"
    ) {
      if (nextEnabled) {
        producer.resume();
      } else {
        producer.pause();
      }
    }
  }
);

setCameraEnabled(
  nextEnabled
);


};

const leaveClass = async () => {
if (leaving) return;


setLeaving(true);

try {
  socketRef.current?.disconnect();
} catch {}

localStreamRef.current
  ?.getTracks()
  .forEach((track) => {
    track.stop();
  });

producersRef.current.forEach(
  (producer) => {
    try {
      producer.close();
    } catch {}
  }
);

consumersRef.current.forEach(
  ({ consumer }) => {
    try {
      consumer.close();
    } catch {}
  }
);

sendTransportRef.current
  ?.close();

recvTransportRef.current
  ?.close();

router.push(
  `/classes/${classId}`
);


};

if (connecting) {
return ( <main className="min-h-screen bg-[#0b0f14] text-white"> <div className="flex min-h-screen items-center justify-center px-6"> <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10"> <Loader2 className="h-8 w-8 animate-spin text-emerald-400" /> </div>


        <h1 className="mt-6 text-2xl font-semibold">
          Joining Live Classroom
        </h1>

        <p className="mt-3 text-sm leading-6 text-stone-400">
          {statusMessage}
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left">
            <div className="flex gap-3">
              <XCircle className="h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="text-sm font-semibold text-red-300">
                  Unable to join
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/80">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Link
            href={`/classes/${classId}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Class
          </Link>
        )}
      </div>
    </div>
  </main>
);


}

if (error && !connected) {
return ( <main className="min-h-screen bg-[#0b0f14] text-white"> <div className="flex min-h-screen items-center justify-center px-6"> <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-white/[0.04] p-8 text-center"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10"> <WifiOff className="h-8 w-8 text-red-400" /> </div>


        <h1 className="mt-6 text-2xl font-semibold">
          Unable to Join Class
        </h1>

        <p className="mt-3 text-sm leading-6 text-stone-400">
          {error}
        </p>

        <Link
          href={`/classes/${classId}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Class
        </Link>
      </div>
    </div>
  </main>
);


}

return ( <main className="min-h-screen bg-[#0b0f14] text-white">
{/* Top Bar */} <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur-xl"> <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6"> <div className="flex min-w-0 items-center gap-3">
<Link
href={`/classes/${classId}`}
className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition hover:bg-white/10 hover:text-white"
> <ArrowLeft className="h-4 w-4" /> </Link>


        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              Live
            </span>

            <span className="hidden text-xs text-stone-500 sm:block">
              IlmHub Classroom
            </span>
          </div>

          <h1 className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
            {className}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 text-xs text-stone-400 sm:flex">
          {connected ? (
            <>
              <Wifi className="h-4 w-4 text-emerald-400" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-400" />
              Disconnected
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300">
          <Users className="h-4 w-4 text-[#d6b56d]" />
          {participants.length + 1}
        </div>
      </div>
    </div>
  </header>

  {/* Classroom */}
  <section className="mx-auto max-w-[1800px] px-3 py-3 sm:px-5 sm:py-5">
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {/* Local Video */}
      <VideoTile
        stream={localStream}
        name="You"
        role="You"
        muted
        isLocal
        cameraEnabled={cameraEnabled}
      />

      {/* Remote Participants */}
      {participants.map(
        (participant) => (
          <VideoTile
            key={participant.peerId}
            stream={
              participant.stream
            }
            name={
              participant.name
            }
            role={
              participant.role
            }
            muted={false}
            isLocal={false}
            cameraEnabled={true}
          />
        )
      )}

      {/* Empty state */}
      {participants.length ===
        0 && (
        <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-8 lg:min-h-[360px]">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <Users className="h-6 w-6 text-stone-500" />
            </div>

            <p className="mt-4 text-sm font-medium text-stone-300">
              Waiting for other participants
            </p>

            <p className="mt-1 text-xs text-stone-500">
              Other students and the instructor will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  </section>

  {/* Status */}
  <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2">
    <div className="rounded-full border border-white/10 bg-[#151b23]/95 px-4 py-2 text-xs text-stone-400 shadow-xl backdrop-blur-xl">
      {statusMessage}
    </div>
  </div>

  {/* Controls */}
  <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0b0f14]/95 px-4 py-4 backdrop-blur-xl">
    <div className="mx-auto flex max-w-2xl items-center justify-center gap-3">
      <button
        type="button"
        onClick={
          toggleMicrophone
        }
        className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
          micEnabled
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        aria-label={
          micEnabled
            ? "Mute microphone"
            : "Unmute microphone"
        }
      >
        {micEnabled ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      <button
        type="button"
        onClick={
          toggleCamera
        }
        className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
          cameraEnabled
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        aria-label={
          cameraEnabled
            ? "Turn camera off"
            : "Turn camera on"
        }
      >
        {cameraEnabled ? (
          <Camera className="h-5 w-5" />
        ) : (
          <CameraOff className="h-5 w-5" />
        )}
      </button>

      <div className="mx-2 h-8 w-px bg-white/10" />

      <button
        type="button"
        onClick={leaveClass}
        disabled={leaving}
        className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {leaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Video className="h-4 w-4" />
        )}

        Leave
      </button>
    </div>
  </footer>
</main>


);
}

/* =========================================================
VIDEO TILE
========================================================= */

function VideoTile({
stream,
name,
role,
muted,
isLocal,
cameraEnabled,
}: {
stream: MediaStream | null;
name: string;
role: string;
muted: boolean;
isLocal: boolean;
cameraEnabled: boolean;
}) {
const videoRef =
useRef<HTMLVideoElement | null>(
null
);

const [hasVideo, setHasVideo] =
useState(false);

useEffect(() => {
const video =
videoRef.current;


if (!video || !stream) {
  return;
}

video.srcObject = stream;

const updateVideoState =
  () => {
    const videoTracks =
      stream.getVideoTracks();

    const activeVideo =
      videoTracks.some(
        (track) =>
          track.readyState ===
            "live" &&
          track.enabled
      );

    setHasVideo(activeVideo);
  };

updateVideoState();

stream
  .getVideoTracks()
  .forEach((track) => {
    track.addEventListener(
      "ended",
      updateVideoState
    );

    track.addEventListener(
      "mute",
      updateVideoState
    );

    track.addEventListener(
      "unmute",
      updateVideoState
    );
  });

return () => {
  stream
    .getVideoTracks()
    .forEach((track) => {
      track.removeEventListener(
        "ended",
        updateVideoState
      );

      track.removeEventListener(
        "mute",
        updateVideoState
      );

      track.removeEventListener(
        "unmute",
        updateVideoState
      );
    });

  if (
    video.srcObject === stream
  ) {
    video.srcObject = null;
  }
};


}, [stream]);

useEffect(() => {
if (!isLocal) return;


setHasVideo(
  Boolean(
    stream
      ?.getVideoTracks()
      .some(
        (track) =>
          track.readyState ===
            "live" &&
          track.enabled
      )
  )
);


}, [
stream,
cameraEnabled,
isLocal,
]);

return ( <div className="group relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-[#151b23] shadow-2xl">
{stream && hasVideo ? (
<video
ref={videoRef}
autoPlay
playsInline
muted={muted}
className={`h-full w-full object-cover ${
            isLocal
              ? "scale-x-[-1]"
              : ""
          }`}
/>
) : ( <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#151b23] to-[#0d1117]"> <div className="text-center"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold text-[#d6b56d]">
{name
.charAt(0)
.toUpperCase()} </div>


        <p className="mt-3 text-sm font-medium text-stone-300">
          {name}
        </p>

        <p className="mt-1 text-xs text-stone-500">
          Camera off
        </p>
      </div>
    </div>
  )}

  {/* Overlay */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-12">
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">
          {name}
        </p>

        <p className="mt-0.5 text-[11px] capitalize text-stone-400">
          {role}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] text-stone-300 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live
      </div>
    </div>
  </div>

  {isLocal && (
    <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-medium text-stone-300 backdrop-blur">
      You
    </div>
  )}
</div>


);
}
