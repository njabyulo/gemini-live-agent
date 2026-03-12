"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import type { ITestState, TServerEvent } from "@agent-tutor/shared/types";

import { AgentLiveClient } from "../services/agent-live-client";
import { useLiveMentorStore } from "../state/use-live-mentor-store";
import type { ILiveMentorAudioRefs, ILiveMentorViewModel } from "../types";
import {
  bytesToBase64,
  downsampleBuffer,
  float32To16BitPCM,
  playAudioChunk,
} from "../utils/audio";
import {
  buildScreenshotFromTestState,
  CODE_BY_STATE,
  STATUS_LABELS,
  TEST_STATES,
} from "../utils/demo-data";

export function useLiveMentorDemo(): ILiveMentorViewModel {
  const clientRef = useRef<AgentLiveClient | null>(null);
  const audioRefs = useRef<ILiveMentorAudioRefs>({
    audioContext: null,
    outputSource: null,
    processor: null,
    sourceNode: null,
    stream: null,
  });

  const code = useLiveMentorStore((state) => state.code);
  const isCapturingAudio = useLiveMentorStore(
    (state) => state.isCapturingAudio,
  );
  const isSessionLive = useLiveMentorStore((state) => state.isSessionLive);
  const messages = useLiveMentorStore((state) => state.messages);
  const sessionPhase = useLiveMentorStore((state) => state.sessionPhase);
  const testIndex = useLiveMentorStore((state) => state.testIndex);
  const typedPrompt = useLiveMentorStore((state) => state.typedPrompt);
  const appendMessage = useLiveMentorStore((state) => state.appendMessage);
  const resetStore = useLiveMentorStore((state) => state.reset);
  const setCode = useLiveMentorStore((state) => state.setCode);
  const setIsCapturingAudio = useLiveMentorStore(
    (state) => state.setIsCapturingAudio,
  );
  const setIsSessionLive = useLiveMentorStore(
    (state) => state.setIsSessionLive,
  );
  const setSessionPhase = useLiveMentorStore((state) => state.setSessionPhase);
  const setTestIndex = useLiveMentorStore((state) => state.setTestIndex);
  const setTypedPrompt = useLiveMentorStore((state) => state.setTypedPrompt);

  const testState = TEST_STATES[testIndex] ?? TEST_STATES[0];

  const wsUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_AGENT_LIVE_WS_URL ?? "ws://localhost:8080/live",
    [],
  );

  const stopAudioCapture = useCallback(() => {
    audioRefs.current.processor?.disconnect();
    audioRefs.current.sourceNode?.disconnect();
    audioRefs.current.stream?.getTracks().forEach((track) => track.stop());
    audioRefs.current.processor = null;
    audioRefs.current.sourceNode = null;
    audioRefs.current.stream = null;
    setIsCapturingAudio(false);
  }, [setIsCapturingAudio]);

  useEffect(
    () => () => {
      stopAudioCapture();
      clientRef.current?.close();
      audioRefs.current.outputSource?.stop();
    },
    [stopAudioCapture],
  );

  const handleServerEvent = async (event: TServerEvent) => {
    if (event.type === "ready") {
      setIsSessionLive(true);
      setSessionPhase("ready");
      appendMessage(
        "system",
        "Live session ready. Start talking when you are ready.",
      );
      return;
    }

    if (event.type === "status") {
      setSessionPhase(event.phase);
      return;
    }

    if (event.type === "input_transcript") {
      appendMessage("user", event.text);
      return;
    }

    if (event.type === "output_transcript") {
      appendMessage("assistant", event.text);
      setSessionPhase("speaking");
      return;
    }

    if (event.type === "audio_out") {
      audioRefs.current.outputSource?.stop();
      audioRefs.current.outputSource = await playAudioChunk(event.data);
      return;
    }

    if (event.type === "interrupted") {
      audioRefs.current.outputSource?.stop();
      audioRefs.current.outputSource = null;
      appendMessage("system", "Mentor interrupted. Listening again.");
      setSessionPhase("listening");
      return;
    }

    if (event.type === "summary") {
      appendMessage("system", event.text);
      return;
    }

    if (event.type === "error") {
      appendMessage("system", `Error: ${event.message}`);
      setSessionPhase("error");
    }
  };

  const connectSession = () => {
    if (!clientRef.current) {
      clientRef.current = new AgentLiveClient();
    }

    setSessionPhase("connecting");
    clientRef.current.connect({
      callbacks: {
        onClose: () => {
          setIsSessionLive(false);
          setSessionPhase("idle");
          setIsCapturingAudio(false);
        },
        onError: () => {
          setSessionPhase("error");
          appendMessage(
            "system",
            "The live backend did not connect. Check apps/agent-live and try again.",
          );
        },
        onEvent: (event) => {
          void handleServerEvent(event);
        },
        onOpen: () => {
          setSessionPhase("connecting");
        },
      },
      startPayload: {
        type: "start",
        courseId: "react-debugging",
        lessonId: "fix-button-interaction",
        testStateId: testState.id,
        terminalOutput: testState.terminalOutput,
      },
      url: wsUrl,
    });
  };

  const stopSession = () => {
    clientRef.current?.send({ type: "stop" });
    clientRef.current?.close();
    stopAudioCapture();
    setIsSessionLive(false);
    setSessionPhase("idle");
  };

  const sendTextPrompt = () => {
    const trimmed = typedPrompt.trim();
    if (!trimmed || !clientRef.current?.isOpen()) {
      return;
    }

    clientRef.current.send({ type: "text", text: trimmed });
    appendMessage("user", trimmed);
    setTypedPrompt("");
    setSessionPhase("thinking");
  };

  const interruptMentor = () => {
    clientRef.current?.send({ type: "interrupt" });
    audioRefs.current.outputSource?.stop();
    audioRefs.current.outputSource = null;
    setSessionPhase("listening");
  };

  const shareScreenshot = async () => {
    if (!clientRef.current?.isOpen()) {
      return;
    }

    const base64 = buildScreenshotFromTestState(testState);
    if (!base64) {
      return;
    }

    clientRef.current.send({ type: "image", data: base64 });
    appendMessage("system", "Screenshot shared with the mentor.");
  };

  const startAudioCapture = async () => {
    if (!clientRef.current?.isOpen() || isCapturingAudio) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      appendMessage("system", "Web Audio is not available in this browser.");
      return;
    }

    const audioContext =
      audioRefs.current.audioContext ?? new AudioContextCtor();
    audioRefs.current.audioContext = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    audioRefs.current.stream = stream;
    audioRefs.current.sourceNode = source;
    audioRefs.current.processor = processor;

    processor.onaudioprocess = (event) => {
      const channelData = event.inputBuffer.getChannelData(0);
      const pcm = float32To16BitPCM(
        downsampleBuffer(channelData, audioContext.sampleRate, 16000),
      );
      clientRef.current?.send({
        type: "audio",
        data: bytesToBase64(new Uint8Array(pcm.buffer)),
      });
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setIsCapturingAudio(true);
    setSessionPhase("listening");
  };

  const finishAudioCapture = () => {
    clientRef.current?.send({ type: "audio_end" });
    stopAudioCapture();
    setSessionPhase("thinking");
  };

  const runTests = () => {
    const nextIndex = Math.min(testIndex + 1, TEST_STATES.length - 1);
    const nextState =
      TEST_STATES[nextIndex] ?? TEST_STATES[TEST_STATES.length - 1];
    setTestIndex(nextIndex);
    setCode(CODE_BY_STATE[nextState.id]);
    appendMessage("system", `Test state updated: ${nextState.label}.`);
  };

  const resetDemo = () => {
    stopSession();
    resetStore();
  };

  return {
    code,
    isCapturingAudio,
    isSessionLive,
    messages,
    sessionPhase,
    statusLabel: STATUS_LABELS[sessionPhase],
    testState: testState as ITestState,
    typedPrompt,
    connectSession,
    finishAudioCapture,
    interruptMentor,
    resetDemo,
    runTests,
    sendTextPrompt,
    setCode,
    setTypedPrompt,
    shareScreenshot,
    startAudioCapture,
    stopSession,
  };
}
