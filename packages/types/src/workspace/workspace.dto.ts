import { IsString } from 'class-validator';

export class WorkspaceRequestParamsDto {
  @IsString()
  workspaceId: string;
}

export class WorkspaceSlugParamsDTO {
  @IsString()
  slug: string;
}
