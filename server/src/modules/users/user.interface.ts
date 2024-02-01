/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from "class-validator";

export class UserIdParams {
    @IsString()
    userId: string;
  }
  

export class UpdateUserBody {
    @IsString()
    fullname: string;

    @IsString()
    username: string;
  }