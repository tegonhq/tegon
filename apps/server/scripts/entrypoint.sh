#!/bin/sh
set -xe

cd /app/apps/server
# exec dumb-init pnpm run start:local
NODE_PATH='/app/node_modules/.pnpm/node_modules' exec dumb-init pnpm start-prod-with-prisma