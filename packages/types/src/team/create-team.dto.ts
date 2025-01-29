import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpdateTeamPreferencesDto } from './update-team-preferences.dto';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  identifier: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTeamPreferencesDto)
  preferences?: UpdateTeamPreferencesDto;
}
