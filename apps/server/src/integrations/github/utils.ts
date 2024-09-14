import { PrismaClient } from '@prisma/client';
import { IntegrationAccount, IntegrationDefinition } from '@tegonhq/types';
import axios from 'axios';
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

export async function getBotJWTToken(
  integrationDefinition: IntegrationDefinition,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const integrationConfig = integrationDefinition.config as Record<string, any>;

  const appId = integrationConfig.appId;
  const privateKey = integrationConfig.privateKey.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // issued at time, 60 seconds in the past to allow for clock drift
    exp: now + 600, // JWT expiration time (10 minutes)
    iss: appId, // GitHub App's identifier
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

export async function getAccessToken(
  prisma: PrismaClient,
  integrationAccount: IntegrationAccount,
) {
  // Get the integration configuration as a Record<string, string>
  const config = integrationAccount.integrationConfiguration as Record<
    string,
    string
  >;
  // Get the current timestamp
  const currentDate = Date.now();
  // Get the access token expiration timestamp
  const accessExpiresIn = Number(config.access_expires_in);

  // If the access token is expired or not set
  if (!accessExpiresIn || currentDate >= accessExpiresIn) {
    // Get the client ID, client secret, and refresh token from the configuration
    const { refresh_token } = config;
    const { clientId: client_id, clientSecret: client_secret } =
      integrationAccount.integrationDefinition as IntegrationDefinition;

    const url = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token`;

    // Send a POST request to refresh the access token
    const { data } = await axios.post(url);
    // Parse the response data as URL search params
    const tokens = new URLSearchParams(data);

    // Get the new access token expiration time in milliseconds
    const expiresIn = Number(tokens.get('expires_in')) * 1000;
    // Get the new refresh token expiration time in milliseconds
    const refreshExpiresIn =
      Number(tokens.get('refresh_token_expires_in')) * 1000;

    // Update the configuration with the new refresh token, access token, and expiration times
    config.refresh_token = tokens.get('refresh_token');
    config.access_token = tokens.get('access_token');
    config.access_expires_in = (currentDate + expiresIn).toString();
    config.refresh_expires_in = (currentDate + refreshExpiresIn).toString();

    // Update the integration account in the database with the new configuration
    await prisma.integrationAccount.update({
      where: { id: integrationAccount.id },
      data: { integrationConfiguration: config },
    });
  }

  // Return the access token
  return config.access_token;
}

export async function getBotAccessToken(
  integrationAccount: IntegrationAccount,
) {
  try {
    // Get a new bot JWT token
    const token = await getBotJWTToken(
      integrationAccount.integrationDefinition as IntegrationDefinition,
    );

    // Construct the URL to request a new access token
    const url = `https://api.github.com/app/installations/${integrationAccount.accountId}/access_tokens`;

    const { data: accessResponse } = await axios.post(
      url,
      {},
      getGithubHeaders(token),
    );

    // Prepare the updated configuration with the new access token and expiration timestamp
    const config = {
      access_token: accessResponse.token,
      expires_at: accessResponse.expires_at,
    };

    return config.access_token;
  } catch (e) {
    console.log(e.message);
  }
}
