import { IsOptional, IsString } from 'class-validator';

export class GetLabelsDTO {
  @IsString()
  workspaceId: string;

  @IsString()
  @IsOptional()
  teamId: string;
}
