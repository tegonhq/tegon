import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

import { UserTypeEnum } from '../index';

export class CreateConversationHistoryDto {
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

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  conversationId: string;
}
