export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url:
          'https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/',
        authorization_url:
          'https://sentry.io/sentry-apps/tegon-dev/external-install',
        scopes: [
          'event:read',
          'event:write',
          'issue:read',
          'issue:write',
          'org:read',
          'org:write',
          'member:read',
          'member:write',
        ],
      },
    },
  };
}
