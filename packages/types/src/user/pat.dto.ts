import { IsString } from 'class-validator';

export class PatIdDto {
  @IsString()
  patId: string;
}
