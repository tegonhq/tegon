/** Copyright (c) 2024, Tegon, all rights reserved. **/

export interface Config {
  cors: CorsConfig;
  superToken: SuperTokenConfig;
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
