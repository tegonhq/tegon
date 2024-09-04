import { randomBytes } from 'crypto';

import { UnauthorizedException } from '@nestjs/common';
import { verify, decode } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { Error as STError } from 'supertokens-node';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { createNewSessionWithoutRequestResponse } from 'supertokens-node/recipe/session';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import { UsersService } from 'modules/users/users.service';

export async function getKey(jwt: string) {
  const decoded = decode(jwt, { complete: true });

  const client = new JwksClient({
    jwksUri: `${process.env.BACKEND_HOST}/auth/jwt/jwks.json`,
  });

  const key = await client.getSigningKey(decoded.header.kid);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return key!.getPublicKey();
}

export async function hasValidPat(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
  usersService: UsersService,
) {
  let authHeaderValue = request.headers['authorization'];
  authHeaderValue =
    authHeaderValue === undefined
      ? undefined
      : authHeaderValue.split('Bearer ')[1];

  if (authHeaderValue !== undefined) {
    const jwt = await usersService.getJwtFromPat(authHeaderValue);

    if (jwt) {
      const publicKey = await getKey(jwt);
      const data = verify(jwt, publicKey, {});

      request.session = await createNewSessionWithoutRequestResponse(
        'public',
        supertokens.convertToRecipeUserId(data.sub as string),
      );
      return `Bearer ${jwt}`;
    }
  }

  return undefined;
}

export async function hasValidHeader(
  authHeaderValue: string,
  throwError: boolean = true,
) {
  authHeaderValue =
    authHeaderValue === undefined
      ? undefined
      : authHeaderValue.split('Bearer ')[1];

  if (authHeaderValue === undefined) {
    if (throwError) {
      throw new UnauthorizedException({
        message: 'Unauthorised',
      });
    }

    return false;
  }

  try {
    const publicKey = await getKey(authHeaderValue);
    verify(authHeaderValue, publicKey, {});
    return true;
  } catch (e) {
    if (throwError) {
      throw new UnauthorizedException({
        message: 'Unauthorised',
      });
    }
    return false;
  }
}

export async function isSessionValid(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  verifyOptions: VerifySessionOptions,
  usersService: UsersService,
): Promise<boolean> {
  let err = undefined;

  try {
    const session = await Session.getSession(request, response, {
      sessionRequired: false,
    });

    if (session !== undefined) {
      // API call from the frontend and session verification is successful..
      await verifySession({ ...verifyOptions })(request, response, (res) => {
        err = res;
      });
    } else {
      let authHeader = request.headers['authorization'];
      if (authHeader && authHeader.includes('tg_pat_')) {
        authHeader = await hasValidPat(request, usersService);

        request.headers['personal'] = true;
      }

      return hasValidHeader(authHeader);
    }

    if (response.headersSent) {
      throw new STError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      });
    }

    if (err) {
      throw err;
    }
  } catch (err) {
    console.log(err);
    throw new UnauthorizedException({
      message: 'Unauthorised',
    });
  }

  return true;
}

export async function generateKeyForUserId(userId: string) {
  const session = await createNewSessionWithoutRequestResponse(
    'public',
    supertokens.convertToRecipeUserId(userId),
  );

  const accessToken = session.getAccessToken();
  return accessToken;
}

export function generatePersonalAccessToken(): string {
  const prefix = 'tg_pat_';
  const randomString = randomBytes(24)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '');

  return `${prefix}${randomString}`;
}
