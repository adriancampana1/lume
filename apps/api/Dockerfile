FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --filter=@lume/api --prod /prod/api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /prod/api .
EXPOSE 3001
CMD ["node", "dist/index.js"]
