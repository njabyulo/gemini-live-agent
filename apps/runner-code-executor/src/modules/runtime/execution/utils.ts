import { spawn } from "node:child_process";
import { normalize, resolve } from "node:path";

import {
  getRunnerExecutionTimeoutMs,
  getRunnerMaxStdioBytes,
} from "../../../utils/env";

export const RUNTIME_EXECUTION_ROUTES = {
  execute: "/execute",
} as const;

export const RUNTIME_EXECUTION_ERRORS = {
  unsupportedCommand:
    "Unsupported command. Only python3 main.py ... and python3 -m pytest -q are allowed.",
} as const;

export const getWorkspacePath = (workspaceRoot: string, filePath: string) => {
  const normalizedPath = normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const absolutePath = resolve(workspaceRoot, normalizedPath);

  if (!absolutePath.startsWith(resolve(workspaceRoot))) {
    throw new Error(`Refusing to write outside workspace: ${filePath}`);
  }

  return absolutePath;
};

export const isSupportedCommand = (command: string[]) => {
  if (command[0] !== "python3") {
    return false;
  }

  if (command[1] === "main.py") {
    return true;
  }

  return (
    command.length >= 4 &&
    command[1] === "-m" &&
    command[2] === "pytest" &&
    command[3] === "-q"
  );
};

export const truncateOutput = (value: string) => {
  if (Buffer.byteLength(value, "utf8") <= getRunnerMaxStdioBytes()) {
    return value;
  }

  return `${value.slice(0, getRunnerMaxStdioBytes())}\n[output truncated]`;
};

export const executeCommand = async ({
  command,
  workspaceRoot,
}: {
  command: string[];
  workspaceRoot: string;
}) =>
  await new Promise<{
    durationMs: number;
    exitCode: number | null;
    stderr: string;
    stdout: string;
    timedOut: boolean;
  }>((resolvePromise, rejectPromise) => {
    const startedAt = Date.now();
    const child = spawn(command[0], command.slice(1), {
      cwd: workspaceRoot,
      env: {
        HOME: workspaceRoot,
        PATH: process.env.PATH,
        PYTHONDONTWRITEBYTECODE: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const finish = (result: {
      exitCode: number | null;
      stderr: string;
      stdout: string;
      timedOut: boolean;
    }) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeoutId);
      resolvePromise({
        durationMs: Date.now() - startedAt,
        ...result,
      });
    };

    const timeoutId = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, getRunnerExecutionTimeoutMs());

    child.stdout.on("data", (chunk) => {
      stdout = truncateOutput(`${stdout}${chunk.toString()}`);
    });

    child.stderr.on("data", (chunk) => {
      stderr = truncateOutput(`${stderr}${chunk.toString()}`);
    });

    child.on("error", (error) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeoutId);
      rejectPromise(error);
    });

    child.on("close", (exitCode) => {
      finish({
        exitCode,
        stderr,
        stdout,
        timedOut,
      });
    });
  });
