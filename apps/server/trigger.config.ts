import type { TriggerConfig } from '@trigger.dev/sdk/v3';

import { PrismaInstrumentation } from '@prisma/instrumentation';

export const config: TriggerConfig = {
  project: 'proj_common',
  logLevel: 'log',
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  triggerDirectories: ['./integrations', './src/trigger'],

  instrumentations: [new PrismaInstrumentation()],

  additionalFiles: ['./prisma/schema.prisma'],
  additionalPackages: ['prisma@5.17.0'],
};
