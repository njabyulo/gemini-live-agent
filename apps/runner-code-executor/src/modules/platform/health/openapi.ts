export const healthOpenApi = {
  method: "GET",
  operationId: "getRunnerHealth",
  path: "/health",
  summary: "Runner health check",
  tags: ["platform"],
} as const;
