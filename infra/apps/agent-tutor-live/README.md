# Agent Tutor Live Infra

Cloud Run configuration for `apps/agent-tutor-live` lives here.

## Purpose

- `apps/agent-tutor-live` is the real live tutor runtime
- it owns WebSocket/live session handling
- it owns the Gemini Live connection
- it owns tool execution
- it owns tutor orchestration

## Deploy

From repo root:

- Dev: `pnpm release:dev:agent-tutor-live`
- Production: `pnpm release:agent-tutor-live`
