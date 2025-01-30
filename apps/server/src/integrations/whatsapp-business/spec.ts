export function spec() {
  return {
    workspace_auth: {
      OAuth2: {
        token_url: 'https://graph.facebook.com/v22.0/oauth/access_token',
        authorization_url: 'https://www.facebook.com/v22.0/dialog/oauth',
        authorization_params: {
          app_id: '1147454296789756',
        },
        scopes: [
          'whatsapp_business_management',
          'whatsapp_business_messaging',
          'business_management',
        ],
      },
    },
  };
}
