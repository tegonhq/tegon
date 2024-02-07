/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { IsString } from 'class-validator';

import { User } from '@@generated/user/entities';

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

    workspaces: user.UsersOnWorkspaces.map(
      (uWorkspace) => uWorkspace.workspace,
    ),
  };
}
