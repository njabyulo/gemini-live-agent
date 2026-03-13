# Web Deployment Guide

## Scope

Deploy `apps/web` to Cloudflare at `gemini-live.njabulomajozi.com`.

## Infra Source of Truth

- `infra/apps/web/wrangler.jsonc`

## Required Environment

1. `NEXT_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_AGENT_LIVE_WS_URL`

Cloudflare account:

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`
3. `CLOUDFLARE_ZONE_ID`

## Local Validation Before Deploy

1. `pnpm --filter web lint`
2. `pnpm --filter web test`
3. `pnpm --filter web build`

## Deploy

### Dev

`pnpm release:dev:web`

### Production

`pnpm release:web`

## Post-Deploy Checks

1. `https://gemini-live.njabulomajozi.com` renders the login screen
2. Login moves the user into `/app`
3. `/app` shows:
   - navbar
   - reload-reset badge
   - Monaco editor
   - xterm terminal
   - voice tutor rail
4. The frontend can reach both:
   - `apps/api`
   - `apps/agent-live`
