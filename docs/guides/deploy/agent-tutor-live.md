# Agent Tutor Live Deployment Guide

## Scope

Deploy `apps/agent-tutor-live` to Google Cloud Run as the live tutoring backend.

## Infra Source of Truth

- `infra/apps/agent-tutor-live/cloudrun.yaml`
- `infra/apps/agent-tutor-live/Dockerfile`

Current production service:

- `gemini-live-agent-prod-run-agent-backend-00`

## GCP Auth

Authenticate and target the correct project before deploying:

```bash
gcloud auth login
gcloud config set project "$GOOGLE_CLOUD_PROJECT"
gcloud config set run/region "${GOOGLE_CLOUD_REGION:-us-central1}"
```

Then enable the required Google APIs:

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --project "$GOOGLE_CLOUD_PROJECT"
```

Create the Artifact Registry repository once if it does not exist yet:

```bash
gcloud artifacts repositories create gemini-live-agent \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --location=us \
  --repository-format=docker \
  --description="gemini-live-agent Cloud Run images"
```

## Required Environment

1. `GEMINI_API_KEY`
2. `GEMINI_LIVE_MODEL`
3. `GOOGLE_CLOUD_PROJECT`
4. `GOOGLE_CLOUD_REGION`

Do not set `PORT` in `cloudrun.yaml`.

Why:

- Cloud Run injects `PORT` automatically
- explicitly setting it causes the deploy to fail

## Recommended Secret Setup

Use Google Secret Manager for `GEMINI_API_KEY`.

Example:

```bash
printf '%s' '<GEMINI_API_KEY>' | \
  gcloud secrets create gemini-live-agent-prod-gemini-api-key --data-file=- || true

printf '%s' '<GEMINI_API_KEY>' | \
  gcloud secrets versions add gemini-live-agent-prod-gemini-api-key --data-file=-
```

Then attach the secret to the Cloud Run service:

```bash
gcloud run services update gemini-live-agent-prod-run-agent-backend-00 \
  --region="${GOOGLE_CLOUD_REGION:-us-central1}" \
  --update-secrets=GEMINI_API_KEY=gemini-live-agent-prod-gemini-api-key:latest
```

Set or update the non-secret runtime vars:

```bash
gcloud run services update gemini-live-agent-prod-run-agent-backend-00 \
  --region="${GOOGLE_CLOUD_REGION:-us-central1}" \
  --update-env-vars=GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-12-2025
```

## Build And Push The Image

The current `pnpm release:agent-tutor-live` script only replaces the Cloud Run service.
It does not build and push the container image first.

Build and push the image before replacing the service:

```bash
tmpfile=$(mktemp /tmp/agent-tutor-live-cloudbuild.XXXXXX)
cat > "$tmpfile" <<'YAML'
steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - -f
      - infra/apps/agent-tutor-live/Dockerfile
      - -t
      - us-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/gemini-live-agent/agent-tutor-live:latest
      - .
images:
  - us-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/gemini-live-agent/agent-tutor-live:latest
YAML
gcloud builds submit --project "$GOOGLE_CLOUD_PROJECT" --config "$tmpfile" .
rm -f "$tmpfile"
```

The image path expected by Cloud Run is:

```txt
us-docker.pkg.dev/$GOOGLE_CLOUD_PROJECT/gemini-live-agent/agent-tutor-live:latest
```

## Local Validation Before Deploy

1. `pnpm --filter agent-tutor-live lint`
2. `pnpm --filter agent-tutor-live test`
3. `pnpm --filter agent-tutor-live build`

## Deploy

### Dev

`pnpm release:dev:agent-tutor-live`

### Production

`pnpm release:agent-tutor-live`

If `gcloud run services replace` does not substitute `${GOOGLE_CLOUD_PROJECT}` in the YAML for your shell flow, render a temporary manifest first:

```bash
tmpfile=$(mktemp /tmp/agent-tutor-live-service.XXXXXX.yaml)
perl -pe "s/\\$\\{GOOGLE_CLOUD_PROJECT\\}/$GOOGLE_CLOUD_PROJECT/g" \
  infra/apps/agent-tutor-live/cloudrun.yaml > "$tmpfile"
gcloud run services replace "$tmpfile" --project "$GOOGLE_CLOUD_PROJECT" --region "${GOOGLE_CLOUD_REGION:-us-central1}"
rm -f "$tmpfile"
```

If Cloud Run keeps serving an older `latest` image, deploy by digest:

```bash
gcloud artifacts docker images list \
  us-docker.pkg.dev/$GOOGLE_CLOUD_PROJECT/gemini-live-agent/agent-tutor-live \
  --include-tags
```

Then:

```bash
gcloud run services update gemini-live-agent-prod-run-agent-backend-00 \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "${GOOGLE_CLOUD_REGION:-us-central1}" \
  --image us-docker.pkg.dev/$GOOGLE_CLOUD_PROJECT/gemini-live-agent/agent-tutor-live@sha256:<digest>
```

## Public Invocation

The browser must be able to reach the live tutor service directly.

Grant unauthenticated invoker access:

```bash
gcloud run services add-iam-policy-binding gemini-live-agent-prod-run-agent-backend-00 \
  --project "$GOOGLE_CLOUD_PROJECT" \
  --region "${GOOGLE_CLOUD_REGION:-us-central1}" \
  --member="allUsers" \
  --role="roles/run.invoker"
```

## Default Public Endpoint

Default production endpoint:

- `wss://<agent-tutor-live-service>.a.run.app/live`

After the service is deployed, use the Cloud Run service URL in `apps/web`:

1. capture the Cloud Run service URL
2. update `apps/web` so `NEXT_PUBLIC_AGENT_TUTOR_LIVE_WS_URL` points at:
   - `wss://<agent-tutor-live-service>.a.run.app/live`
3. redeploy `apps/web`

## Optional Custom Hostname

If you later decide to front the live tutor with a custom hostname, treat it as a separate infrastructure task.

Current recommendation:

- keep `apps/agent-tutor-live` on its Google-provided `run.app` URL
- do not use direct Cloud Run custom domain mapping as the default production path
- only introduce a public custom hostname when there is a concrete product reason and a fronting strategy you want to own

## Optional Domain Mapping Validation

Skip this section unless you intentionally choose to reintroduce a custom hostname later.

## Post-Deploy Checks

1. `GET /health` returns `200`
2. WebSocket upgrade on `/live` works
3. `apps/web` can reach the live runtime on the configured WebSocket URL
4. Tutor responses reference current source code and runtime output
5. Audio in/out and transcripts work end to end
6. The architecture diagram and demo clearly show Cloud Run as the live tutor host
7. If `/health` returns `403`, re-check the `roles/run.invoker` binding.
