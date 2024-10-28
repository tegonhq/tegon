import { IsOptional, IsString } from 'class-validator';

export class CreateProjectMilestoneDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
