import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum TeamType {
  ENGINEERING = 'engineering',
  SUPPORT = 'support',
}

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
  @IsEnum(TeamType)
  teamType?: TeamType;
}
