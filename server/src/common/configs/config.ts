/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Config } from './config.interface';

import jwt from 'supertokens-node/lib/build/recipe/jwt';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

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
  Session.init(), // initializes session features
];

export default (): Config => config;
