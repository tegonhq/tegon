export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url: 'http://localhost:3002/auth/whatsapp',
        authorization_url: 'http://localhost:3002/auth/whatsapp',
        scopes: ['all'],
      },
    },
  };
}
