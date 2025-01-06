import { IsOptional, IsString } from 'class-validator';

export class UpdateCycleDateDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
