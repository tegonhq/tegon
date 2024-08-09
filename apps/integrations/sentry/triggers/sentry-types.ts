export const sentryRegex =
  /^https:\/\/(?<orgSlug>.+)\.sentry\.io\/issues\/(?<sentryIssueId>\d+)\//;

export interface SentryIntegrationSettings {
  orgSlug: string;
}
