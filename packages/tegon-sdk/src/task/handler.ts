import { ActionEventPayload, JsonObject } from '@tegonhq/types';
import { task as triggerTask } from '@trigger.dev/sdk/v3';
import axios from 'axios';

import { InitFunction, RunFunction } from './types';

declare global {
  // eslint-disable-next-line no-var
  var accessToken: string;
}

// Intercept axios requests and add token to the request
axios.interceptors.request.use((axiosConfig) => {
  if (!axiosConfig.headers.Authorization) {
    if (global.accessToken) {
      axiosConfig.headers.Authorization = `Bearer ${global.accessToken}`;
    }
  }

  return axiosConfig;
});

export function handler(name: string, run: RunFunction, init?: InitFunction) {
  const id = name;

  return triggerTask({
    id,
    init: async (eventPayload: ActionEventPayload) => {
      if (eventPayload.data.accessToken) {
        global.accessToken = eventPayload.data.accessToken;
      }

      delete eventPayload.data.accessToken;
      return await init(eventPayload);
    },
    run: async (
      eventPayload: ActionEventPayload,
      { init },
    ): Promise<JsonObject> => {
      delete eventPayload.data.accessToken;

      return await run({
        ...(init ? init : {}),
        ...eventPayload,
      } as ActionEventPayload);
    },
  });
}
