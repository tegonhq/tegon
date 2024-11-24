import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTeamPreferencesDto {
  @IsOptional()
  @IsBoolean()
  cyclesEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  triage?: boolean;
}
