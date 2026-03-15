# Agent Live Deployment Guide

## Scope

Deploy `apps/agent-tutor-live` to Google Cloud Run.

## Infra Source of Truth

- `infra/apps/agent-tutor-live/cloudrun.yaml`

## Required Environment

1. `GEMINI_API_KEY`
2. `PORT`
3. `GEMINI_LIVE_MODEL`
4. `GOOGLE_CLOUD_PROJECT`
5. `GOOGLE_CLOUD_REGION`

## Local Validation Before Deploy

1. `pnpm --filter agent-tutor-live lint`
2. `pnpm --filter agent-tutor-live test`
3. `pnpm --filter agent-tutor-live build`

## Deploy

### Dev

`pnpm release:dev:agent-tutor-live`

### Production

`pnpm release:agent-tutor-live`

## Post-Deploy Checks

1. `GET /health` returns `200`
2. WebSocket upgrade on `/live` works
3. Tutor responses reference current source code and runtime output
4. Audio in/out and transcripts work end to end
5. The architecture diagram and demo clearly show Cloud Run as the live-agent host
