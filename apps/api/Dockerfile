# === BUILDER ===
FROM node:22-bookworm-slim AS builder
RUN npm install -g pnpm@9.12.0
WORKDIR /repo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ai/package.json ./packages/ai/
COPY packages/pdf/package.json ./packages/pdf/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
COPY packages/ai ./packages/ai
COPY packages/pdf ./packages/pdf
COPY apps/api ./apps/api

RUN pnpm --filter="@lume/api..." build

# === RUNNER (with Playwright Chromium) ===
FROM mcr.microsoft.com/playwright:v1.49.0-noble AS runner
RUN npm install -g pnpm@9.12.0
WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY --from=builder /repo/pnpm-workspace.yaml /repo/package.json /repo/pnpm-lock.yaml ./
COPY --from=builder /repo/packages ./packages
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/apps/api/dist ./apps/api/dist

RUN pnpm install --frozen-lockfile --prod

EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
