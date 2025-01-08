import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TemplateCategoryEnum } from './template.entity';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsEnum(TemplateCategoryEnum)
  category: TemplateCategoryEnum;

  // TODO: Manoj change this when you have finalised the issue thing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>;

  @IsOptional()
  @IsString()
  teamId?: string;
}
