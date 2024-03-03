/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { User } from '@@generated/user/entities';
import { IsString } from 'class-validator';

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

export function userSerializer(user: User) {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    fullname: user.fullname,
    username: user.username,
    role: user.role,
    initialSetupComplete: user.initialSetupComplete,
    anonymousDataCollection: user.anonymousDataCollection,

    workspaces: user.usersOnWorkspaces.map(
      (uWorkspace) => uWorkspace.workspace,
    ),
  };
}
