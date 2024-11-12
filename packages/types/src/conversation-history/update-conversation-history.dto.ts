import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

import { UserTypeEnum } from '../index';

export class UpdateConversationHistoryDto {
  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(UserTypeEnum)
  @IsOptional()
  userType?: UserTypeEnum;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsObject()
  @IsOptional()
  thoughts?: Record<string, any>;

  @IsString()
  @IsOptional()
  userId?: string;
}
