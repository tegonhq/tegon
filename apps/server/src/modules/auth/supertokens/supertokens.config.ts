import { MailerService } from '@nestjs-modules/mailer';
import jwt from 'supertokens-node/lib/build/recipe/jwt';
import { TypePasswordlessEmailDeliveryInput } from 'supertokens-node/lib/build/recipe/passwordless/types';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Passwordless from 'supertokens-node/recipe/passwordless';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';

import { UsersService } from 'modules/users/users.service';

export const recipeList = (
  usersService: UsersService,
  mailerService: MailerService,
) => {
  return [
    jwt.init(),
    UserRoles.init(),
    Session.init({
      cookieSecure: true,
    }), // initializes session features
    Passwordless.init({
      contactMethod: 'EMAIL',
      flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
      emailDelivery: {
        override: (originalImplementation) => {
          return {
            ...originalImplementation,
            async getContent({
              email,
              urlWithLinkCode,
              codeLifetime,
            }: TypePasswordlessEmailDeliveryInput) {
              mailerService.sendMail({
                to: email,
                subject: 'Login for Tegon',
                template: 'loginUser',
                context: {
                  magicLink: urlWithLinkCode,
                  codeLifetime,
                },
              });
            },
          };
        },
      },
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            consumeCode: async (input: any) => {
              // First we call the original implementation of consumeCode.
              const response = await originalImplementation.consumeCode(input);

              // Post sign up response, we check if it was successful
              if (response.status === 'OK') {
                const { id, emails } = response.user;
                const email = emails[0];

                if (input.session === undefined) {
                  if (
                    response.createdNewRecipeUser &&
                    response.user.loginMethods.length === 1
                  ) {
                    await usersService.upsertUser(
                      id,
                      email,
                      email.split('@')[0],
                    );
                  }
                }
              }
              return response;
            },
          };
        },
      },
    }),
    ThirdPartyEmailPassword.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,

            // override the email password sign up function
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async emailPasswordSignUp(input: any) {
              const response =
                await originalImplementation.emailPasswordSignUp(input);

              if (
                response.status === 'OK' &&
                response.user.loginMethods.length === 1 &&
                input.session === undefined
              ) {
                await usersService.upsertUser(
                  response.user.id,
                  input.email,
                  input.email.split('@')[0],
                );
              }
              return response;
            },

            // override the thirdparty sign in / up function
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async thirdPartySignInUp(input: any) {
              const response =
                await originalImplementation.thirdPartySignInUp(input);

              if (response.status === 'OK') {
                if (input.session === undefined) {
                  if (
                    response.createdNewRecipeUser &&
                    response.user.loginMethods.length === 1
                  ) {
                    usersService.upsertUser(
                      response.user.id,
                      input.email,
                      input.email.split('@')[0],
                    );
                  } else {
                    // TODO: some post sign in logic
                  }
                }
              }

              return response;
            },
          };
        },
      },
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

    EmailPassword.init(),
  ];
};
