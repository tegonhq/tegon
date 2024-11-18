import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectMilestoneDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
