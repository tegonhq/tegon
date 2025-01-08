import { IsOptional, IsString } from 'class-validator';

export class UpdateCycleDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
