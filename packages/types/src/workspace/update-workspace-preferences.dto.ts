import { IsEnum, IsOptional } from 'class-validator';

export enum PriorityType {
  'DescriptivePriority' = 'DescriptivePriority',
  'ShorthandPriority' = 'ShorthandPriority',
}

export class UpdateWorkspacePreferencesDto {
  @IsOptional()
  @IsEnum(PriorityType)
  priorityType?: PriorityType;
}
