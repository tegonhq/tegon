import { Injectable } from '@nestjs/common';
import supertokens, { deleteUser } from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { UsersService } from 'modules/users/users.service';

import { recipeList } from './supertokens.config';

@Injectable()
export class SupertokensService {
  constructor(private usersService: UsersService) {
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
      recipeList: recipeList(this.usersService),
    });
  }

  getEmailPasswordRecipe() {
    return EmailPassword;
  }

  async deleteUserForId(userId: string) {
    await deleteUser(userId);
  }
}
