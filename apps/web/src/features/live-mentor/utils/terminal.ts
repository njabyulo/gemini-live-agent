import type { IRuntimeSnapshot } from "@gemini-live-agent/shared/types";

export const PYTHON_COMMAND_PREFIX = "python3 main.py";
export const PYTEST_COMMAND = "python3 -m pytest -q";
export const DEFAULT_PROGRAM_INPUT = "Ada Lovelace";

export const formatPythonProgramCommand = (input: string) => {
  if (input.length === 0) {
    return PYTHON_COMMAND_PREFIX;
  }

  const escapedInput = input.replace(/(["\\$`])/g, "\\$1");
  return `${PYTHON_COMMAND_PREFIX} "${escapedInput}"`;
};

export const formatTerminalExchange = (
  command: string,
  runtime: IRuntimeSnapshot,
) =>
  [`$ ${command}`, runtime.stdout.trimEnd(), runtime.stderr.trimEnd(), ""]
    .filter((value, index) => !(index !== 0 && value.length === 0))
    .join("\r\n");
