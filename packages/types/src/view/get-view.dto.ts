import { IsString } from 'class-validator';

export class GetViewRequestIdDTO {
  @IsString()
  viewId: string;
}
