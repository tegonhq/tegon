import { Spec, WorkspaceRequestParamsDto } from '@tegonhq/types';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class IntegrationDefinitionRequestIdBody {
  /**
   * A unique identifier for Integration Definition
   */
  @IsString()
  integrationDefinitionId: string;
}

export class IntegrationDefinitionSpec {
  spec: Spec;
}

export class IntegrationDefinitionCreateBody extends WorkspaceRequestParamsDto {
  @IsObject()
  name: string;

  @IsString()
  icon: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;
}

export class IntegrationDefinitionUpdateBody {
  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  clientSecret: string;
}
