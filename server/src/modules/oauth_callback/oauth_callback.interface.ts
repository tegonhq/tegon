/** Copyright (c) 2022, Poozle, all rights reserved. **/

import { IsOptional, IsString } from 'class-validator';

export interface RedirectURLParams {
  workspaceSlug: string;
  integrationOAuthAppName: string;
  config: string;
}

export interface SessionRecord {
  integrationDefinitionId: string;
  integrationAccountName: string;
  config: Record<string, string>;
  redirectURL: string;
  linkId?: string;
  accountIdentifier?: string;
  integrationKeys?: string;
}

export class BodyInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;

  @IsString()
  integrationAccountName: string;

  @IsString()
  redirectURL: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsString()
  @IsOptional()
  linkId?: string;

  @IsString()
  @IsOptional()
  integrationKeys?: string;

  @IsString()
  @IsOptional()
  accountIdentifier?: string;

  @IsString()
  integrationOAuthAppId: string;
}

export type CallbackParams = Record<string, string>;

export interface ProviderConfig {
  client_id: string;
  client_secret: string;
  scopes: string;
}

const enum ProviderAuthModes {
  'OAuth2' = 'OAuth2',
}

export interface ProviderTemplate {
  auth_mode: ProviderAuthModes;
  authorization_url: string;
  authorization_params?: Record<string, string>;
  default_scopes?: string[];
  scope_separator?: string;
  token_url: string;
  token_params?: Record<string, string>;
  redirect_uri_metadata?: string[];
  token_response_metadata?: string[];

  token_expiration_buffer?: number; // In seconds.
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
