import { Hono, type Context } from "hono";

export interface IRunnerCodeExecutorHonoEnv {
  Bindings: Record<string, never>;
  Variables: Record<string, never>;
}

export type TRunnerCodeExecutorContext = Context<IRunnerCodeExecutorHonoEnv>;

export const createRunnerCodeExecutorApp = () =>
  new Hono<IRunnerCodeExecutorHonoEnv>();
