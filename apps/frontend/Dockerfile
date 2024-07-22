FROM node:18-alpine AS pruner
WORKDIR /app

COPY --chown=node:node . .
RUN npx -q turbo@1.10.9 prune --scope=frontend --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Base strategy to have layer caching
FROM node:18-alpine AS base
RUN apk add openssl dumb-init libc6-compat
WORKDIR /app
COPY --chown=node:node .gitignore .gitignore
COPY --from=pruner --chown=node:node /app/out/json/ .
COPY --from=pruner --chown=node:node /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner --chown=node:node /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

## Dev deps
FROM base AS dev-deps
WORKDIR /app
# Corepack is used to install pnpm
RUN corepack enable
ENV NODE_ENV development
RUN pnpm install --ignore-scripts --no-frozen-lockfile

## Production deps
FROM base AS production-deps
WORKDIR /app
# Corepack is used to install pnpm
RUN corepack enable
ENV NODE_ENV production
RUN pnpm install --prod --no-frozen-lockfile

## Builder (builds the frontend)
FROM base AS builder
WORKDIR /app
# Corepack is used to install pnpm
RUN corepack enable

COPY --from=pruner --chown=node:node /app/out/full/ .
COPY --from=dev-deps --chown=node:node /app/ .
COPY apps/frontend/.env.prod .env
COPY --chown=node:node turbo.json turbo.json
RUN pnpm run build --filter=frontend...


# Runner
FROM node:18-alpine AS runner
RUN apk add --no-cache dumb-init bash
WORKDIR /app
RUN corepack enable
ENV NODE_ENV production

COPY --from=builder  --chown=node:node /app/apps/frontend/.next/standalone ./
COPY --from=builder  --chown=node:node /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder  --chown=node:node /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder  --chown=node:node /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder  --chown=node:node /app/apps/frontend/entrypoint.sh ./apps/frontend/entrypoint.sh

EXPOSE 3000

USER node

CMD ["sh", "./apps/frontend/entrypoint.sh"]