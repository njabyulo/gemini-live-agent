# Agent Live Infra

Cloud Run configuration for `apps/agent-live` lives here.

## Purpose

- `apps/agent-live` is the real live-agent runtime
- it owns WebSocket/live session handling
- it owns the Gemini Live connection
- it owns tool execution
- it owns tutor orchestration

## Deploy

From repo root:

- Dev: `pnpm release:dev:api`
- Production: `pnpm release:api`
