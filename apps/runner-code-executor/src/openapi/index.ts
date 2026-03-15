import { healthOpenApi } from "../modules/platform/health/openapi";
import { executionOpenApi } from "../modules/runtime/execution/openapi";

export const runnerCodeExecutorOpenApiDefinition = {
  info: {
    title: "Runner Code Executor API",
    description:
      "Internal runtime service for executing Python lesson commands in fresh workspaces.",
    version: "0.1.0",
  },
  modules: [healthOpenApi, executionOpenApi],
} as const;
