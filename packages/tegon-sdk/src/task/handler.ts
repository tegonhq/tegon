import { ActionEventPayload, JsonObject, JsonValue } from '@tegonhq/types';
import { task as triggerTask, schedules } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { getToken, getTokenFromAPI, setToken } from './token';
import { InitFunction, RunFunction, ScheduleRunFunction } from './types';

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

export function handler(name: string, run: RunFunction, init: InitFunction) {
  const id = name;

  return triggerTask({
    id,
    init: async (eventPayload: ActionEventPayload) => {
      let userId, accountId;

      if (eventPayload.payload.userId) {
        userId = eventPayload.payload.userId;
      } else if (init) {
        ({ userId, accountId } = await init(eventPayload));
      }

      const {
        token,
        userId: authenticatedUserId,
        action,
      } = await getTokenFromAPI({
        userId,
        accountId,
        id,
      });

      setToken(token);

      return { userId: authenticatedUserId, action };
    },
    run: async (
      eventPayload: ActionEventPayload,
      { init },
    ): Promise<JsonObject> => {
      return await run({
        ...eventPayload,
        payload: {
          ...(init ? init : {}),
          ...eventPayload.payload,
        },
      } as ActionEventPayload);
    },
  });
}

export function scheduleHandler(name: string, run: ScheduleRunFunction) {
  const id = name;

  return schedules.task({
    id,
    init: async (payload) => {
      const {
        token,
        userId: authenticatedUserId,
        action,
      } = await getTokenFromAPI({
        userId: payload.externalId,
        id,
      });
      setToken(token);

      return { userId: authenticatedUserId, action };
    },
    run: async (): Promise<JsonValue> => {
      return await run();
    },
  });
}
