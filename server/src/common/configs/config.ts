/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Config } from './config.interface';

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

export default (): Config => config;
