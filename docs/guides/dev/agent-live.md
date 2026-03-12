# Agent Live Development Guide

## Scope

Run and iterate on `apps/agent-live` locally.

## Prerequisites

1. `pnpm install`
2. `apps/agent-live/.env.example` copied to `apps/agent-live/.env`
3. Valid `GEMINI_API_KEY` for real Gemini Live verification

## Environment Setup

Create `apps/agent-live/.env`:

1. `GEMINI_API_KEY`
2. `PORT` (optional, default `8080`)
3. `GEMINI_LIVE_MODEL` (optional)
4. `GOOGLE_CLOUD_PROJECT` (optional for local dev, useful for deploy parity)
5. `GOOGLE_CLOUD_REGION` (optional for local dev, useful for deploy parity)

Example:

```bash
GEMINI_API_KEY=your_key_here
PORT=8080
GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_REGION=us-central1
```

## Run

1. Full stack from repo root: `pnpm dev`
2. Live agent only: `pnpm --filter agent-live dev`
3. Default local health URL: `http://127.0.0.1:8080/health`
4. Default WebSocket URL: `ws://127.0.0.1:8080/live`

## Responsibilities

`apps/agent-live` is not a thin proxy. It must own:

1. WebSocket/live session handling
2. Gemini Live connection
3. Tool execution
4. Tutor orchestration

## Quality Checks

1. `pnpm --filter agent-live lint`
2. `pnpm --filter agent-live test`
3. `pnpm --filter agent-live build`

## Local Verification

1. `GET /health` returns `200`.
2. WebSocket upgrade works on `/live`.
3. `start` event opens a Gemini Live session.
4. Transcript events are relayed back to the client.
5. Screenshot and text fallback events are accepted.
6. `interrupt` returns the session to a listening state.

## Notes

1. Tooling is intentionally narrow:
   - `get_lesson_context`
   - `get_latest_test_output`
2. The current backend is hackathon-scoped; do not expand it into grading or workspace orchestration.
