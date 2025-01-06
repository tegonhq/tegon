import { IsObject, IsOptional } from 'class-validator';

export class UpdateConversationDto {
  @IsOptional()
  @IsObject()
  context?: any;
}
