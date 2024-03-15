/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IntegrationName } from '@prisma/client';
import { IsJSON, IsObject, IsOptional, IsString } from 'class-validator';

import { WorkspaceIdRequestBody } from 'modules/workspaces/workspaces.interface';

export interface GenericInputSpecification {
  input_specification?: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>;
  };
}

export interface AuthSpecification extends GenericInputSpecification {
  token_url?: string;
  auth_mode?: string;
  authorization_url?: string;
  authorization_params?: Record<string, string>;
  token_params?: Record<string, string>;
  refresh_params?: Record<string, string>;
  scope_seperator?: string;
  default_scopes?: string[];
  headers?: Record<string, string>;
}

export interface Specification {
  auth_specification: Record<string, AuthSpecification>;
  other_inputs?: GenericInputSpecification;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  other_data?: Record<string, any>
}

export class IntegrationDefinitionRequestIdBody {
  /**
   * A unique identifier for Integration Definition
   */
  @IsString()
  integrationDefinitionId: string;
}

export class IntegrationDefinitionSpec {
  spec: Specification;
}

export class IntegrationDefinitionCreateBody extends WorkspaceIdRequestBody {
  @IsObject()
  name: IntegrationName;

  @IsString()
  icon: string;

  @IsJSON()
  spec: Specification;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  scopes: string;
}

export class IntegrationDefinitionUpdateBody {
  @IsOptional()
  @IsJSON()
  spec: Specification;

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  clientSecret: string;

  @IsOptional()
  @IsString()
  scopes: string;
}
