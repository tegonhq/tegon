import { Spec } from '@tegonhq/types';
import jwt from 'jsonwebtoken';

import { githubHeaders } from './types';

export function getGithubHeaders(token: string) {
  return {
    headers: {
      ...githubHeaders,
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getBotJWTToken(integrationSpec: Spec) {
  const appId = integrationSpec.other_data.app_id;

  // Read private key synchronously to avoid unnecessary async operation
  const privateKey = process.env[`GITHUB_APP_PEM`];

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // issued at time, 60 seconds in the past to allow for clock drift
    exp: now + 600, // JWT expiration time (10 minutes)
    iss: appId, // GitHub App's identifier
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}
