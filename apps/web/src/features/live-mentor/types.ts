import type {
  ITestState,
  TBrowserEvent,
  TServerEvent,
  TSessionPhase,
} from "@agent-tutor/shared/types";

export type TTranscriptRole = "assistant" | "user" | "system";

export interface ITranscriptMessage {
  id: string;
  role: TTranscriptRole;
  text: string;
}

export interface ILiveMentorStoreState {
  code: string;
  isCapturingAudio: boolean;
  isSessionLive: boolean;
  messages: ITranscriptMessage[];
  sessionPhase: TSessionPhase | "idle";
  testIndex: number;
  typedPrompt: string;
  appendMessage: (role: TTranscriptRole, text: string) => void;
  reset: () => void;
  setCode: (code: string) => void;
  setIsCapturingAudio: (value: boolean) => void;
  setIsSessionLive: (value: boolean) => void;
  setSessionPhase: (phase: TSessionPhase | "idle") => void;
  setTestIndex: (index: number) => void;
  setTypedPrompt: (value: string) => void;
}

export interface ILiveMentorAudioRefs {
  audioContext: AudioContext | null;
  outputSource: AudioBufferSourceNode | null;
  processor: ScriptProcessorNode | null;
  sourceNode: MediaStreamAudioSourceNode | null;
  stream: MediaStream | null;
}

export interface IAgentLiveClientCallbacks {
  onClose: () => void;
  onError: () => void;
  onEvent: (event: TServerEvent) => void;
  onOpen: () => void;
}

export interface IAgentLiveClientConnectInput {
  callbacks: IAgentLiveClientCallbacks;
  startPayload: Extract<TBrowserEvent, { type: "start" }>;
  url: string;
}

export interface ILiveMentorViewModel {
  code: string;
  isCapturingAudio: boolean;
  isSessionLive: boolean;
  messages: ITranscriptMessage[];
  sessionPhase: TSessionPhase | "idle";
  statusLabel: string;
  testState: ITestState;
  typedPrompt: string;
  connectSession: () => void;
  finishAudioCapture: () => void;
  interruptMentor: () => void;
  resetDemo: () => void;
  runTests: () => void;
  sendTextPrompt: () => void;
  setCode: (code: string) => void;
  setTypedPrompt: (value: string) => void;
  shareScreenshot: () => Promise<void>;
  startAudioCapture: () => Promise<void>;
  stopSession: () => void;
}
