import type {
  ResolveEnvironmentVariablesFunction,
  TriggerConfig,
} from '@trigger.dev/sdk/v3';

import { PrismaInstrumentation } from '@prisma/instrumentation';

// This runs when you run the deploy command or the dev command
export const resolveEnvVars: ResolveEnvironmentVariablesFunction = async ({
  env,
}) => {
  return {
    variables: {
      DATABASE_URL: env.DATABASE_URL,
      SMTP_HOST: env.SMTP_HOST,
      SMTP_PORT: env.SMTP_PORT,
      SMTP_USER: env.SMTP_USER,
      SMTP_PASSWORD: env.SMTP_PASSWORD,
      GCP_SERVICE_ACCOUNT: env.GCP_SERVICE_ACCOUNT,
    },
  };
};

export const config: TriggerConfig = {
  project: 'proj_common',
  logLevel: 'log',
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
  triggerDirectories: ['./src/trigger'],
  dependenciesToBundle: ['@tegonhq/types'],
  instrumentations: [new PrismaInstrumentation()],

  additionalFiles: ['./prisma/schema.prisma'],
  additionalPackages: ['prisma@5.17.0'],
};
