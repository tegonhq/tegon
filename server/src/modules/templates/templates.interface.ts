/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { IsOptional, IsString } from 'class-validator';

export class CreateTemplateInput {
  @IsString()
  name: string;

  @IsString()
  type: string;

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

  templateData: Record<string, any>;
}

export class TemplateRequestIdParams {
  @IsString()
  templateId: string;
}

export class RequestIdParams {
  @IsOptional()
  @IsString()
  workspaceId: string

  @IsOptional()
  @IsString()
  teamId: string
}