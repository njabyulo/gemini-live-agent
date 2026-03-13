import type {
  ILessonContext,
  IRuntimeSnapshot,
  ISessionSummary,
  IWorkspaceBootstrapResponse,
  IWorkspaceFileRecord,
  TBrowserEvent,
  TServerEvent,
  TSessionPhase,
} from "@agent-tutor/shared/types";

export type TTranscriptRole = "assistant" | "system" | "user";

export interface ITranscriptMessage {
  id: string;
  role: TTranscriptRole;
  text: string;
}

export interface IWorkspaceRunInput {
  command: string;
  sandboxId: string;
  sourceCode: string;
}

export interface ILiveMentorStoreState {
  activeFilePath: string;
  contextVersion: number;
  files: IWorkspaceFileRecord[];
  isCapturingAudio: boolean;
  isSessionLive: boolean;
  lesson: ILessonContext | null;
  programInput: string;
  runtime: IRuntimeSnapshot;
  sandboxId: string | null;
  session: ISessionSummary | null;
  sessionPhase: TSessionPhase | "idle";
  terminalBuffer: string;
  transcripts: ITranscriptMessage[];
  typedPrompt: string;
  appendTerminalBuffer: (value: string) => void;
  appendTranscript: (role: TTranscriptRole, text: string) => void;
  hydrateWorkspace: (payload: IWorkspaceBootstrapResponse) => void;
  publishRuntime: (runtime: IRuntimeSnapshot) => void;
  resetWorkspace: () => void;
  setActiveFilePath: (path: string) => void;
  setFileContent: (path: string, content: string) => void;
  setIsCapturingAudio: (value: boolean) => void;
  setIsSessionLive: (value: boolean) => void;
  setProgramInput: (value: string) => void;
  setSession: (session: ISessionSummary | null) => void;
  setSessionPhase: (phase: TSessionPhase | "idle") => void;
  setTerminalBuffer: (value: string) => void;
  setTypedPrompt: (value: string) => void;
  syncCurrentContext: () => void;
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
