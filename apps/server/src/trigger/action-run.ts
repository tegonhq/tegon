import createLoadRemoteModule, {
  createRequires,
} from '@paciolan/remote-module-loader';
import * as tegonSDK from '@tegonhq/sdk';
import { logger, task } from '@trigger.dev/sdk/v3';
import axios from 'axios';

const fetcher = async (url: string) => {
  // Handle remote URLs with axios
  const response = await axios.get(url);

  return response.data;
};

function createAxiosInstance(token: string) {
  const instance = axios.create();

  instance.interceptors.request.use((axiosConfig) => {
    if (axiosConfig.url.startsWith('/api')) {
      axiosConfig.url = process.env.BASE_HOST
        ? `${process.env.BASE_HOST}${axiosConfig.url}`
        : `http://host.docker.internal:3000${axiosConfig.url}`;
    }

    if (!axiosConfig.headers.Authorization) {
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
    }

    return axiosConfig;
  });

  return instance;
}

export const actionRun = task({
  id: 'action-run',
  run: async ({
    workspaceId,
    payload,
  }: {
    workspaceId: string;
    // This is the event you want to pass to the integration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
  }) => {
    const { action, accessToken } = payload;
    logger.log(workspaceId);
    const remoteModuleLoad = await createLoadRemoteModule({
      fetcher,
      requires: createRequires({
        axios: createAxiosInstance(accessToken),
        '@tegonhq/sdk': tegonSDK,
      }),
    });

    const integrationFunction = await remoteModuleLoad(`${action.url}`);

    return await integrationFunction.run(payload);
  },
});
