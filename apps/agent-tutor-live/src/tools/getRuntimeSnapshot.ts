import type { IRuntimeSnapshot } from "@gemini-live-agent/shared/types";

export const getRuntimeSnapshot = (
  runtime: Partial<IRuntimeSnapshot>,
): IRuntimeSnapshot => ({
  command: runtime.command ?? "",
  sourceCode: runtime.sourceCode ?? "",
  stderr: runtime.stderr ?? "",
  stdout: runtime.stdout ?? "",
});
