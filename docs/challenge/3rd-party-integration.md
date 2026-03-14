# Third-Party Integration Disclosure

This page is written for Gemini Live Agent Challenge judges.

It lists the main non-Google third-party services and libraries used by `agent-tutor`.

Google-specific challenge services are documented separately in `docs/challenge/google-integration.md`.

## Backend And Execution Stack

### Cloudflare Workers + Hono

Used for `apps/api`.

This layer handles:
- auth/session routes
- lesson bootstrap
- workspace routes
- health and migrations routes

Repo evidence:
- `apps/api/src/index.ts`
- `apps/api/package.json`

### Cloudflare Sandbox SDK

Used to run the disposable Python coding environment.

This powers:
- workspace bootstrapping
- file writes
- command execution

Repo evidence:
- `apps/api/src/modules/lesson/workspace`
- `apps/api/package.json`
- `infra/apps/api/Dockerfile`

### Cloudflare D1

Used for auth persistence.

Repo evidence:
- `infra/apps/api/wrangler.jsonc`
- `apps/api/src/utils/env.ts`

## Auth

### Better Auth

Used for browser sign-in and API session handling.

Repo evidence:
- `apps/api/src/modules/auth`
- `apps/web/src/features/auth`
- `README.md`

## Frontend Editor And Terminal

### Monaco Editor

Used for the in-browser code editor.

Repo evidence:
- `apps/web/src/features/live-mentor/components/code-editor-surface.tsx`
- `apps/web/package.json`

### xterm.js

Used for the in-browser terminal.

Repo evidence:
- `apps/web/src/features/live-mentor/components/terminal-surface.tsx`
- `apps/web/package.json`

### html-to-image

Used to capture the workspace image that is sent to the tutor for multimodal grounding.

Repo evidence:
- `apps/web/src/features/live-mentor/utils/workspace-capture.ts`
- `apps/web/package.json`

## UI And Application Libraries

### Next.js

Used for `apps/web`.

Repo evidence:
- `apps/web/package.json`

### shadcn/ui + Radix primitives

Used for UI primitives such as tabs, scroll areas, badges, cards, and controls.

Repo evidence:
- `apps/web/src/components/ui`
- `apps/web/package.json`

### Zustand

Used for client-side workspace and live tutor state.

Repo evidence:
- `apps/web/src/features/live-mentor/states`
- `apps/web/package.json`

## Summary

> In addition to the Google challenge stack, `agent-tutor` uses Cloudflare Workers + Hono for the API layer, Cloudflare Sandbox SDK for disposable Python execution, Better Auth + D1 for auth/session persistence, Monaco Editor for code editing, xterm.js for the terminal, html-to-image for workspace screenshot capture, shadcn/ui + Radix primitives for UI, and Zustand for client-side workspace state.
