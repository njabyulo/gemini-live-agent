import type { TRunnerCodeExecutorContext } from "../../../utils/hono";

import { SHealthResponse } from "./schemas";

export const getHealthHandler = (c: TRunnerCodeExecutorContext) =>
  c.json(
    SHealthResponse.parse({
      status: "ok",
    }),
  );
