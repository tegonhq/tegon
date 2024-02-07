/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsJSON, IsString } from 'class-validator';

export class CreateTeamInput {
  @IsString()
  modelName: string;

  @IsString()
  modelId: string;

  @IsString()
  action: actionType;

  @IsJSON()
  data: Record<string, any>;
}

export enum actionType {
  I,
  U,
  D,
}
