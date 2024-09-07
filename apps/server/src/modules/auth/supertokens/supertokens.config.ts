import { MailerService } from '@nestjs-modules/mailer';
import jwt from 'supertokens-node/lib/build/recipe/jwt';
import { TypePasswordlessEmailDeliveryInput } from 'supertokens-node/lib/build/recipe/passwordless/types';
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
