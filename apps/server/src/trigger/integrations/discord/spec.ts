export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url: 'https://discord.com/api/oauth2/token',
        authorization_url: 'https://discord.com/api/oauth2/authorize',
        authorization_params: { permissions: '397821733952' },
        scopes: [
          'bot',
          'email',
          'identify',
          'messages.read',
          'applications.commands',
        ],
      },
    },
  };
}
