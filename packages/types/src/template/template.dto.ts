import { IsString } from 'class-validator';

export class TemplateIdDto {
  @IsString()
  templateId: string;
}
