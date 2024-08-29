import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import supertokens, { deleteUser } from 'supertokens-node';

import { UsersService } from 'modules/users/users.service';

import { recipeList } from './supertokens.config';

@Injectable()
export class SupertokensService {
  constructor(
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {
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
      recipeList: recipeList(this.usersService, this.mailerService),
    });
  }

  async deleteUserForId(userId: string) {
    await deleteUser(userId);
  }
}
