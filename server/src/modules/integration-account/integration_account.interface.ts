/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { Config } from '@poozle/engine-idk';
import { IntegrationType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { WorkspaceIdRequestBody } from 'common/interfaces/workspace.interface';

import { SyncPeriod } from 'modules/sync/sync.util';

export class IntegrationAccountRequestIdBody {
  /**
   * Unique identifier for Integration Account
   */
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountWithLinkRequestIdBody {
  /**
   * Identifier used by link model
   */
  @IsString()
  linkId: string;
}

export class IntegrationAccountRequestBody extends WorkspaceIdRequestBody {
  /**
   * Unique identifier for Integration Account
   */
  @IsString()
  integrationAccountId: string;
}

export class IntegrationAccountsRequestBody extends WorkspaceIdRequestBody {}

export class IntegrationAccountRequestBodyWithIntegrationType extends IntegrationAccountRequestBody {
  /**
   * Describes which category integration belongs to.
   */
  integrationType: IntegrationType;
}

export class IntegrationCheckBody extends WorkspaceIdRequestBody {
  /**
   * Unique identifier for Integration Definition
   */
  @IsString()
  integrationDefinitionId: string;

  /**
   * All params needed by the integration to talk to their APIs
   */
  config: Config;

  /**
   * A string according to the integration spec
   * Example: OAuth2, Api Key etc
   */
  @IsString()
  authType: string;
}

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

  /**
   * Enable sync for this account
   */
  @IsOptional()
  @IsBoolean()
  syncEnabled: boolean;

  /**
   * Enable sync for this account
   */
  @IsOptional()
  @IsString()
  @IsEnum(SyncPeriod)
  syncPeriod?: SyncPeriod;
}

export class CreateIntegrationAccountWithLinkBody {
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
   * All params needed by the integration to talk to their APIs
   */
  @IsString()
  authType: string;

  /**
   * A unique identifier can be passed to identify a group of Accounts.
   * Example: You can pass user_id or random hash.
   */
  @IsString()
  @IsOptional()
  accountIdentifier: string;

  /**
   * All properties needed by the integration to talk to their APIs
   */
  @IsObject()
  config: Config;
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

  /**
   * Enable sync for this account
   */
  @IsOptional()
  @IsBoolean()
  syncEnabled = false;

  /**
   * Enable sync for this account
   */
  @IsOptional()
  @IsString()
  @IsEnum(SyncPeriod)
  syncPeriod?: SyncPeriod;
}
