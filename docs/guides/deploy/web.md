# Web Deployment Guide

## Scope

Deploy `apps/web` to the production Cloudflare Worker on `gemini-live-agent.njabulomajozi.com`.

## Infra Source of Truth

- `infra/apps/web/wrangler.jsonc`
- `apps/web/open-next.config.ts`

Current production worker:

- `gemini-live-agent-prod-wk-web-core-00`

## Cloudflare Auth

Authenticate Wrangler before deploying:

```bash
pnpm exec wrangler whoami
```

Required shell environment:

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`
3. `CLOUDFLARE_ZONE_ID`

## Runtime Config

The web app does not require hidden runtime secrets by default. Its browser-facing config should be set as normal Wrangler `vars`, not `wrangler secret put`, because these values are intentionally exposed to the client bundle.

Required public runtime values:

1. `NEXT_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_AGENT_TUTOR_LIVE_WS_URL`

Example `vars` block for `infra/apps/web/wrangler.jsonc`:

```jsonc
{
  "vars": {
    "NEXT_PUBLIC_API_BASE_URL": "https://gemini-live-agent.njabulomajozi.com",
    "NEXT_PUBLIC_AGENT_TUTOR_LIVE_WS_URL": "wss://agent-tutor-live-xxxxx.a.run.app"
  }
}
```

If you change `vars`, deploy the worker again for the change to take effect.

## Local Validation Before Deploy

```bash
pnpm --filter web lint
pnpm --filter web test
pnpm --filter web build
pnpm exec wrangler check --config infra/apps/web/wrangler.jsonc
pnpm exec wrangler deploy --dry-run --config infra/apps/web/wrangler.jsonc
```

## Deploy

### Production with Wrangler

```bash
pnpm exec wrangler deploy --config infra/apps/web/wrangler.jsonc
```

### Production with Existing Package Script

```bash
pnpm release:web
```

## Post-Deploy Checks

1. `https://gemini-live-agent.njabulomajozi.com` renders the login screen.
2. Login moves the user into `/app`.
3. The frontend can reach:
   - `https://gemini-live-agent.njabulomajozi.com/api/*`
   - the `apps/agent-tutor-live` WebSocket endpoint configured in `NEXT_PUBLIC_AGENT_TUTOR_LIVE_WS_URL`
4. `/app` renders the editor, terminal, and learning rail without runtime configuration errors.
