import { IsOptional, IsString } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}
