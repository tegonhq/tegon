import type { TriggerConfig } from '@trigger.dev/sdk/v3';

export const config: TriggerConfig = {
  project: 'proj_epueyrcusafijrrprvtg',
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
  triggerDirectories: ['./slack'],
};
