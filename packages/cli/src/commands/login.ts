import { intro, log, spinner } from '@clack/prompts';
import { Command } from 'commander';
import open from 'open';
import pRetry from 'p-retry';
import { env } from 'std-env';
import { z } from 'zod';

import { ApiClient } from '../api/client';
import { CommonCommandOptions, commonOptions } from '../cli/common';
import { interceptAxios } from '../utilities/axios';
import { chalkLink } from '../utilities/cliOutput';
import {
  readAuthConfigProfile,
  writeAuthConfigProfile,
} from '../utilities/configFiles';
import { getVersion } from '../utilities/getVersion';
import { printInitialBanner } from '../utilities/initialBanner';

export const LoginCommandOptions = CommonCommandOptions.extend({
  apiUrl: z.string(),
});

export type LoginCommandOptions = z.infer<typeof LoginCommandOptions>;

export function configureLoginCommand(program: Command) {
  return commonOptions(
    program
      .command('login')
      .description('Login with Tegon so you can perform authenticated actions'),
  )
    .version(getVersion(), '-v, --version', 'Display the version number')
    .action(async () => {
      await printInitialBanner();
      await loginCommand();
    });
}

async function loginCommand() {
  return await login(false);
}

export async function login(embedded: boolean) {
  const opts = {
    defaultApiUrl: 'https://app.tegon.ai',
  };

  if (embedded) {
    intro('Logging in to Tegon');
  }

  const accessTokenFromEnv = env.ACCESS_TOKEN;

  if (accessTokenFromEnv) {
    const auth = {
      accessToken: accessTokenFromEnv,
      apiUrl: env.BASE_HOST ?? opts.defaultApiUrl,
      workspaceId: env.WORKSPACE_ID,
    };

    return { auth };
  }

  const authConfig = readAuthConfigProfile();

  if (authConfig && authConfig.accessToken) {
    const auth = {
      accessToken: authConfig.accessToken,
      apiUrl: env.BASE_HOST ?? authConfig.apiUrl ?? opts.defaultApiUrl,
      workspaceId: authConfig.workspaceId,
    };

    return { auth };
  }

  if (embedded) {
    log.step('You must login to continue.');
  }

  const apiClient = new ApiClient(env.BASE_HOST ?? opts.defaultApiUrl);
  // generate authorization code
  const authorizationCodeResult = await apiClient.createAuthorizationCode();

  // Link the user to the authorization code
  log.step(
    `Please visit the following URL to login:\n${chalkLink(authorizationCodeResult.url)}`,
  );

  await open(authorizationCodeResult.url);

  // poll for personal access token (we need to poll for it)
  const getPersonalAccessTokenSpinner = spinner();
  getPersonalAccessTokenSpinner.start('Waiting for you to login');

  try {
    const indexResult = await pRetry(
      () => apiClient.getPersonalAccessToken(authorizationCodeResult.code),
      {
        // this means we're polling, same distance between each attempt
        factor: 1,
        retries: 60,
        minTimeout: 1000,
      },
    );

    getPersonalAccessTokenSpinner.stop(`Logged in`);

    const userConfig = {
      accessToken: indexResult.token,
      workspaceId: indexResult.workspaceId,
      apiUrl: env.BASE_HOST ?? opts.defaultApiUrl,
    };

    interceptAxios(userConfig.accessToken);

    writeAuthConfigProfile(userConfig);

    return {
      auth: userConfig,
    };
  } catch (e) {
    getPersonalAccessTokenSpinner.stop(`Failed to get access token`);
  }
}
