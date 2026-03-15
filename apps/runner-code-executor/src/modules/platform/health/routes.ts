import { createRunnerCodeExecutorApp } from "../../../utils/hono";

import { getHealthHandler } from "./handlers";
import { PLATFORM_HEALTH_ROUTES } from "./utils";

export const createHealthRoutes = () => {
  const app = createRunnerCodeExecutorApp();

  app.get(PLATFORM_HEALTH_ROUTES.health, getHealthHandler);

  return app;
};
