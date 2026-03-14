# Google Integration

This page is written for Gemini Live Agent Challenge judges.

Google services are not an optional add-on in `agent-tutor`. They are part of the core product and the category fit.

## What To Verify

- Gemini Live is the tutor model/runtime
- The Google GenAI SDK is used in the live-agent backend
- The live-agent backend is hosted on Google Cloud Run

## Google Services Used

### Gemini Live / Google GenAI SDK

Used for the live tutor in `apps/agent-live`.

It powers:
- real-time voice input
- transcript output
- audio output
- multimodal reasoning over:
  - lesson context
  - runtime context
  - workspace screenshots

Repo evidence:
- `apps/agent-live/package.json`
- `apps/agent-live/src/index.ts`
- `apps/agent-live/src/workflows/createLiveTutorSession.ts`

### Google Cloud Run

Used to host `apps/agent-live`.

This is the live-agent backend required for the Live Agents category.

Repo evidence:
- `infra/apps/agent-live/cloudrun.yaml`
- `docs/guides/deploy/agent-live.md`

## How Google Services Show Up In The User Experience

When the learner asks for help:
1. the browser sends lesson context, runtime context, and a workspace screenshot
2. `apps/agent-live` receives the turn over a live WebSocket session
3. `apps/agent-live` sends that grounded turn to Gemini Live
4. Gemini Live returns tutor audio and transcript output
5. the learner hears and sees the tutor response in the app

This means the Google stack is directly visible in the product:
- not just in infrastructure
- not just in a background integration
- but in the actual tutoring loop

## Summary

> `agent-tutor` uses Gemini Live through the Google GenAI SDK to power a real-time coding tutor that can hear the learner, speak back, and reason over lesson context, runtime output, and a screenshot of the visible workspace. The live-agent backend is hosted on Google Cloud Run, which is the Google Cloud service used for the Live Agents category.

## Code Pointers

- Live tutor entrypoint:
  - `apps/agent-live/src/index.ts`
- Gemini session creation:
  - `apps/agent-live/src/workflows/createLiveTutorSession.ts`
- Cloud Run deploy surface:
  - `infra/apps/agent-live/cloudrun.yaml`
