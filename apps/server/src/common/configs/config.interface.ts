export interface Config {
  cors: CorsConfig;
  superToken: SuperTokenConfig;
  log: LogConfigs;
}

export interface LogConfigs {
  level: string;
  createLogFile?: boolean;
}

export interface AppInfoConfig {
  appName: string;
  apiDomain: string;
  websiteDomain: string;
  apiBasePath: string;
  websiteBasePath: string;
}

export interface SuperTokenConfig {
  appInfo: AppInfoConfig;
  connectionURI: string;
}

export interface CorsConfig {
  enabled: boolean;
}
