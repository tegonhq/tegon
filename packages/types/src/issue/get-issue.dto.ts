import { IsNumber, IsObject, IsString } from 'class-validator';

import { FilterKey, FilterValue } from '../view';

export class GetIssuesByFilterDTO {
  @IsObject()
  filters: {
    [K in FilterKey]?: FilterValue;
  };

  @IsString()
  workspaceId: string;
}

export class GetIssuesByNumberDTO {
  @IsNumber()
  number: number;
}
