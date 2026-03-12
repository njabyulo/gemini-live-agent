"use client";

import { create } from "zustand";

import type { ILiveMentorStoreState } from "../types";
import { CODE_BY_STATE, INITIAL_MESSAGES } from "../utils/demo-data";

export const useLiveMentorStore = create<ILiveMentorStoreState>((set) => ({
  code: CODE_BY_STATE["state-1"],
  isCapturingAudio: false,
  isSessionLive: false,
  messages: INITIAL_MESSAGES,
  sessionPhase: "idle",
  testIndex: 0,
  typedPrompt: "",
  appendMessage: (role, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: `${role}-${Date.now()}-${state.messages.length}`, role, text },
      ],
    })),
  reset: () =>
    set({
      code: CODE_BY_STATE["state-1"],
      isCapturingAudio: false,
      isSessionLive: false,
      messages: INITIAL_MESSAGES,
      sessionPhase: "idle",
      testIndex: 0,
      typedPrompt: "",
    }),
  setCode: (code) => set({ code }),
  setIsCapturingAudio: (value) => set({ isCapturingAudio: value }),
  setIsSessionLive: (value) => set({ isSessionLive: value }),
  setSessionPhase: (phase) => set({ sessionPhase: phase }),
  setTestIndex: (index) => set({ testIndex: index }),
  setTypedPrompt: (value) => set({ typedPrompt: value }),
}));
