import { IntegrationInternalInput } from '@tegonhq/types';
import { task } from '@trigger.dev/sdk/v3';

import { deleteRequest } from '../../triggers/integration.utils';
import { getBotJWTToken, getGithubHeaders } from '../utils';

export const githubAppDelete = task({
  id: 'github-app-delete',
  run: async (payload: IntegrationInternalInput) => {
    const { integrationAccount } = payload;
    const githubAccesstoken = await getBotJWTToken(integrationAccount);

    return await deleteRequest(
      `https://api.github.com/app/installations/${integrationAccount.accountId}`,
      getGithubHeaders(githubAccesstoken),
    );
  },
});
