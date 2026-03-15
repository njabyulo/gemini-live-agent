import { z } from "zod";

export const SRunnerFile = z.object({
  content: z.string(),
  path: z.string().min(1),
});

export const SExecuteRequest = z.object({
  command: z.array(z.string().min(1)).min(1),
  files: z.array(SRunnerFile).min(1),
});
