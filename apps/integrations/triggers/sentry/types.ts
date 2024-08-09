import { OAuth2Params } from '@tegonhq/types';

export const sentryRegex =
  /^https:\/\/(?<orgSlug>.+)\.sentry\.io\/issues\/(?<sentryIssueId>\d+)\//;

export interface SentryIntegrationSettings {
  orgSlug: string;
}

const enum ProviderAuthModes {
  'OAuth2' = 'OAuth2',
}

export interface ProviderTemplate extends OAuth2Params {
  auth_mode: ProviderAuthModes;
}
