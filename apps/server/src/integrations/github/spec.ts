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
  };
}
