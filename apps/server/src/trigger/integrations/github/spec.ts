export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url: 'https://github.com/login/oauth/access_token',
        authorization_url:
          'https://github.com/apps/tegon-bot/installations/new',
        scopes: ['repo'],
      },
    },
    personal_auth: {
      OAuth2: {
        token_url: 'https://github.com/login/oauth/access_token',
        authorization_url: 'https://github.com/login/oauth/authorize',
        scopes: [] as string[],
      },
    },
    other_data: { app_id: '863429' },
  };
}
