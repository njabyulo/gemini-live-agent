import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import type { TRunnerCodeExecutorContext } from "../../../utils/hono";

import { SExecuteRequest } from "./schemas";
import {
  executeCommand,
  getWorkspacePath,
  isSupportedCommand,
  RUNTIME_EXECUTION_ERRORS,
} from "./utils";

export const executeRunnerCommandHandler = async (
  c: TRunnerCodeExecutorContext,
) => {
  const payload = SExecuteRequest.parse(await c.req.json());

  if (!isSupportedCommand(payload.command)) {
    return c.json(
      {
        error: RUNTIME_EXECUTION_ERRORS.unsupportedCommand,
      },
      400,
    );
  }

  const workspaceRoot = await mkdtemp(join(tmpdir(), "gemini-live-agent-run-"));

  try {
    for (const file of payload.files) {
      const absolutePath = getWorkspacePath(workspaceRoot, file.path);
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.content, "utf8");
    }

    const result = await executeCommand({
      command: payload.command,
      workspaceRoot,
    });

    return c.json(result);
  } finally {
    await rm(workspaceRoot, { force: true, recursive: true });
  }
};
