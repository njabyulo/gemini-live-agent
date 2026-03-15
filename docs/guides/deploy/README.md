# Deployment Guides

## Scope

Deployment guides for the app surfaces and execution runtimes in this repo.

## Guides

- [web.md](web.md)
- [api.md](api.md)
- [runtime-code-executor.md](runtime-code-executor.md)
- [agent-tutor-live.md](agent-tutor-live.md)

## Runtime Split

1. `apps/web` is hosted on Cloudflare
2. `apps/api` is hosted on Cloudflare
3. `apps/agent-tutor-live` is hosted on Google Cloud Run
4. `apps/runner-code-executor` is hosted on Google Cloud Run
5. The live agent itself remains clearly hosted on Google Cloud for judging
