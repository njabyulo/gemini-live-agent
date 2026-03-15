# Development Guides

## Scope

Run the hackathon stack locally.

## Guides

- `api.md`
- `web.md`
- `agent-tutor-live.md`
- `runtime-code-executor.md`

## Local Split

1. `pnpm dev` runs `apps/api`, `apps/web`, `apps/agent-tutor-live`, and `apps/runner-code-executor`.
2. The coding workspace is intentionally disposable:
   - a fresh lesson workspace is created on `/app`
   - reload resets the lesson workspace

## Env Files

- `apps/api/.dev.vars.example`
- `apps/web/.dev.vars.example`
- `apps/agent-tutor-live/.env.example`
- `apps/runner-code-executor/.env.example`
- root `/.env.example` is only the aggregate reference
