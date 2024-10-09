export type SentryTokenResponseData = {
  expiresAt: string; // ISO date string at which token must be refreshed
  token: string; // Bearer token authorized to make Sentry API requests
  refreshToken: string; // Refresh token required to get a new Bearer token after expiration
};

export interface SentryCallbackBody {
  workspaceId: string;
  integrationDefinitionId: string;
  installationId: string;
  code: string;
  orgSlug: string;
}
