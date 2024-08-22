import { IsObject, IsString } from 'class-validator';

import { FilterKey, FilterValue } from '../view';

export class GetIssuesByFilterDTO {
  @IsObject()
  filters: Record<FilterKey, FilterValue>;

  @IsString()
  workspaceId: string;
}
