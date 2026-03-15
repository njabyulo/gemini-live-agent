FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/agent-tutor-live/package.json ./apps/agent-tutor-live/package.json

RUN corepack enable && pnpm install --filter @gemini-live-agent/shared --filter agent-tutor-live --frozen-lockfile=false

COPY packages/shared ./packages/shared
COPY apps/agent-tutor-live ./apps/agent-tutor-live

RUN pnpm --filter @gemini-live-agent/shared build \
  && pnpm --filter agent-tutor-live build

RUN node -e "const fs=require('node:fs'); const p='/app/packages/shared/package.json'; const pkg=JSON.parse(fs.readFileSync(p,'utf8')); pkg.exports={'./consts':'./dist/consts/index.js','./types':'./dist/types/index.js','./utils':'./dist/utils/index.js'}; fs.writeFileSync(p, JSON.stringify(pkg, null, 2));"

WORKDIR /app/apps/agent-tutor-live

ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/index.js"]
