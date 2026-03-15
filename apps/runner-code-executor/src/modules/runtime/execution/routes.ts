import { createRunnerCodeExecutorApp } from "../../../utils/hono";

import { executeRunnerCommandHandler } from "./handlers";
import { RUNTIME_EXECUTION_ROUTES } from "./utils";

export const createExecutionRoutes = () => {
  const app = createRunnerCodeExecutorApp();

  app.post(RUNTIME_EXECUTION_ROUTES.execute, executeRunnerCommandHandler);

  return app;
};
