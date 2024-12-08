import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SignedURLBody {
  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  originalName: string;

  @IsOptional()
  @IsString()
  contentType: string;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  mimetype: string;
}
