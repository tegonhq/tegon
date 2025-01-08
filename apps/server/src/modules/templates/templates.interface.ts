import { IsOptional, IsString } from 'class-validator';

export class RequestIdParams {
  @IsOptional()
  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  teamId: string;
}
