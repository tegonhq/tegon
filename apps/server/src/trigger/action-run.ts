import createLoadRemoteModule, {
  createRequires,
} from '@paciolan/remote-module-loader';
import { logger, task } from '@trigger.dev/sdk/v3';
import axios from 'axios';

const fetcher = async (url: string) => {
  // Handle remote URLs with axios
  const response = await axios.get(url);

  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadRemoteModule = async (requires: any) =>
  createLoadRemoteModule({ fetcher, requires });

function createAxiosInstance(token: string) {
  const instance = axios.create();

  instance.interceptors.request.use((config) => {
    if (
      config.url.includes(process.env.FRONTEND_HOST) ||
      config.url.includes(process.env.BACKEND_HOST)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRequires = (axios: any) => createRequires({ axios });

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
    const remoteModuleLoad = await loadRemoteModule(
      getRequires(createAxiosInstance(accessToken)),
    );

    const integrationFunction = await remoteModuleLoad(`${action.url}`);

    return await integrationFunction.run(event);
  },
});
