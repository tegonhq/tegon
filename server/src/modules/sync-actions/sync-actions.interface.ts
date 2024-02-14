/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

export class BootstrapRequestQuery {
  @IsString()
  workspaceId: string;

  @IsString()
  modelName: string;
}

export class DeltaRequestQuery {
  @IsString()
  workspaceId: string;

  @IsString()
  modelName: string;

  @IsString()
  lastSequenceId: string;
}
