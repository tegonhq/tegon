/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';

import * as SuperTokensConfig from 'common/configs/config';

@Injectable()
export class SupertokensService {
  constructor() {
    supertokens.init({
      appInfo: {
        appName: 'Tegon',
        apiDomain: process.env.BACKEND_HOST,
        websiteDomain: process.env.FRONTEND_HOST.split(',')[0] || '',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
      supertokens: {
        connectionURI: process.env.SUPERTOKEN_CONNECTION_URI,
      },
      recipeList: SuperTokensConfig.recipeList,
    });
  }
}
