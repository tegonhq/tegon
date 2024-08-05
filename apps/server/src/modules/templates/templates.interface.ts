import { TemplateCategoryEnum } from '@tegonhq/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTemplateInput {
  @IsString()
  name: string;

  @IsEnum(TemplateCategoryEnum)
  category: TemplateCategoryEnum;

  // TODO: Manoj change this when you have finalised the issue thing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}

export class UpdateTemplateInput {
  @IsOptional()
  @IsString()
  name?: string;

  // TODO: Manoj change this when you have finalised the issue thing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>;
}

export class TemplateRequestIdParams {
  @IsString()
  templateId: string;
}

export class RequestIdParams {
  @IsOptional()
  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  teamId: string;
}
