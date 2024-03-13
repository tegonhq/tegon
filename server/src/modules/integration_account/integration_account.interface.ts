/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsObject, IsOptional, IsString } from 'class-validator';

import { WorkspaceIdRequestBody } from 'modules/workspaces/workspaces.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Settings = Record<string, any>;

export class IntegrationAccountRequestIdBody {
  /**
   * Unique identifier for Integration Account
   */
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountRequestBody extends WorkspaceIdRequestBody {
  /**
   * Unique identifier for Integration Account
   */
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountsRequestBody extends WorkspaceIdRequestBody {}

export class CreateIntegrationAccountBody extends WorkspaceIdRequestBody {
  /**
   * Unique identifier for Integration Definition
   */
  @IsString()
  integrationDefinitionId: string;

  /**
   * This is used for User experience. You can pass a name
   * to easily identify the account in UI
   */
  @IsString()
  integrationAccountName: string;

  /**
   * A string according to the integration spec
   * Example: OAuth2, Api Key etc
   */
  @IsString()
  authType: string;

  /**
   * All properties needed by the integration to talk to their APIs
   */
  @IsObject()
  config: Config;

  /**
   * A unique identifier can be passed to identify a group of Accounts.
   * Example: You can pass user_id or random hash.
   */
  @IsString()
  @IsOptional()
  accountIdentifier: string;

  @IsString()
  @IsOptional()
  accountId: string;

  @IsObject()
  @IsOptional()
  settings: Settings;

  @IsString()
  @IsOptional()
  userId: string;
}

export class UpdateIntegrationAccountBody {
  /**
   * This is used for User experience. You can pass a name
   * to easily identify the account in UI
   */
  @IsString()
  integrationAccountName: string;

  /**
   * All params needed by the integration to talk to their APIs
   */
  @IsString()
  authType: string;

  /**
   * All properties needed by the integration to talk to their APIs
   */
  @IsObject()
  config: Config;
}
