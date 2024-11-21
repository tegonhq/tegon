import { OAuth2Params } from '@tegonhq/types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export interface RedirectURLParams {
  workspaceSlug: string;
  integrationOAuthAppName: string;
  config: string;
}

export interface SessionRecord {
  integrationDefinitionId: string;
  config: OAuth2Params;
  redirectURL: string;
  workspaceId: string;
  accountIdentifier?: string;
  integrationKeys?: string;
  personal: boolean;
  userId?: string;
}

export class OAuthBodyInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;

  @IsString()
  redirectURL: string;

  @IsBoolean()
  personal: boolean = false;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  integrationDefinitionId: string;
}

export type CallbackParams = Record<string, string>;

export interface SentryCallbackBody {
  workspaceId: string;
  installationId: string;
  code: string;
  orgSlug: string;
}

export interface ProviderConfig {
  client_id: string;
  client_secret: string;
  scopes: string;
}

const enum ProviderAuthModes {
  'OAuth2' = 'OAuth2',
}

export interface ProviderTemplate extends OAuth2Params {
  auth_mode: ProviderAuthModes;
}

export enum OAuthAuthorizationMethod {
  BODY = 'body',
  HEADER = 'header',
}

export enum OAuthBodyFormat {
  FORM = 'form',
  JSON = 'json',
}

export interface ProviderTemplateOAuth2 extends ProviderTemplate {
  auth_mode: ProviderAuthModes.OAuth2;

  disable_pkce?: boolean; // Defaults to false (=PKCE used) if not provided

  token_params?: {
    grant_type?: 'authorization_code' | 'client_credentials';
  };

  refresh_params?: {
    grant_type: 'refresh_token';
  };

  authorization_method?: OAuthAuthorizationMethod;
  body_format?: OAuthBodyFormat;

  refresh_url?: string;

  token_request_auth_method?: 'basic';
}
