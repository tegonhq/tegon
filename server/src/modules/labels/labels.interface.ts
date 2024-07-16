import { IsOptional, IsString } from 'class-validator';

export class CreateLabelInput {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}

export class UpdateLabelInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}

export class LabelRequestIdParams {
  @IsString()
  labelId: string;
}

export class RequestIdParams {
  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}
