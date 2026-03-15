# Web Infra

Cloudflare deployment configuration for `apps/web` lives here.

## Purpose

- host the public demo frontend
- keep Cloudflare routing and deployment concerns out of `apps/web`
- preserve a clear split between frontend hosting and the Cloud Run live tutor runtime

## Files

- `wrangler.jsonc`: canonical Worker config for web deployment

## Route

- `gemini-live-agent.njabulomajozi.com`

## Deploy

From repo root:

- Dev: `pnpm release:dev:web`
- Production: `pnpm release:web`
