import { IsString } from 'class-validator';

export class TeamRequestParamsDto {
  @IsString()
  teamId: string;
}
