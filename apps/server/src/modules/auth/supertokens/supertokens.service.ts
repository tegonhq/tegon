import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import supertokens, { deleteUser, getUser } from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';

import { UsersService } from 'modules/users/users.service';

import { recipeList } from './supertokens.config';

@Injectable()
export class SupertokensService implements OnModuleInit {
  async onModuleInit() {
    // await EmailPassword.(
    //   input.email,
    // );
    // await deleteUser('f145f8d2-e32c-4a46-a8f5-669312634e8c');
    await deleteUser('c3bdc310-3e38-439d-8d6d-6cbcc4c58b7b');
    const user = await getUser('0b84ca8a-2531-4a0a-8947-69c3ca4f152c');
    console.log(JSON.stringify(user));
  }
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

  getEmailPasswordRecipe() {
    return EmailPassword;
  }

  async deleteUserForId(userId: string) {
    await deleteUser(userId);
  }
}
