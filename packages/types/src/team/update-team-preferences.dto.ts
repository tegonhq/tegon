import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateTeamPreferencesDto {
  @IsOptional()
  @IsBoolean()
  cyclesEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  cyclesFrequency?: number; // Number of Weeks

  @IsOptional()
  @IsNumber()
  upcomingCycles?: number; // Number of cycles to create

  @IsOptional()
  @IsBoolean()
  triage?: boolean;
}
