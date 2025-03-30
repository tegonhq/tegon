import { MailerService } from '@nestjs-modules/mailer';
import { TypePasswordlessEmailDeliveryInput } from 'supertokens-node/lib/build/recipe/passwordless/types';
import jwt from 'supertokens-node/recipe/jwt';
import Passwordless from 'supertokens-node/recipe/passwordless';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

import { LoggerService } from 'modules/logger/logger.service';
import { UsersService } from 'modules/users/users.service';

const logger = new LoggerService('Supertokens');

function logEmail(email: string, link: string) {
  const message = `##### sendEmail to ${email}, subject: Login email

Log in to Tegon.ai

Click here to log in with this magic link:
${link}\n\n`;

  if (process.env.NODE_ENV !== 'production') {
    logger.info({ message });
  }
}

export const recipeList = (
  usersService: UsersService,
  mailerService: MailerService,
) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieSettings = isProd
    ? {
        cookieDomain: process.env.SUPERTOKENS_DOMAIN,
        olderCookieDomain: '',
        cookieSecure: true,
      }
    : {};

  return [
    jwt.init(),
    UserRoles.init(),
    Session.init({
      ...cookieSettings,
      override: {
        functions(originalImplementation) {
          return {
            ...originalImplementation,
            async createNewSession(input) {
              // since frontend needs workspaces we converted usersOnWorkspaces
              // To workspaces
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const user = (await usersService.getUser(input.userId)) as any;
              const workspace = user.workspaces[0];

              const workspaceData = workspace
                ? { workspaceId: workspace.id, role: workspace.role }
                : {};

              input.accessTokenPayload = {
                ...input.accessTokenPayload,
                ...workspaceData,
              };

              return originalImplementation.createNewSession(input);
            },
          };
        },
      },
    }), // initializes session features
    Passwordless.init({
      contactMethod: 'EMAIL',
      flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
      emailDelivery: {
        override: (originalImplementation) => {
          return {
            ...originalImplementation,
            async sendEmail({
              email,
              urlWithLinkCode,
              codeLifetime,
            }: TypePasswordlessEmailDeliveryInput) {
              logEmail(email, urlWithLinkCode);

              try {
                await mailerService.sendMail({
                  to: email,
                  subject: 'Login for Tegon',
                  template: 'loginUser',
                  context: {
                    userName: email.split('@')[0],
                    magicLink: urlWithLinkCode,
                    linkExpiresIn: Math.floor(codeLifetime / 60000),
                  },
                });
              } catch (error) {
                logger.error({
                  message: `Error while sending mail`,
                  where: `supertokens.config.recipeList`,
                  error,
                });
              }
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
  ];
};
