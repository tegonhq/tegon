import type {
  ResolveEnvironmentVariablesFunction,
  TriggerConfig,
} from '@trigger.dev/sdk/v3';

// This runs when you run the deploy command or the dev command
export const resolveEnvVars: ResolveEnvironmentVariablesFunction = async ({
  // any existing env vars from a .env file or Trigger.dev
  env,
}) => {
  // the existing environment variables from Trigger.dev (or your local .env file)
  return {
    variables: {
      TRIGGER_TOKEN: env.TRIGGER_TOKEN,
    },
  };
};

export const config: TriggerConfig = {
  project: 'proj_integration',
  logLevel: 'debug',
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
  dependenciesToBundle: [
    'configstore',
    'xdg-basedir',
    'atomically',
    'stubborn-fs',
    'when-exit',
    'dot-prop',
  ],
  triggerDirectories: ['./slack', '/sentry'],
};
