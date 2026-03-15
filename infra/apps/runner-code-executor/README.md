# Runtime Code Executor Infra

Cloud Run configuration for `apps/runner-code-executor` lives here.

## Purpose

- host the internal Python execution backend
- keep runtime container and deploy config out of `apps/runner-code-executor`
- provide a stable deploy surface for `apps/api`

## Files

- `cloudrun.yaml`
- `Dockerfile`

## Deploy

From repo root:

- Dev: `pnpm release:dev:runner-code-executor`
- Production: `pnpm release:runner-code-executor`
