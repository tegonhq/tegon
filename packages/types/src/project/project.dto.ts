import { IsString } from 'class-validator';

export class ProjectRequestParamsDto {
  @IsString()
  projectId: string;
}

export class ProjectMilestoneRequestParamsDto {
  @IsString()
  projectMilestoneId: string;
}
