import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class TeamRequestParamsDto {
  @IsString()
  teamId: string;
}

export class TeamPreferenceDto {
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
