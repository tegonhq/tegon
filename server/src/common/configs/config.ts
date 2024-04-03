/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Config } from './config.interface';

import jwt from 'supertokens-node/lib/build/recipe/jwt';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

export const config: Config = {
  cors: {
    enabled: true,
  },
  superToken: {
    appInfo: {
      appName: 'Tegon',
      apiDomain: process.env.BACKEND_HOST,
      websiteDomain: process.env.FRONTEND_HOST,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    connectionURI: process.env.SUPERTOKEN_CONNECTION_URI,
  },
};

export const recipeList = [
  jwt.init(),
  EmailPassword.init(),
  UserRoles.init(),
  Session.init({
    cookieSecure: true,
  }), // initializes session features
  ThirdPartyEmailPassword.init({
    providers: [
      {
        config: {
          thirdPartyId: 'google',
          clients: [
            {
              clientId: process.env.GOOGLE_LOGIN_CLIENT_ID,
              clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
              scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
              ],
            },
          ],
        },
      },
    ],
  }),
];

export default (): Config => config;
