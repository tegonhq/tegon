export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url: 'https://slack.com/api/oauth.v2.access',
        authorization_url: 'https://slack.com/oauth/v2/authorize',
        scopes: [
          'app_mentions:read',
          'chat:write',
          'chat:write.customize',
          'channels:history',
          'groups:history',
          'mpim:history',
          'im:history',
          'commands',
          'links:read',
          'links:write',
          'users:read',
          'users:read.email',
          'channels:read',
          'groups:read',
          'im:read',
          'mpim:read',
          'reactions:read',
          'reactions:write',
          'files:read',
          'files:write',
          'channels:join',
          'groups:write.invites',
          'channels:write.invites',
          'team:read',
        ],
      },
    },
    personal_auth: {
      OAuth2: {
        token_url: 'https://slack.com/api/oauth.v2.access.personal',
        authorization_url: 'https://slack.com/oauth/v2/authorize.personal',
        scopes: ['chat:write', 'im:history', 'im:write', 'reactions:read'],
      },
    },
  };
}
