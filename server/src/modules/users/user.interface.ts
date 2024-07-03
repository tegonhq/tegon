/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { User } from '@@generated/user/entities';
import { Role } from '@prisma/client';
import { IsArray, IsString } from 'class-validator';

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

export class UserIdsBody {
  @IsArray()
  userIds: string[];
}

export interface PublicUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
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

export interface InviteUsersBody {
  emailIds: string;
  workspaceId: string;
  teamIds: string[];
  role: Role;
}
