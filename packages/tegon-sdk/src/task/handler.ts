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
  if (axiosConfig.url.startsWith('/api')) {
    axiosConfig.url = process.env.BASE_HOST
      ? `${process.env.BASE_HOST}${axiosConfig.url}`
      : `http://host.docker.internal:3000${axiosConfig.url}`;
  }

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
      if (eventPayload.accessToken) {
        global.accessToken = eventPayload.accessToken;
      }

      delete eventPayload.accessToken;
      if (init) {
        return await init(eventPayload);
      }
    },
    run: async (
      eventPayload: ActionEventPayload,
      { init },
    ): Promise<JsonObject> => {
      delete eventPayload.accessToken;

      return await run({
        ...(init ? init : {}),
        ...eventPayload,
      } as ActionEventPayload);
    },
  });
}
