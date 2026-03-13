# Development Guides

## Scope

Run the hackathon stack locally.

## Guides

- `api.md`
- `web.md`
- `agent-live.md`

## Local Split

1. `pnpm dev` runs `apps/api` and `apps/web`.
2. `pnpm dev:agent-live` runs the Gemini Live backend separately.
3. The coding workspace is intentionally disposable:
   - a fresh sandbox is created on `/app`
   - reload resets the lesson workspace

## Env Files

- `apps/api/.dev.vars.example`
- `apps/web/.dev.vars.example`
- `apps/agent-live/.env.example`
- root `/.env.example` is only the aggregate reference
