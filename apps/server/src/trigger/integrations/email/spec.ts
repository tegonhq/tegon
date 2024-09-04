export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        authorization_url: 'https://app.tegon.ai/api/v1/oauth/callback/email',
        token_url: 'https://app.tegon.ai/api/v1/oauth/callback/email',
        scopes: [''],
      },
    },
  };
}
