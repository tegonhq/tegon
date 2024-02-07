/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { UnauthorizedException } from '@nestjs/common';
import { verify, decode } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { Error as STError } from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import { VerifySessionOptions } from 'supertokens-node/recipe/session';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

async function getKey(jwt: string) {
  const decoded = decode(jwt, { complete: true });

  const client = new JwksClient({
    jwksUri: `${process.env.BACKEND_HOST}/auth/jwt/jwks.json`,
  });

  const key = await client.getSigningKey(decoded.header.kid);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return key!.getPublicKey();
}

export async function hasValidHeader(authHeaderValue: string) {
  // this for users to call from their APIs

  authHeaderValue =
    authHeaderValue === undefined
      ? undefined
      : authHeaderValue.split('Bearer ')[1];

  if (authHeaderValue === undefined) {
    throw new UnauthorizedException({
      message: 'Unauthorised',
    });
  } else {
    if (authHeaderValue === process.env.MASTER_TOKEN) {
      return true;
    }

    const publicKey = await getKey(authHeaderValue);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = verify(authHeaderValue, publicKey, {});
      if (response.source !== 'microservice') {
        throw new UnauthorizedException({
          message: 'Unauthorised',
        });
      }
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Unauthorised',
      });
    }
  }

  return false;
}

export async function isSessionValid(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  verifyOptions: VerifySessionOptions,
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
      return hasValidHeader(request.headers['authorization']);
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
    throw new UnauthorizedException({
      message: 'Unauthorised',
    });
  }

  return true;
}
