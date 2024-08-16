import { IsString } from 'class-validator';

export class WorkflowRequestParamsDto {
  @IsString()
  teamId: string;
}
