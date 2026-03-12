# Deployment Guides

## Scope

Deployment guides for the app surfaces in this repo.

## Guides

- `web.md`
- `agent-live.md`

## Runtime Split

1. `apps/web` is intended for Cloudflare hosting.
2. `apps/agent-live` is the real live-agent runtime and must run on Google Cloud Run.
3. The public architecture should clearly show:
   - frontend on Cloudflare
   - live-agent runtime on Cloud Run
   - Gemini via `@google/genai`
