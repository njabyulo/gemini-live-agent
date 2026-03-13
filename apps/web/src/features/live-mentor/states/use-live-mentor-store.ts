"use client";

import type { IRuntimeSnapshot } from "@agent-tutor/shared/types";
import { create } from "zustand";

import type { ILiveMentorStoreState } from "../types";
import { DEFAULT_PROGRAM_INPUT } from "../utils/terminal";

const INITIAL_RUNTIME: IRuntimeSnapshot = {
  command: "",
  sourceCode: "",
  stderr: "",
  stdout: "",
};

export const useLiveMentorStore = create<ILiveMentorStoreState>((set) => ({
  activeFilePath: "/workspace/main.py",
  contextVersion: 0,
  files: [],
  isCapturingAudio: false,
  isSessionLive: false,
  lesson: null,
  programInput: DEFAULT_PROGRAM_INPUT,
  runtime: INITIAL_RUNTIME,
  sandboxId: null,
  session: null,
  sessionPhase: "idle",
  terminalBuffer: "",
  transcripts: [],
  typedPrompt: "",
  appendTerminalBuffer: (value) =>
    set((state) => ({
      terminalBuffer: `${state.terminalBuffer}${value}`,
    })),
  appendTranscript: (role, text) =>
    set((state) => ({
      transcripts:
        state.transcripts.length > 0 &&
        state.transcripts.at(-1)?.role === role
          ? state.transcripts.map((message, index, messages) =>
              index === messages.length - 1
                ? {
                    ...message,
                    text: [message.text, text].filter(Boolean).join(" ").trim(),
                  }
                : message,
            )
          : [
              ...state.transcripts,
              {
                id: `${role}-${Date.now()}-${state.transcripts.length}`,
                role,
                text,
              },
            ],
    })),
  hydrateWorkspace: (payload) =>
    set({
      activeFilePath: payload.lesson.focusFilePath,
      contextVersion: 0,
      files: payload.files,
      lesson: payload.lesson,
      programInput: DEFAULT_PROGRAM_INPUT,
      runtime: payload.snapshot,
      sandboxId: payload.sandboxId,
      sessionPhase: "idle",
      terminalBuffer: "",
      transcripts: [
        {
          id: "system-ready",
          role: "system",
          text: "Workspace ready. Run a Python command, then ask the tutor for help.",
        },
      ],
      typedPrompt: "",
    }),
  publishRuntime: (runtime) =>
    set((state) => ({
      contextVersion: state.contextVersion + 1,
      runtime,
    })),
  resetWorkspace: () =>
    set({
      activeFilePath: "/workspace/main.py",
      contextVersion: 0,
      files: [],
      isCapturingAudio: false,
      isSessionLive: false,
      lesson: null,
      programInput: DEFAULT_PROGRAM_INPUT,
      runtime: INITIAL_RUNTIME,
      sandboxId: null,
      sessionPhase: "idle",
      terminalBuffer: "",
      transcripts: [],
      typedPrompt: "",
    }),
  setActiveFilePath: (path) => set({ activeFilePath: path }),
  setFileContent: (path, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.path === path ? { ...file, content } : file,
      ),
      runtime:
        path === "/workspace/main.py"
          ? { ...state.runtime, sourceCode: content }
          : state.runtime,
    })),
  setIsCapturingAudio: (value) => set({ isCapturingAudio: value }),
  setIsSessionLive: (value) => set({ isSessionLive: value }),
  setProgramInput: (value) => set({ programInput: value }),
  setSession: (session) => set({ session }),
  setSessionPhase: (phase) => set({ sessionPhase: phase }),
  setTerminalBuffer: (value) => set({ terminalBuffer: value }),
  setTypedPrompt: (value) => set({ typedPrompt: value }),
  syncCurrentContext: () =>
    set((state) => ({
      contextVersion: state.contextVersion + 1,
    })),
}));
