import { IsString } from "class-validator";

export class BootstrapRequestQuery {
  @IsString()
  workspaceId: string;

  @IsString()
  modelNames: string;

  @IsString()
  userId: string;
}

export class DeltaRequestQuery {
  @IsString()
  workspaceId: string;

  @IsString()
  modelNames: string;

  @IsString()
  lastSequenceId: string;

  @IsString()
  userId: string;
}
