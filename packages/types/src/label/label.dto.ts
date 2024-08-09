import { IsString } from 'class-validator';

export class LabelRequestParamsDto {
  @IsString()
  labelId: string;
}
