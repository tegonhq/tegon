import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

import { UserTypeEnum } from '../conversation-history';

export class CreateConversationDto {
  @IsString()
  message: string;

  @IsEnum(UserTypeEnum)
  userType: UserTypeEnum;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsObject()
  @IsOptional()
  thoughts?: Record<string, any>;
}
