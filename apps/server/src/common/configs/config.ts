import type { Config } from './config.interface';

export const config: Config = {
  cors: {
    enabled: true,
  },
  superToken: {
    appInfo: {
      appName: 'Tegon',
      apiDomain: process.env.BACKEND_HOST,
      websiteDomain: process.env.FRONTEND_HOST,
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    connectionURI: process.env.SUPERTOKEN_CONNECTION_URI,
  },
  log: {
    level: process.env.LOG_LEVEL,
    createLogFile: process.env.CREATE_LOG_FILE === 'true',
  },
};

export default (): Config => config;
