export const executionOpenApi = {
  method: "POST",
  operationId: "executeRunnerCommand",
  path: "/execute",
  summary: "Execute a supported Python command in a fresh workspace",
  tags: ["runtime"],
} as const;
