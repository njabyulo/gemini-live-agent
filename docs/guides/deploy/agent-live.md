# Agent Live Deployment Guide

## Scope

Deploy `apps/agent-live` to Google Cloud Run.

## Prerequisites

1. `pnpm install`
2. Authenticated `gcloud` CLI
3. Target Google Cloud project selected
4. Required env vars and secrets prepared for Cloud Run

## Infra Source of Truth

- Cloud Run manifest: `infra/apps/agent-live/cloudrun.yaml`
- App package scripts:
  - `pnpm release:dev:api`
  - `pnpm release:api`

## Required Environment Variables

1. `GEMINI_API_KEY`
2. `PORT` (`8080` in Cloud Run config)
3. `GEMINI_LIVE_MODEL`
4. `GOOGLE_CLOUD_PROJECT`
5. `GOOGLE_CLOUD_REGION`

## Local Validation Before Deploy

1. `pnpm --filter agent-live lint`
2. `pnpm --filter agent-live test`
3. `pnpm --filter agent-live build`

## Deploy

### Dev

1. `pnpm release:dev:api`

### Production

1. `pnpm release:api`

## Post-Deploy Checks

1. Cloud Run service becomes healthy.
2. `GET /health` returns `200`.
3. WebSocket connections to `/live` succeed.
4. Gemini Live session creation works with the configured model.
5. Tool calls for lesson/test context continue to function.

## Runtime Ownership

This app must remain the real live-agent runtime. It owns:

1. WebSocket/live session handling
2. Gemini Live connection
3. Tool execution
4. Tutor orchestration

## Rollback

1. Re-deploy the previous known-good Cloud Run revision.
2. Re-check `GEMINI_API_KEY`, model configuration, and region/project settings if health checks pass but live session startup fails.
