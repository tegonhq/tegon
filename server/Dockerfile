FROM node:18-alpine AS builder

RUN apk add curl bash


# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY prisma ./prisma/
COPY scripts ./scripts/

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/certs ./certs
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod" ]