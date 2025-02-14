import { PrismaInstrumentation } from '@prisma/instrumentation';
import {
  additionalPackages,
  syncEnvVars,
} from '@trigger.dev/build/extensions/core';
import { prismaExtension } from '@trigger.dev/build/extensions/prisma';
import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: 'proj_mmcuxtmqscunuddmvjwm',
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 1,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ['./src/trigger'],
  instrumentations: [new PrismaInstrumentation()],
  build: {
    extensions: [
      syncEnvVars(() => {
        return {
          BASE_HOST: process.env.BASE_HOST,
          DATABASE_URL: process.env.DATABASE_URL,
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
          SMTP_PASSWORD: process.env.SMTP_PASSWORD,
          GCP_SERVICE_ACCOUNT: process.env.GCP_SERVICE_ACCOUNT,
        };
      }),
      additionalPackages({
        packages: ['@tegonhq/types'],
      }),
      prismaExtension({
        schema: 'prisma/schema.prisma',
      }),
    ],
  },
});
