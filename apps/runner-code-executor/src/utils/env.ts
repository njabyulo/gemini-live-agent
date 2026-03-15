export const getRunnerPort = () => Number(process.env.PORT ?? "8090");

export const getRunnerExecutionTimeoutMs = () =>
  Number(process.env.RUNNER_EXECUTION_TIMEOUT_MS ?? "10000");

export const getRunnerMaxStdioBytes = () =>
  Number(process.env.RUNNER_MAX_STDIO_BYTES ?? "65536");
