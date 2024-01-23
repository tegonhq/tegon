/** Copyright (c) 2024, Tegon, all rights reserved. **/

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    const resp = ctx.getResponse();
    const request = ctx.getRequest();

    // this for users to call from their APIs
    let jwt = request.headers['authorization'];
    jwt = jwt === undefined ? undefined : jwt.split('Bearer ')[1];

    // This is to allow API calls from temporal workflows
    if (jwt && jwt === process.env.MASTER_TOKEN) {
      return true;
    }

    try {
      const session = await Session.getSession(request, resp, {
        sessionRequired: false,
      });

      if (session !== undefined) {
        // API call from the frontend and session verification is successful..
        await verifySession({ ...this.verifyOptions })(request, resp, (res) => {
          err = res;
        });
      } else {
        // this for users to call from their APIs
        let jwt = request.headers['authorization'];
        jwt = jwt === undefined ? undefined : jwt.split('Bearer ')[1];
        if (jwt === undefined) {
          throw new UnauthorizedException({
            message: 'Unauthorised',
          });
        } else {
          const publicKey = await getKey(jwt);

          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = verify(jwt, publicKey, {});
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
      }

      if (resp.headersSent) {
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
}
