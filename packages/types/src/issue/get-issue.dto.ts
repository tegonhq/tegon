import { IsNumber, IsObject, IsString } from 'class-validator';

import { FilterKey, FilterValue } from '../view';

export class GetIssuesByFilterDTO {
  @IsObject()
  filters: Record<FilterKey, FilterValue>;

  @IsString()
  workspaceId: string;
}

export class GetIssuesByNumberDTO {
  @IsNumber()
  number: number;
}
