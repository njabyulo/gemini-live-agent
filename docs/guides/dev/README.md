# Development Guides

## Scope

Development guides for the app surfaces in this repo.

## Guides

- `web.md`
- `agent-live.md`

## Conventions

1. Root commands should go through `turbo`.
2. App/package commands should use direct tools such as `next`, `tsx`, `eslint`, `tsc`, `vitest`, `wrangler`, and `gcloud`.
3. App-local env examples live under each app:
   - `apps/web/.dev.vars.example`
   - `apps/agent-live/.env.example`
4. Root `.env.example` is the workspace aggregate view only.
