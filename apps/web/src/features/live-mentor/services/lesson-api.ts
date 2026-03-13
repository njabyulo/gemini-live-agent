import type {
  IRuntimeSnapshot,
  IWorkspaceBootstrapResponse,
} from "@agent-tutor/shared/types";

import type { IWorkspaceRunInput } from "../types";
import { fetchJson } from "./api-client";

export const bootstrapLessonWorkspace = () =>
  fetchJson<IWorkspaceBootstrapResponse>("/api/lesson/bootstrap", {
    method: "POST",
  });

export const resetLessonWorkspace = () =>
  fetchJson<IWorkspaceBootstrapResponse>("/api/lesson/reset", {
    method: "POST",
  });

export const updateMainFile = (input: { content: string; sandboxId: string }) =>
  fetchJson<{ ok: boolean; path: string }>("/api/lesson/file/main.py", {
    body: JSON.stringify(input),
    method: "PUT",
  });

export const runLessonCommand = (input: IWorkspaceRunInput) =>
  fetchJson<IRuntimeSnapshot>("/api/lesson/run", {
    body: JSON.stringify(input),
    method: "POST",
  });
