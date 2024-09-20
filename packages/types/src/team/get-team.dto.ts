import { IsString } from 'class-validator';

import { WorkspaceRequestParamsDto } from '../workspace';

export class GetTeamByNameDto extends WorkspaceRequestParamsDto {
  @IsString()
  slug: string;
}
