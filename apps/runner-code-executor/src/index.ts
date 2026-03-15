import { serve } from "@hono/node-server";

import { applyRequestLogger } from "./middleware/request-logger";
import { createHealthRoutes } from "./modules/platform/health/routes";
import { createExecutionRoutes } from "./modules/runtime/execution/routes";
import { handleRunnerError } from "./utils/errors";
import { getRunnerPort } from "./utils/env";
import { createRunnerCodeExecutorApp } from "./utils/hono";

const app = createRunnerCodeExecutorApp();

app.onError(handleRunnerError);
app.use(applyRequestLogger);

app.route("/", createHealthRoutes());
app.route("/", createExecutionRoutes());

serve(
  {
    fetch: app.fetch,
    port: getRunnerPort(),
  },
  (info) => {
    console.log(
      `[runner-code-executor] listening on http://127.0.0.1:${info.port}`,
    );
  },
);
