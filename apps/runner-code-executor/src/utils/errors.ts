import type { ErrorHandler } from "hono";

import type { IRunnerCodeExecutorHonoEnv } from "./hono";

export const handleRunnerError: ErrorHandler<IRunnerCodeExecutorHonoEnv> = (
  error,
  c,
) => {
  const message =
    error instanceof Error ? error.message : "Internal Server Error";

  if (/invalid|unsupported|refusing/iu.test(message)) {
    return c.json({ error: message }, 400);
  }

  console.error("[runner-code-executor] unhandled error", error);
  return c.json({ error: message }, 500);
};
