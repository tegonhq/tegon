import {
  IntegrationEventPayload,
  IntegrationPayloadEventType,
  JsonValue,
} from '@tegonhq/types';
import { task as triggerTask } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { getIntegrationAccount } from './integration-account';
import { getToken, getTokenFromAPI, setToken } from './token';
import { InitFunction, RunFunction } from './types';

// Intercept axios requests and add token to the request
axios.interceptors.request.use((axiosConfig) => {
  if (!axiosConfig.headers.Authorization) {
    const authToken = getToken();
    if (authToken) {
      axiosConfig.headers.Authorization = `Bearer ${authToken}`;
    }
  }
  return axiosConfig;
});

interface TokenData {
  accountId?: string;
  userId?: string;
}

export function handler(name: string, run: RunFunction, init?: InitFunction) {
  return triggerTask({
    id: name,
    init: async (eventPayload: IntegrationEventPayload) => {
      const tokenData: TokenData = {};

      if (
        eventPayload.event === IntegrationPayloadEventType.GetIntegrationAccount
      ) {
        const initResponse = init ? await init(eventPayload) : undefined;
        if (initResponse?.accountId) {
          tokenData.accountId = initResponse.accountId;
        }
      } else {
        tokenData.userId = eventPayload.payload.userId;
      }

      const { token, userId: authenticatedUserId } =
        await getTokenFromAPI(tokenData);
      setToken(token);

      return {
        userId: authenticatedUserId,
        accountId: tokenData.accountId,
      };
    },
    run: async (
      eventPayload: IntegrationEventPayload,
      { init },
    ): Promise<JsonValue> => {
      if (
        eventPayload.event === IntegrationPayloadEventType.GetIntegrationAccount
      ) {
        const integrationAccount = await getIntegrationAccount(init.accountId);
        return { integrationAccountId: integrationAccount.id };
      }

      return await run({
        ...eventPayload,
        payload: {
          ...(init ? init : {}),
          ...eventPayload.payload,
        },
      } as IntegrationEventPayload);
    },
  });
}
