import { IntegrationEventPayload, JsonValue } from '@tegonhq/types';
import { task as triggerTask } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { getToken, getTokenFromAPI, setToken } from './token';
import { RunFunction } from './types';

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

export function handler(name: string, run: RunFunction) {
  return triggerTask({
    id: `${name}-handler`,
    init: async (eventPayload: IntegrationEventPayload) => {
      if (eventPayload.payload.userId) {
        console.log(eventPayload.payload.userId);
        const { token, userId: authenticatedUserId } = await getTokenFromAPI({
          userId: eventPayload.payload.userId,
        });
        setToken(token);
        return { userId: authenticatedUserId };
      }

      return undefined;
    },
    run: async (
      eventPayload: IntegrationEventPayload,
      { init },
    ): Promise<JsonValue> => {
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
