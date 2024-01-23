/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;
}

export class CreateUserInput {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;
}

export class CreateTokenBody {
  @IsString()
  name: string;

  @IsNumber()
  seconds: number;
}
